package dnsauth

import (
	"context"
	"fmt"
	"net"
	"strings"
	"sync"
	"time"
)

const QueryTimeout = 8 * time.Second

var zoneCache sync.Map // string zone -> *AuthDNS

func BootstrapResolver() *net.Resolver {
	return &net.Resolver{
		PreferGo: true,
		Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{Timeout: 4 * time.Second}
			var last error
			for _, dns := range []string{"1.1.1.1:53", "8.8.8.8:53"} {
				c, err := d.DialContext(ctx, network, dns)
				if err == nil {
					return c, nil
				}
				last = err
			}
			return nil, last
		},
	}
}

func ResolverDialing(ips []string) *net.Resolver {
	return &net.Resolver{
		PreferGo: true,
		Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{Timeout: 4 * time.Second}
			var last error
			for _, ip := range ips {
				c, err := d.DialContext(ctx, network, net.JoinHostPort(ip, "53"))
				if err == nil {
					return c, nil
				}
				last = err
			}
			return nil, last
		},
	}
}

type AuthDNS struct {
	Zone    string
	NSHosts []string
	NSIPs   []string
}

func (a *AuthDNS) NSLabel() string {
	if a == nil || len(a.NSHosts) == 0 {
		return ""
	}
	out := make([]string, 0, len(a.NSHosts))
	for _, h := range a.NSHosts {
		out = append(out, strings.TrimSuffix(h, "."))
	}
	return strings.Join(out, ", ")
}

func New(zone string) (*AuthDNS, error) {
	zone = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(zone)), ".")
	if zone == "" {
		return nil, fmt.Errorf("empty zone")
	}
	if v, ok := zoneCache.Load(zone); ok {
		return v.(*AuthDNS), nil
	}
	ctx, cancel := context.WithTimeout(context.Background(), QueryTimeout)
	defer cancel()
	boot := BootstrapResolver()
	nsList, err := boot.LookupNS(ctx, zone)
	if err != nil {
		return nil, err
	}
	if len(nsList) == 0 {
		return nil, fmt.Errorf("no NS for %s", zone)
	}
	a := &AuthDNS{Zone: zone}
	seenIP := map[string]struct{}{}
	for _, ns := range nsList {
		host := strings.TrimSuffix(strings.ToLower(ns.Host), ".")
		if host == "" {
			continue
		}
		a.NSHosts = append(a.NSHosts, host)
		addrs, err := boot.LookupIPAddr(ctx, host)
		if err != nil {
			continue
		}
		for _, addr := range addrs {
			ip := addr.IP.String()
			if ip == "" {
				continue
			}
			if _, ok := seenIP[ip]; ok {
				continue
			}
			seenIP[ip] = struct{}{}
			a.NSIPs = append(a.NSIPs, ip)
		}
	}
	if len(a.NSIPs) == 0 {
		return nil, fmt.Errorf("no NS addresses for %s", zone)
	}
	zoneCache.Store(zone, a)
	return a, nil
}

func ForName(name string) (*AuthDNS, error) {
	name = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(name)), ".")
	if name == "" {
		return nil, fmt.Errorf("empty name")
	}
	labels := strings.Split(name, ".")
	if len(labels) < 2 {
		return nil, fmt.Errorf("no zone for %s", name)
	}
	var last error
	for i := 0; i < len(labels)-1; i++ {
		zone := strings.Join(labels[i:], ".")
		a, err := New(zone)
		if err == nil {
			return a, nil
		}
		last = err
	}
	if last == nil {
		last = fmt.Errorf("no NS for %s", name)
	}
	return nil, last
}

func (a *AuthDNS) LookupTXT(ctx context.Context, name string) ([]string, error) {
	ctx, cancel := withTimeout(ctx)
	defer cancel()
	name = norm(name)
	if a != nil && len(a.NSIPs) > 0 {
		txts, err := ResolverDialing(a.NSIPs).LookupTXT(ctx, name)
		if err == nil {
			return txts, nil
		}
	}
	return BootstrapResolver().LookupTXT(ctx, name)
}

func (a *AuthDNS) LookupMX(ctx context.Context, name string) ([]*net.MX, error) {
	ctx, cancel := withTimeout(ctx)
	defer cancel()
	name = norm(name)
	if a != nil && len(a.NSIPs) > 0 {
		mxs, err := ResolverDialing(a.NSIPs).LookupMX(ctx, name)
		if err == nil {
			return mxs, nil
		}
	}
	return BootstrapResolver().LookupMX(ctx, name)
}

func (a *AuthDNS) LookupIPAddr(ctx context.Context, name string) ([]net.IPAddr, error) {
	ctx, cancel := withTimeout(ctx)
	defer cancel()
	name = norm(name)
	if a != nil && len(a.NSIPs) > 0 {
		addrs, err := ResolverDialing(a.NSIPs).LookupIPAddr(ctx, name)
		if err == nil {
			return addrs, nil
		}
	}
	return BootstrapResolver().LookupIPAddr(ctx, name)
}

func (a *AuthDNS) LookupHost(ctx context.Context, name string) ([]string, error) {
	addrs, err := a.LookupIPAddr(ctx, name)
	if err != nil {
		return nil, err
	}
	out := make([]string, 0, len(addrs))
	seen := map[string]struct{}{}
	for _, addr := range addrs {
		s := addr.IP.String()
		if s == "" {
			continue
		}
		if _, ok := seen[s]; ok {
			continue
		}
		seen[s] = struct{}{}
		out = append(out, s)
	}
	if len(out) == 0 {
		return nil, &net.DNSError{Err: "no such host", Name: name, IsNotFound: true}
	}
	return out, nil
}

func LookupTXT(ctx context.Context, name string) ([]string, error) {
	a, err := ForName(name)
	if err != nil {
		ctx, cancel := withTimeout(ctx)
		defer cancel()
		return BootstrapResolver().LookupTXT(ctx, norm(name))
	}
	return a.LookupTXT(ctx, name)
}

func LookupMX(ctx context.Context, name string) ([]*net.MX, error) {
	a, err := ForName(name)
	if err != nil {
		ctx, cancel := withTimeout(ctx)
		defer cancel()
		return BootstrapResolver().LookupMX(ctx, norm(name))
	}
	return a.LookupMX(ctx, name)
}

func LookupHost(ctx context.Context, name string) ([]string, error) {
	a, err := ForName(name)
	if err != nil {
		ctx, cancel := withTimeout(ctx)
		defer cancel()
		return BootstrapResolver().LookupHost(ctx, norm(name))
	}
	return a.LookupHost(ctx, name)
}

func LookupIPAddr(ctx context.Context, name string) ([]net.IPAddr, error) {
	a, err := ForName(name)
	if err != nil {
		ctx, cancel := withTimeout(ctx)
		defer cancel()
		return BootstrapResolver().LookupIPAddr(ctx, norm(name))
	}
	return a.LookupIPAddr(ctx, name)
}

func LookupAddr(ctx context.Context, addr string) ([]string, error) {
	ctx, cancel := withTimeout(ctx)
	defer cancel()
	return BootstrapResolver().LookupAddr(ctx, addr)
}

func withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
	if ctx == nil {
		ctx = context.Background()
	}
	return context.WithTimeout(ctx, QueryTimeout)
}

func norm(name string) string {
	return strings.TrimSuffix(strings.ToLower(strings.TrimSpace(name)), ".")
}
