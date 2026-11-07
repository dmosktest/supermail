package analyze

import (
	"fmt"
	"strings"
)

type dmarcPolicy struct {
	Raw    string
	P      string
	SP     string
	ASPF   string
	ADKIM  string
	RUA    string
	RUF    string
	Pct    string
}

func parseDMARC(rec string) dmarcPolicy {
	p := dmarcPolicy{Raw: rec, P: "none", ASPF: "r", ADKIM: "r"}
	for _, part := range strings.Split(rec, ";") {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		k, v, ok := strings.Cut(part, "=")
		if !ok {
			continue
		}
		k = strings.ToLower(strings.TrimSpace(k))
		v = strings.TrimSpace(v)
		switch k {
		case "p":
			p.P = strings.ToLower(v)
		case "sp":
			p.SP = strings.ToLower(v)
		case "aspf":
			p.ASPF = strings.ToLower(v)
		case "adkim":
			p.ADKIM = strings.ToLower(v)
		case "rua":
			p.RUA = v
		case "ruf":
			p.RUF = v
		case "pct":
			p.Pct = v
		}
	}
	return p
}

func dmarcRecordFindings(host, rec string, pol dmarcPolicy) []Finding {
	out := []Finding{}
	switch pol.P {
	case "reject":
		out = append(out, f("DMARC1", "DMARC1_REJECT", "ok", "DMARC permit policy (reject)", rec, "", -0.5))
	case "quarantine":
		out = append(out, f("DMARC1", "DMARC1_QUAR", "ok", "DMARC quarantine policy", rec, "", -0.3))
	default:
		out = append(out, f("DMARC1", "DMARC1_NONE", "low", "DMARC policy is monitoring-only (p=none)", rec,
			"Move to p=quarantine then p=reject when ready.", 0.2))
	}
	if pol.RUA != "" {
		out = append(out, f("DMARC3", "DMARC3_RUA", "ok", "DMARC rua (aggregate reports) set",
			pol.RUA, "", -0.05))
	} else {
		out = append(out, f("DMARC3", "DMARC3_RUA_MISSING", "low", "DMARC rua not set",
			host, "Add rua=mailto:… to receive aggregate DMARC reports.", 0.15))
	}
	if pol.RUF != "" {
		out = append(out, f("DMARC3", "DMARC3_RUF", "info", "DMARC ruf (failure reports) set",
			pol.RUF, "", 0))
	}
	extra := []string{}
	if pol.ASPF != "" {
		extra = append(extra, "aspf="+pol.ASPF)
	}
	if pol.ADKIM != "" {
		extra = append(extra, "adkim="+pol.ADKIM)
	}
	if pol.SP != "" {
		extra = append(extra, "sp="+pol.SP)
	}
	if pol.Pct != "" {
		extra = append(extra, "pct="+pol.Pct)
	}
	if len(extra) > 0 {
		out = append(out, f("DMARC3", "DMARC3_OPTS", "info", "DMARC alignment / scope options",
			strings.Join(extra, "; "), "", 0))
	}
	return out
}

func checkDMARCAlignment(fromDomain, mailFromDomain string, spf spfEvalResult, dkimDomains []string, pol dmarcPolicy) []Finding {
	fromDomain = strings.ToLower(strings.TrimSuffix(fromDomain, "."))
	mailFromDomain = strings.ToLower(strings.TrimSuffix(mailFromDomain, "."))
	if fromDomain == "" {
		return nil
	}
	spfStrict := pol.ASPF == "s"
	dkimStrict := pol.ADKIM == "s"

	spfAligned := false
	if spf.Outcome == spfPass && mailFromDomain != "" {
		spfAligned = domainsAligned(fromDomain, mailFromDomain, spfStrict)
	}
	dkimAligned := false
	var alignedDKIM string
	for _, d := range dkimDomains {
		if domainsAligned(fromDomain, d, dkimStrict) {
			dkimAligned = true
			alignedDKIM = d
			break
		}
	}

	detail := fmt.Sprintf("From=%s; SPF(%s,%s aligned=%v); DKIM(d=%s aligned=%v); aspf=%s adkim=%s",
		fromDomain, spf.Outcome, mailFromDomain, spfAligned, strings.Join(dkimDomains, ","), dkimAligned, pol.ASPF, pol.ADKIM)

	if spfAligned || dkimAligned {
		how := "SPF"
		if dkimAligned && !spfAligned {
			how = "DKIM d=" + alignedDKIM
		} else if dkimAligned && spfAligned {
			how = "SPF+DKIM"
		}
		return []Finding{f("DMARC2", "DMARC2_ALIGN_PASS", "ok", "DMARC alignment pass ("+how+")", detail, "", -0.5)}
	}
	if spf.Outcome == spfNone && len(dkimDomains) == 0 {
		return []Finding{f("DMARC2", "DMARC2_ALIGN_NA", "info", "DMARC alignment not evaluated", detail, "", 0)}
	}
	sev, spam := "medium", 0.8
	if pol.P == "reject" {
		sev, spam = "high", 1.2
	}
	return []Finding{f("DMARC2", "DMARC2_ALIGN_FAIL", sev, "DMARC alignment fail", detail,
		"Make SPF Mail-From or DKIM d= align with From (relaxed or strict per aspf/adkim).", spam)}
}

func domainsAligned(from, auth string, strict bool) bool {
	from = strings.ToLower(strings.TrimSuffix(from, "."))
	auth = strings.ToLower(strings.TrimSuffix(auth, "."))
	if from == "" || auth == "" {
		return false
	}
	if from == auth {
		return true
	}
	if strict {
		return false
	}
	return strings.HasSuffix(from, "."+auth) || strings.HasSuffix(auth, "."+from) ||
		orgDomain(from) == orgDomain(auth)
}

func orgDomain(d string) string {
	parts := strings.Split(d, ".")
	if len(parts) < 2 {
		return d
	}
	return parts[len(parts)-2] + "." + parts[len(parts)-1]
}
