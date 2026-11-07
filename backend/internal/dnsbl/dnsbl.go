package dnsbl

import (
	"context"
	"fmt"
	"net"
	"net/netip"
	"strings"
	"sync"
	"time"
)

var Lists = []string{
	"zen.spamhaus.org",
	"bl.spamcop.net",
	"b.barracudacentral.org",
	"dnsbl.sorbs.net",
	"psbl.surriel.com",
	"dnsbl-1.uceprotect.net",
	"cbl.abuseat.org",
	"spam.dnsbl.anonmails.de",
	"bl.mailspike.net",
	"truncate.gbudb.net",
	"dyna.spamrats.com",
	"spam.spamrats.com",
	"noptr.spamrats.com",
	"dnsbl.dronebl.org",
	"all.s5h.net",
	"dnsbl.spfbl.net",
	"ubl.unsubscore.com",
	"db.wpbl.info",
	"rbl.interserver.net",
	"dnsbl.zapbl.net",
}

type Result struct {
	IP      string   `json:"ip"`
	Listed  []string `json:"listed"`
	Checked int      `json:"checked"`
	Errors  []string `json:"errors,omitempty"`
}

func ReverseIP(ip string) (string, error) {
	parsed := net.ParseIP(ip)
	if parsed == nil {
		return "", fmt.Errorf("invalid ip")
	}
	v4 := parsed.To4()
	if v4 == nil {
		return "", fmt.Errorf("ipv6 dnsbl not supported")
	}
	parts := strings.Split(v4.String(), ".")
	if len(parts) != 4 {
		return "", fmt.Errorf("invalid ipv4")
	}
	return parts[3] + "." + parts[2] + "." + parts[1] + "." + parts[0], nil
}

func listedA(addrs []string) bool {
	for _, s := range addrs {
		ip, err := netip.ParseAddr(s)
		if err != nil || !ip.Is4() {
			continue
		}
		a := ip.As4()
		if a[0] != 127 {
			continue
		}
		if a[1] == 255 && a[2] == 255 {
			continue
		}
		return true
	}
	return false
}

func Check(ctx context.Context, ip string) Result {
	out := Result{IP: ip, Listed: []string{}, Checked: len(Lists)}
	rev, err := ReverseIP(ip)
	if err != nil {
		out.Errors = append(out.Errors, err.Error())
		out.Checked = 0
		return out
	}

	resolver := net.DefaultResolver
	var mu sync.Mutex
	var wg sync.WaitGroup
	for _, zone := range Lists {
		wg.Add(1)
		go func(z string) {
			defer wg.Done()
			cctx, cancel := context.WithTimeout(ctx, 4*time.Second)
			defer cancel()
			host := rev + "." + z
			addrs, err := resolver.LookupHost(cctx, host)
			mu.Lock()
			defer mu.Unlock()
			if err != nil {
				return
			}
			if listedA(addrs) {
				out.Listed = append(out.Listed, z)
			}
		}(zone)
	}
	wg.Wait()
	return out
}
