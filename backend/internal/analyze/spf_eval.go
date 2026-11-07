package analyze

import (
	"context"
	"fmt"
	"net"
	"net/netip"
	"strings"
	"time"

	"supermail/internal/dnsauth"
)

type spfOutcome string

const (
	spfPass      spfOutcome = "pass"
	spfFail      spfOutcome = "fail"
	spfSoftfail  spfOutcome = "softfail"
	spfNeutral   spfOutcome = "neutral"
	spfNone      spfOutcome = "none"
	spfTempError spfOutcome = "temperror"
	spfPermError spfOutcome = "permerror"
)

type spfEvalResult struct {
	Outcome spfOutcome
	Detail  string
}

func evalSPF(ctx context.Context, clientIP, domain string) spfEvalResult {
	domain = strings.ToLower(strings.TrimSuffix(strings.TrimSpace(domain), "."))
	if domain == "" {
		return spfEvalResult{Outcome: spfNone, Detail: "no MAIL FROM / From domain"}
	}
	ip, err := netip.ParseAddr(clientIP)
	if err != nil || !ip.IsValid() {
		return spfEvalResult{Outcome: spfNone, Detail: "no usable client IP for SPF"}
	}
	if ip.Is4In6() {
		ip = ip.Unmap()
	}
	res, detail, _, err := spfCheck(ctx, domain, ip, 0, map[string]bool{})
	if err != nil {
		return spfEvalResult{Outcome: spfTempError, Detail: err.Error()}
	}
	return spfEvalResult{Outcome: res, Detail: detail}
}

func spfEvalFindings(r spfEvalResult, domain string) []Finding {
	domain = strings.ToLower(strings.TrimSuffix(strings.TrimSpace(domain), "."))
	free := domain != "" && freemailDomains[domain]
	switch r.Outcome {
	case spfPass:
		return []Finding{f("SPF2", "SPF2_PASS", "ok", "SPF evaluation pass for sending IP", r.Detail, "", -0.4)}
	case spfFail:
		if free {
			return []Finding{f("SPF2", "SPF2_FAIL_FREEMAIL", "info", "SPF fail on freemail path (informational)", r.Detail,
				"Not something you fix on Mail.ru/Gmail/etc.: freemail SPF is owned by the provider. For your own domain, authorize the sending IP in SPF.", 0)}
		}
		return []Finding{f("SPF2", "SPF2_FAIL", "high", "SPF evaluation fail for sending IP", r.Detail,
			"Authorize this sending IP (or include) in the SPF TXT, or send from an authorized host.", 1.6)}
	case spfSoftfail:
		if free {
			return []Finding{f("SPF2", "SPF2_SOFTFAIL_FREEMAIL", "info", "SPF softfail on freemail path (informational)", r.Detail,
				"Typical for some freemail/ESP hops — not a sender config error. Ignore for personal freemail; for your domain, list the outbound IP.", 0)}
		}
		return []Finding{f("SPF2", "SPF2_SOFTFAIL", "low", "Sending IP got SPF softfail", r.Detail,
			"Add the outbound IP or the right include to the domain’s SPF TXT so the check returns pass.", 0.3)}
	case spfNeutral:
		if free {
			return []Finding{f("SPF2", "SPF2_NEUTRAL_FREEMAIL", "info", "SPF neutral on freemail path (informational)", r.Detail,
				"Not a bug and not your fault: Mail.ru/Gmail-style SPF often ends neutral for this hop. No grade penalty.", 0)}
		}
		return []Finding{f("SPF2", "SPF2_NEUTRAL", "info", "SPF neutral for sending IP (no policy assertion)", r.Detail,
			"Neutral means SPF neither passed nor failed this IP. Often normal with complex includes; only tighten SPF if this is your domain and you expected pass.", 0)}
	case spfNone:
		return []Finding{f("SPF2", "SPF2_NONE", "info", "SPF evaluation skipped / none", r.Detail, "", 0)}
	case spfTempError:
		return []Finding{f("SPF2", "SPF2_TEMPERROR", "info", "SPF temporary DNS error", r.Detail, "", 0)}
	case spfPermError:
		if strings.Contains(strings.ToLower(r.Detail), "multiple spf") {
			if free {
				return []Finding{f("SPF2", "SPF2_MULTI_FREEMAIL", "info", "Multiple SPF TXT on freemail path (informational)", r.Detail,
					"Provider DNS — nothing to fix on personal freemail.", 0)}
			}
			return []Finding{f("SPF2", "SPF2_MULTI", "high", "Multiple SPF TXT records (SPF permerror)", r.Detail,
				"Keep exactly one TXT starting with v=spf1; merge mechanisms into a single record.", 1.5)}
		}
		if free {
			return []Finding{f("SPF2", "SPF2_PERMERROR_FREEMAIL", "info", "SPF parse issue on freemail path (informational)", r.Detail,
				"Provider SPF can be too complex for a full local eval. Not a reason to change your personal freemail settings.", 0)}
		}
		return []Finding{f("SPF2", "SPF2_PERMERROR", "medium", "SPF permanent error (bad record)", r.Detail,
			"Fix the SPF TXT syntax and DNS publication.", 0.6)}
	default:
		return nil
	}
}

func spfCheck(ctx context.Context, domain string, ip netip.Addr, depth int, seen map[string]bool) (spfOutcome, string, int, error) {
	if depth > 10 {
		return spfPermError, "too many DNS lookups", 0, nil
	}
	if seen[domain] {
		return spfPermError, "SPF include loop: " + domain, 0, nil
	}
	seen[domain] = true

	txts, err := lookupTXT(ctx, domain)
	if err != nil {
		return spfTempError, "", 0, err
	}
	rec := ""
	for _, t := range txts {
		if strings.HasPrefix(strings.ToLower(strings.TrimSpace(t)), "v=spf1") {
			if rec != "" {
				return spfPermError, "multiple SPF TXT records on " + domain, 0, nil
			}
			rec = t
		}
	}
	if rec == "" {
		return spfNone, "no v=spf1 on " + domain, 0, nil
	}

	lookups := 0
	terms := strings.Fields(rec)
	for _, term := range terms[1:] {
		qual := byte('+')
		mech := term
		switch term[0] {
		case '+', '-', '~', '?':
			qual = term[0]
			mech = term[1:]
		}
		name, arg, _ := strings.Cut(mech, ":")
		name = strings.ToLower(name)
		if name == "redirect" {
			target := strings.ToLower(strings.TrimSuffix(arg, "."))
			if target == "" {
				return spfPermError, "empty redirect", lookups, nil
			}
			lookups++
			return spfCheck(ctx, target, ip, depth+1, seen)
		}
		matched := false
		var mErr error
		switch name {
		case "all":
			return applyQual(qual), fmt.Sprintf("IP %s not authorized in SPF TXT for %s (%call)", ip, domain, qual), lookups, nil
		case "ip4":
			matched = spfMatchIP4(arg, ip)
		case "ip6":
			matched = spfMatchIP6(arg, ip)
		case "a":
			lookups++
			matched, mErr = spfMatchA(ctx, firstNonEmpty(arg, domain), ip)
		case "mx":
			lookups++
			matched, mErr = spfMatchMX(ctx, firstNonEmpty(arg, domain), ip, &lookups)
		case "include":
			target := strings.ToLower(strings.TrimSuffix(arg, "."))
			if target == "" {
				return spfPermError, "empty include", lookups, nil
			}
			lookups++
			inc, detail, used, err := spfCheck(ctx, target, ip, depth+1, seen)
			lookups += used
			if err != nil {
				return spfTempError, detail, lookups, err
			}
			if inc == spfPass {
				matched = true
			} else if inc == spfTempError || inc == spfPermError {
				return inc, detail, lookups, nil
			}
		case "exists":
			lookups++
			matched, mErr = spfExists(ctx, arg)
		default:
			continue
		}
		if mErr != nil {
			return spfTempError, mErr.Error(), lookups, mErr
		}
		if matched {
			return applyQual(qual), fmt.Sprintf("%c%s matched IP %s via %s", qual, name, ip, domain), lookups, nil
		}
	}
	return spfNeutral, "no mechanism matched on " + domain + ": " + truncate(rec, 160), lookups, nil
}

func applyQual(q byte) spfOutcome {
	switch q {
	case '+':
		return spfPass
	case '-':
		return spfFail
	case '~':
		return spfSoftfail
	case '?':
		return spfNeutral
	default:
		return spfPass
	}
}

func firstNonEmpty(a, b string) string {
	if strings.TrimSpace(a) != "" {
		return a
	}
	return b
}

func spfMatchIP4(spec string, ip netip.Addr) bool {
	if !ip.Is4() {
		return false
	}
	spec = strings.TrimSpace(spec)
	if spec == "" {
		return false
	}
	if strings.Contains(spec, "/") {
		p, err := netip.ParsePrefix(spec)
		return err == nil && p.Contains(ip)
	}
	a, err := netip.ParseAddr(spec)
	return err == nil && a == ip
}

func spfMatchIP6(spec string, ip netip.Addr) bool {
	if !ip.Is6() {
		return false
	}
	spec = strings.TrimSpace(spec)
	if spec == "" {
		return false
	}
	if strings.Contains(spec, "/") {
		p, err := netip.ParsePrefix(spec)
		return err == nil && p.Contains(ip)
	}
	a, err := netip.ParseAddr(spec)
	return err == nil && a == ip
}

func spfMatchA(ctx context.Context, host string, ip netip.Addr) (bool, error) {
	host = strings.TrimSuffix(strings.ToLower(host), ".")
	cctx, cancel := context.WithTimeout(ctx, 4*time.Second)
	defer cancel()
	addrs, err := dnsauth.LookupIPAddr(cctx, host)
	if err != nil {
		if dnsIsNotFound(err) {
			return false, nil
		}
		return false, err
	}
	for _, a := range addrs {
		parsed, err := netip.ParseAddr(a.IP.String())
		if err == nil && parsed == ip {
			return true, nil
		}
	}
	return false, nil
}

func spfMatchMX(ctx context.Context, host string, ip netip.Addr, lookups *int) (bool, error) {
	host = strings.TrimSuffix(strings.ToLower(host), ".")
	cctx, cancel := context.WithTimeout(ctx, 4*time.Second)
	defer cancel()
	mxs, err := dnsauth.LookupMX(cctx, host)
	if err != nil {
		if dnsIsNotFound(err) {
			return false, nil
		}
		return false, err
	}
	for _, mx := range mxs {
		*lookups++
		ok, err := spfMatchA(ctx, strings.TrimSuffix(mx.Host, "."), ip)
		if err != nil {
			return false, err
		}
		if ok {
			return true, nil
		}
	}
	return false, nil
}

func spfExists(ctx context.Context, name string) (bool, error) {
	name = strings.TrimSuffix(strings.ToLower(name), ".")
	if name == "" {
		return false, nil
	}
	cctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	_, err := dnsauth.LookupIPAddr(cctx, name)
	if err != nil {
		if dnsIsNotFound(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func dnsIsNotFound(err error) bool {
	if err == nil {
		return false
	}
	var dnsErr *net.DNSError
	if ok := errorAsDNS(err, &dnsErr); ok {
		return dnsErr.IsNotFound
	}
	s := strings.ToLower(err.Error())
	return strings.Contains(s, "no such host") || strings.Contains(s, "not found")
}

func errorAsDNS(err error, target **net.DNSError) bool {
	for err != nil {
		if e, ok := err.(*net.DNSError); ok {
			*target = e
			return true
		}
		u, ok := err.(interface{ Unwrap() error })
		if !ok {
			return false
		}
		err = u.Unwrap()
	}
	return false
}
