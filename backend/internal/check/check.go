package check

import (
	"bufio"
	"context"
	"fmt"
	"net"
	"strings"
	"time"

	"supermail/internal/dnsauth"
	"supermail/internal/dnsbl"
)

type Request struct {
	Domain   string `json:"domain"`
	Selector string `json:"selector"`
	IP       string `json:"ip"`
}

type Finding struct {
	ID       string `json:"id"`
	Severity string `json:"severity"`
	Title    string `json:"title"`
	Detail   string `json:"detail"`
	Fix      string `json:"fix,omitempty"`
}

type Records struct {
	MX   []string `json:"mx"`
	SPF  string   `json:"spf"`
	DMARC string  `json:"dmarc"`
	DKIM string   `json:"dkim"`
	BIMI string   `json:"bimi"`
}

type Generators struct {
	SPF      string `json:"spf"`
	DMARC    string `json:"dmarc"`
	DKIMHint string `json:"dkimHint"`
}

type SMTPInfo struct {
	Host     string `json:"host,omitempty"`
	Banner   string `json:"banner,omitempty"`
	STARTTLS bool   `json:"starttls"`
	OK       bool   `json:"ok"`
	Error    string `json:"error,omitempty"`
}

type Report struct {
	Domain    string         `json:"domain"`
	Grade     string         `json:"grade"`
	Score     int            `json:"score"`
	Findings  []Finding      `json:"findings"`
	Records   Records        `json:"records"`
	Generators Generators    `json:"generators"`
	Blacklist dnsbl.Result   `json:"blacklist"`
	SMTP      SMTPInfo       `json:"smtp"`
	PTR       string         `json:"ptr,omitempty"`
}

func NormalizeDomain(raw string) (string, error) {
	d := strings.TrimSpace(strings.ToLower(raw))
	d = strings.TrimPrefix(d, "http://")
	d = strings.TrimPrefix(d, "https://")
	if i := strings.IndexAny(d, "/:#?"); i >= 0 {
		d = d[:i]
	}
	d = strings.Trim(d, ".")
	if d == "" || strings.Contains(d, " ") || !strings.Contains(d, ".") {
		return "", fmt.Errorf("invalid domain")
	}
	if len(d) > 253 {
		return "", fmt.Errorf("domain too long")
	}
	return d, nil
}

func Run(ctx context.Context, req Request) (Report, error) {
	domain, err := NormalizeDomain(req.Domain)
	if err != nil {
		return Report{}, err
	}
	selector := strings.TrimSpace(req.Selector)
	if selector == "" {
		selector = "default"
	}

	rep := Report{
		Domain:   domain,
		Findings: []Finding{},
		Records:  Records{MX: []string{}},
		Generators: Generators{
			SPF:      fmt.Sprintf("v=spf1 include:_spf.%s ~all", domain),
			DMARC:    fmt.Sprintf("v=DMARC1; p=none; rua=mailto:dmarc@%s", domain),
			DKIMHint: fmt.Sprintf("Publish a TXT record at %s._domainkey.%s with your public DKIM key (v=DKIM1; k=rsa; p=...)", selector, domain),
		},
	}

	mxHosts, mxFindings := checkMX(ctx, domain)
	rep.Records.MX = mxHosts
	rep.Findings = append(rep.Findings, mxFindings...)

	spf, spfFindings := checkTXTContains(ctx, domain, "v=spf1", "SPF1", "SPF",
		"No SPF TXT record",
		"SPF record found",
		fmt.Sprintf("Add a TXT record on %s, e.g. v=spf1 mx a ~all (avoid +all).", domain),
	)
	rep.Records.SPF = spf
	rep.Findings = append(rep.Findings, spfFindings...)
	if strings.Contains(strings.ToLower(spf), "+all") {
		rep.Findings = append(rep.Findings, Finding{
			ID: "SPF2", Severity: "high", Title: "SPF uses +all",
			Detail: "A +all mechanism allows any host to send as your domain.",
			Fix:    "Replace +all with ~all or -all.",
		})
	}

	dmarcHost := "_dmarc." + domain
	dmarc, dmarcFindings := checkTXTContains(ctx, dmarcHost, "v=DMARC1", "DMARC1", "DMARC",
		"No DMARC record",
		"DMARC record found",
		fmt.Sprintf("Add TXT on _dmarc.%s: v=DMARC1; p=none; rua=mailto:dmarc@%s", domain, domain),
	)
	rep.Records.DMARC = dmarc
	rep.Findings = append(rep.Findings, dmarcFindings...)
	if dmarc != "" && !strings.Contains(strings.ToLower(dmarc), "p=reject") && !strings.Contains(strings.ToLower(dmarc), "p=quarantine") {
		rep.Findings = append(rep.Findings, Finding{
			ID: "DMARC2", Severity: "low", Title: "DMARC policy is monitoring-only",
			Detail: "p=none does not ask receivers to quarantine or reject failures.",
			Fix:    "After testing, move to p=quarantine then p=reject.",
		})
	}

	dkimHost := selector + "._domainkey." + domain
	dkim, dkimFindings := checkTXTContains(ctx, dkimHost, "v=DKIM1", "DKIM1", "DKIM",
		fmt.Sprintf("No DKIM TXT at %s", dkimHost),
		fmt.Sprintf("DKIM record found at %s", dkimHost),
		rep.Generators.DKIMHint,
	)
	rep.Records.DKIM = dkim
	rep.Findings = append(rep.Findings, dkimFindings...)

	bimiHost := "default._bimi." + domain
	bimiTxts, _ := lookupTXT(ctx, bimiHost)
	for _, t := range bimiTxts {
		if strings.Contains(strings.ToUpper(t), "V=BIMI1") {
			rep.Records.BIMI = t
			rep.Findings = append(rep.Findings, Finding{
				ID: "BIMI1", Severity: "ok", Title: "BIMI record present",
				Detail: "Brand Indicators for Message Identification TXT found.",
			})
			break
		}
	}
	if rep.Records.BIMI == "" {
		rep.Findings = append(rep.Findings, Finding{
			ID: "BIMI1", Severity: "info", Title: "No BIMI record",
			Detail: "Optional. BIMI can show a brand logo in supporting clients after DMARC enforcement.",
		})
	}

	checkIP := strings.TrimSpace(req.IP)
	if checkIP == "" && len(mxHosts) > 0 {
		checkIP = resolveHostIP(ctx, mxHosts[0])
	}
	if checkIP != "" {
		rep.Blacklist = dnsbl.Check(ctx, checkIP)
		if len(rep.Blacklist.Listed) > 0 {
			rep.Findings = append(rep.Findings, Finding{
				ID: "BL1", Severity: "critical", Title: "IP listed on DNSBL",
				Detail: fmt.Sprintf("%s appears on: %s", checkIP, strings.Join(rep.Blacklist.Listed, ", ")),
				Fix:    "Request delisting from each list and stop any open relay / compromised senders.",
			})
		} else if rep.Blacklist.Checked > 0 {
			rep.Findings = append(rep.Findings, Finding{
				ID: "BL1", Severity: "ok", Title: "IP not listed on checked DNSBLs",
				Detail: fmt.Sprintf("%s checked against %d lists.", checkIP, rep.Blacklist.Checked),
			})
		}
		ptrs, _ := dnsauth.LookupAddr(ctx, checkIP)
		if len(ptrs) > 0 {
			rep.PTR = strings.TrimSuffix(ptrs[0], ".")
			rep.Findings = append(rep.Findings, Finding{
				ID: "PTR1", Severity: "ok", Title: "Reverse DNS present",
				Detail: fmt.Sprintf("%s → %s", checkIP, rep.PTR),
			})
		} else {
			rep.Findings = append(rep.Findings, Finding{
				ID: "PTR1", Severity: "medium", Title: "No reverse DNS (PTR)",
				Detail: fmt.Sprintf("No PTR for %s; many receivers treat this as a spam signal.", checkIP),
				Fix:    "Ask your hosting/ISP to set a PTR matching your SMTP hostname.",
			})
		}
	} else {
		rep.Findings = append(rep.Findings, Finding{
			ID: "BL1", Severity: "info", Title: "DNSBL skipped",
			Detail: "Provide an SMTP IP or ensure MX resolves to check blacklists.",
		})
	}

	smtpHost := ""
	if len(mxHosts) > 0 {
		smtpHost = mxHosts[0]
	}
	if smtpHost != "" {
		rep.SMTP = probeSMTP(ctx, smtpHost)
		if rep.SMTP.OK {
			sev := "ok"
			title := "SMTP reachable"
			detail := fmt.Sprintf("%s:25 banner OK", smtpHost)
			if rep.SMTP.STARTTLS {
				detail += "; STARTTLS advertised"
			} else {
				sev = "medium"
				title = "SMTP without STARTTLS"
				detail += "; STARTTLS not advertised"
			}
			rep.Findings = append(rep.Findings, Finding{ID: "SMTP1", Severity: sev, Title: title, Detail: detail})
		} else {
			rep.Findings = append(rep.Findings, Finding{
				ID: "SMTP1", Severity: "medium", Title: "SMTP probe failed",
				Detail: rep.SMTP.Error,
			})
		}
	}

	rep.Score, rep.Grade = score(rep.Findings)
	return rep, nil
}

func checkMX(ctx context.Context, domain string) ([]string, []Finding) {
	mxs, err := dnsauth.LookupMX(ctx, domain)
	if err != nil || len(mxs) == 0 {
		return nil, []Finding{{
			ID: "MX1", Severity: "critical", Title: "No MX records",
			Detail: "Receivers cannot find a mail exchanger for this domain.",
			Fix:    "Add MX records pointing to your mail host.",
		}}
	}
	hosts := make([]string, 0, len(mxs))
	var b strings.Builder
	for i, mx := range mxs {
		h := strings.TrimSuffix(mx.Host, ".")
		hosts = append(hosts, h)
		if i > 0 {
			b.WriteString("; ")
		}
		fmt.Fprintf(&b, "%d %s", mx.Pref, h)
	}
	return hosts, []Finding{{
		ID: "MX1", Severity: "ok", Title: "MX records present",
		Detail: b.String(),
	}}
}

func checkTXTContains(ctx context.Context, host, needle, id, label, missingTitle, okTitle, fix string) (string, []Finding) {
	txts, err := lookupTXT(ctx, host)
	if err != nil || len(txts) == 0 {
		return "", []Finding{{ID: id, Severity: "high", Title: missingTitle, Detail: host + " has no matching TXT.", Fix: fix}}
	}
	upNeedle := strings.ToUpper(needle)
	for _, t := range txts {
		if strings.Contains(strings.ToUpper(t), upNeedle) {
			return t, []Finding{{ID: id, Severity: "ok", Title: okTitle, Detail: t}}
		}
	}
	return "", []Finding{{ID: id, Severity: "high", Title: missingTitle, Detail: "TXT exists but no " + label + " policy matched.", Fix: fix}}
}

func lookupTXT(ctx context.Context, host string) ([]string, error) {
	cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	return dnsauth.LookupTXT(cctx, host)
}

func resolveHostIP(ctx context.Context, host string) string {
	cctx, cancel := context.WithTimeout(ctx, 4*time.Second)
	defer cancel()
	ips, err := dnsauth.LookupIPAddr(cctx, host)
	if err != nil || len(ips) == 0 {
		return ""
	}
	for _, ip := range ips {
		if v4 := ip.IP.To4(); v4 != nil {
			return v4.String()
		}
	}
	return ips[0].IP.String()
}

func probeSMTP(ctx context.Context, host string) SMTPInfo {
	info := SMTPInfo{Host: host}
	d := net.Dialer{Timeout: 6 * time.Second}
	cctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	conn, err := d.DialContext(cctx, "tcp", net.JoinHostPort(host, "25"))
	if err != nil {
		info.Error = err.Error()
		return info
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(8 * time.Second))
	reader := bufio.NewReader(conn)
	banner, err := reader.ReadString('\n')
	if err != nil {
		info.Error = "banner read failed"
		return info
	}
	info.Banner = strings.TrimSpace(banner)
	if !strings.HasPrefix(info.Banner, "220") {
		info.Error = "unexpected banner: " + info.Banner
		return info
	}
	fmt.Fprintf(conn, "EHLO supermail-check.dmosk.net\r\n")
	starttls := false
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			break
		}
		line = strings.TrimSpace(line)
		upper := strings.ToUpper(line)
		if strings.Contains(upper, "STARTTLS") {
			starttls = true
		}
		if len(line) >= 4 && line[3] == ' ' {
			break
		}
	}
	fmt.Fprintf(conn, "QUIT\r\n")
	info.STARTTLS = starttls
	info.OK = true
	return info
}

func score(findings []Finding) (int, string) {
	s := 100
	for _, f := range findings {
		switch f.Severity {
		case "critical":
			s -= 25
		case "high":
			s -= 12
		case "medium":
			s -= 6
		case "low":
			s -= 3
		}
	}
	if s < 0 {
		s = 0
	}
	grade := "F"
	switch {
	case s >= 90:
		grade = "A"
	case s >= 80:
		grade = "B"
	case s >= 65:
		grade = "C"
	case s >= 50:
		grade = "D"
	}
	return s, grade
}
