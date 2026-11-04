package analyze

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net"
	"net/mail"
	"strings"
	"time"

	"supermail/internal/dnsbl"
)

type Finding struct {
	ID       string `json:"id"`
	Severity string `json:"severity"`
	Title    string `json:"title"`
	Detail   string `json:"detail"`
	Fix      string `json:"fix,omitempty"`
}

type MailMeta struct {
	From       string `json:"from"`
	To         string `json:"to"`
	Subject    string `json:"subject"`
	MessageID  string `json:"messageId,omitempty"`
	Date       string `json:"date,omitempty"`
	HasHTML    bool   `json:"hasHtml"`
	HasText    bool   `json:"hasText"`
	RemoteIP   string `json:"remoteIp"`
	Helo       string `json:"helo,omitempty"`
	MailFrom   string `json:"mailFrom,omitempty"`
}

type Report struct {
	Grade    string    `json:"grade"`
	Score    int       `json:"score"`
	Mail     MailMeta  `json:"mail"`
	Findings []Finding `json:"findings"`
	PTR      string    `json:"ptr,omitempty"`
	Blacklist dnsbl.Result `json:"blacklist"`
}

var spamWords = []string{
	"free", "winner", "congratulations", "viagra", "casino", "click here",
	"limited offer", "act now", "guarantee", "no obligation", "risk free",
	"бесплатно", "выигрыш", "гарантия", "срочно", "только сейчас", "акция",
	"скидка 100", "не спам", "кликните",
}

var shortURLHosts = []string{
	"bit.ly", "t.co", "tinyurl.com", "goo.gl", "ow.ly", "is.gd", "buff.ly", "rebrand.ly",
}

func Run(ctx context.Context, raw []byte, remoteIP, helo, mailFrom string) Report {
	meta := MailMeta{
		RemoteIP: remoteIP,
		Helo:     helo,
		MailFrom: mailFrom,
	}
	findings := []Finding{}

	msg, err := mail.ReadMessage(bytes.NewReader(raw))
	if err != nil {
		findings = append(findings, Finding{
			ID: "PARSE1", Severity: "critical", Title: "Could not parse message",
			Detail: err.Error(),
		})
		score, grade := scoreOf(findings)
		return Report{Grade: grade, Score: score, Mail: meta, Findings: findings}
	}

	meta.From = strings.TrimSpace(msg.Header.Get("From"))
	meta.To = strings.TrimSpace(msg.Header.Get("To"))
	meta.Subject = strings.TrimSpace(msg.Header.Get("Subject"))
	meta.MessageID = strings.TrimSpace(msg.Header.Get("Message-Id"))
	meta.Date = strings.TrimSpace(msg.Header.Get("Date"))

	fromDomain := domainOf(meta.From)
	if fromDomain == "" {
		fromDomain = domainOf(mailFrom)
	}

	textBody, htmlBody := extractBodies(msg)
	meta.HasText = strings.TrimSpace(textBody) != ""
	meta.HasHTML = strings.TrimSpace(htmlBody) != ""

	findings = append(findings, checkSubject(meta.Subject)...)
	findings = append(findings, checkContent(textBody, htmlBody)...)
	findings = append(findings, checkAuthHeaders(msg.Header)...)
	findings = append(findings, checkSPFRecord(ctx, fromDomain)...)
	findings = append(findings, checkDMARC(ctx, fromDomain)...)
	findings = append(findings, checkDKIMHeader(msg.Header)...)

	bl := dnsbl.Result{}
	if remoteIP != "" && net.ParseIP(remoteIP) != nil {
		bl = dnsbl.Check(ctx, remoteIP)
		if len(bl.Listed) > 0 {
			findings = append(findings, Finding{
				ID: "BL1", Severity: "critical", Title: "Sending IP listed on DNSBL",
				Detail: fmt.Sprintf("%s → %s", remoteIP, strings.Join(bl.Listed, ", ")),
				Fix:    "Request delisting and stop compromised senders / open relays.",
			})
		} else {
			findings = append(findings, Finding{
				ID: "BL1", Severity: "ok", Title: "Sending IP not listed on checked DNSBLs",
				Detail: fmt.Sprintf("%s checked against %d lists", remoteIP, bl.Checked),
			})
		}
		ptrs, _ := net.DefaultResolver.LookupAddr(ctx, remoteIP)
		ptr := ""
		if len(ptrs) > 0 {
			ptr = strings.TrimSuffix(ptrs[0], ".")
			findings = append(findings, Finding{
				ID: "PTR1", Severity: "ok", Title: "Reverse DNS present",
				Detail: fmt.Sprintf("%s → %s", remoteIP, ptr),
			})
		} else {
			findings = append(findings, Finding{
				ID: "PTR1", Severity: "medium", Title: "No reverse DNS (PTR)",
				Detail: fmt.Sprintf("No PTR for %s", remoteIP),
				Fix:    "Ask the hosting provider to set PTR matching the SMTP hostname.",
			})
		}
		score, grade := scoreOf(findings)
		return Report{Grade: grade, Score: score, Mail: meta, Findings: findings, PTR: ptr, Blacklist: bl}
	}

	score, grade := scoreOf(findings)
	return Report{Grade: grade, Score: score, Mail: meta, Findings: findings, Blacklist: bl}
}

func checkSubject(subject string) []Finding {
	out := []Finding{}
	if subject == "" {
		return []Finding{{ID: "SUB1", Severity: "low", Title: "Empty subject", Detail: "Empty subjects often look suspicious."}}
	}
	letters := 0
	upper := 0
	for _, r := range subject {
		if (r >= 'A' && r <= 'Z') || (r >= 'a' && r <= 'z') || (r >= 'А' && r <= 'Я') || (r >= 'а' && r <= 'я') {
			letters++
			if (r >= 'A' && r <= 'Z') || (r >= 'А' && r <= 'Я') {
				upper++
			}
		}
	}
	if letters >= 6 && float64(upper)/float64(letters) >= 0.7 {
		out = append(out, Finding{
			ID: "SUB2", Severity: "medium", Title: "Subject mostly UPPERCASE",
			Detail: subject,
			Fix:    "Use normal sentence case in the subject.",
		})
	} else {
		out = append(out, Finding{ID: "SUB2", Severity: "ok", Title: "Subject casing looks fine", Detail: subject})
	}
	punct := strings.Count(subject, "!") + strings.Count(subject, "?")
	if punct >= 3 {
		out = append(out, Finding{
			ID: "SUB3", Severity: "low", Title: "Many punctuation marks in subject",
			Detail: fmt.Sprintf("%d of !/? in subject", punct),
		})
	}
	low := strings.ToLower(subject)
	hits := []string{}
	for _, w := range spamWords {
		if strings.Contains(low, w) {
			hits = append(hits, w)
		}
	}
	if len(hits) > 0 {
		out = append(out, Finding{
			ID: "SUB4", Severity: "medium", Title: "Spam-like words in subject",
			Detail: strings.Join(hits, ", "),
			Fix:    "Avoid hard-sell spam vocabulary in the subject line.",
		})
	}
	return out
}

func checkContent(textBody, htmlBody string) []Finding {
	out := []Finding{}
	combined := strings.ToLower(textBody + "\n" + htmlBody)
	if !strings.Contains(combined, "@") && !strings.Contains(combined, "http") && len(strings.TrimSpace(textBody)) < 20 && htmlBody != "" {
		out = append(out, Finding{
			ID: "CNT1", Severity: "medium", Title: "Mostly image / little text",
			Detail: "HTML with almost no text body is a common spam pattern.",
			Fix:    "Include a real text alternative and contact details.",
		})
	} else if strings.TrimSpace(textBody) != "" {
		out = append(out, Finding{ID: "CNT1", Severity: "ok", Title: "Text content present", Detail: "Plain text body found."})
	}

	hits := []string{}
	for _, w := range spamWords {
		if strings.Contains(combined, w) {
			hits = append(hits, w)
		}
	}
	if len(hits) >= 3 {
		out = append(out, Finding{
			ID: "CNT2", Severity: "medium", Title: "Multiple spam-like words in body",
			Detail: strings.Join(unique(hits), ", "),
		})
	}

	for _, h := range shortURLHosts {
		if strings.Contains(combined, h) {
			out = append(out, Finding{
				ID: "CNT3", Severity: "medium", Title: "Shortened URL detected",
				Detail: h,
				Fix:    "Link to the real destination domain instead of public shorteners.",
			})
			break
		}
	}

	if strings.Contains(strings.ToLower(htmlBody), "<script") || strings.Contains(strings.ToLower(htmlBody), "<iframe") {
		out = append(out, Finding{
			ID: "CNT4", Severity: "high", Title: "HTML contains script or iframe",
			Detail: "Interactive HTML is frequently blocked or treated as spam.",
			Fix:    "Remove <script> and <iframe> from email HTML.",
		})
	} else if htmlBody != "" {
		out = append(out, Finding{ID: "CNT4", Severity: "ok", Title: "No script/iframe in HTML", Detail: "HTML looks free of script/iframe tags."})
	}

	if textBody == "" && htmlBody == "" {
		out = append(out, Finding{ID: "CNT5", Severity: "high", Title: "Empty body", Detail: "Message has no text or HTML body."})
	}
	return out
}

func checkAuthHeaders(h mail.Header) []Finding {
	out := []Finding{}
	ar := h.Get("Authentication-Results")
	if ar == "" {
		// some MTAs use authres without us seeing upstream - info only
		out = append(out, Finding{
			ID: "AUTH1", Severity: "info", Title: "No Authentication-Results header",
			Detail: "Upstream MTA did not add Authentication-Results (normal for direct delivery to this test inbox).",
		})
		return out
	}
	low := strings.ToLower(ar)
	if strings.Contains(low, "spf=pass") {
		out = append(out, Finding{ID: "AUTH1", Severity: "ok", Title: "SPF pass (Authentication-Results)", Detail: ar})
	} else if strings.Contains(low, "spf=fail") {
		out = append(out, Finding{ID: "AUTH1", Severity: "high", Title: "SPF fail (Authentication-Results)", Detail: ar})
	}
	if strings.Contains(low, "dkim=pass") {
		out = append(out, Finding{ID: "AUTH2", Severity: "ok", Title: "DKIM pass (Authentication-Results)", Detail: ar})
	} else if strings.Contains(low, "dkim=fail") {
		out = append(out, Finding{ID: "AUTH2", Severity: "high", Title: "DKIM fail (Authentication-Results)", Detail: ar})
	}
	if strings.Contains(low, "dmarc=pass") {
		out = append(out, Finding{ID: "AUTH3", Severity: "ok", Title: "DMARC pass (Authentication-Results)", Detail: ar})
	} else if strings.Contains(low, "dmarc=fail") {
		out = append(out, Finding{ID: "AUTH3", Severity: "high", Title: "DMARC fail (Authentication-Results)", Detail: ar})
	}
	return out
}

func checkSPFRecord(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return []Finding{{ID: "SPF1", Severity: "high", Title: "Cannot determine From domain for SPF", Detail: "Missing From / MAIL FROM domain."}}
	}
	txts, err := lookupTXT(ctx, domain)
	if err != nil || len(txts) == 0 {
		return []Finding{{
			ID: "SPF1", Severity: "high", Title: "No SPF record for From domain",
			Detail: domain,
			Fix:    fmt.Sprintf("Add TXT on %s: v=spf1 mx a ~all", domain),
		}}
	}
	for _, t := range txts {
		if strings.HasPrefix(strings.ToLower(strings.TrimSpace(t)), "v=spf1") {
			sev := "ok"
			detail := t
			if strings.Contains(strings.ToLower(t), "+all") {
				sev = "high"
				return []Finding{{ID: "SPF1", Severity: sev, Title: "SPF uses +all", Detail: detail, Fix: "Replace +all with ~all or -all."}}
			}
			return []Finding{{ID: "SPF1", Severity: "ok", Title: "SPF record present", Detail: detail}}
		}
	}
	return []Finding{{ID: "SPF1", Severity: "high", Title: "No SPF record for From domain", Detail: domain}}
}

func checkDMARC(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return nil
	}
	host := "_dmarc." + domain
	txts, err := lookupTXT(ctx, host)
	if err != nil || len(txts) == 0 {
		return []Finding{{
			ID: "DMARC1", Severity: "high", Title: "No DMARC record",
			Detail: host,
			Fix:    fmt.Sprintf("Add TXT on %s: v=DMARC1; p=none; rua=mailto:dmarc@%s", host, domain),
		}}
	}
	for _, t := range txts {
		if strings.Contains(strings.ToUpper(t), "V=DMARC1") {
			sev := "ok"
			title := "DMARC record present"
			if !strings.Contains(strings.ToLower(t), "p=reject") && !strings.Contains(strings.ToLower(t), "p=quarantine") {
				sev = "low"
				title = "DMARC policy is monitoring-only (p=none)"
			}
			return []Finding{{ID: "DMARC1", Severity: sev, Title: title, Detail: t}}
		}
	}
	return []Finding{{ID: "DMARC1", Severity: "high", Title: "No DMARC record", Detail: host}}
}

func checkDKIMHeader(h mail.Header) []Finding {
	dkim := h.Get("Dkim-Signature")
	if dkim == "" {
		// try all
		for k, vals := range h {
			if strings.EqualFold(k, "DKIM-Signature") && len(vals) > 0 {
				dkim = vals[0]
				break
			}
		}
	}
	if dkim == "" {
		return []Finding{{
			ID: "DKIM1", Severity: "high", Title: "No DKIM-Signature header",
			Detail: "Message arrived without DKIM signature.",
			Fix:    "Enable DKIM signing on the sending MTA and publish the public key as TXT.",
		}}
	}
	return []Finding{{ID: "DKIM1", Severity: "ok", Title: "DKIM-Signature header present", Detail: truncate(dkim, 180)}}
}

func extractBodies(msg *mail.Message) (textBody, htmlBody string) {
	ct := msg.Header.Get("Content-Type")
	if ct == "" {
		b, _ := io.ReadAll(io.LimitReader(msg.Body, 512*1024))
		return string(b), ""
	}
	mediatype, params, err := mime.ParseMediaType(ct)
	if err != nil {
		b, _ := io.ReadAll(io.LimitReader(msg.Body, 512*1024))
		return string(b), ""
	}
	if strings.HasPrefix(mediatype, "multipart/") {
		mr := multipart.NewReader(msg.Body, params["boundary"])
		for {
			p, err := mr.NextPart()
			if err != nil {
				break
			}
			pct := p.Header.Get("Content-Type")
			body, _ := io.ReadAll(io.LimitReader(p, 512*1024))
			mt, _, _ := mime.ParseMediaType(pct)
			switch {
			case strings.HasPrefix(mt, "text/plain") && textBody == "":
				textBody = string(body)
			case strings.HasPrefix(mt, "text/html") && htmlBody == "":
				htmlBody = string(body)
			case strings.HasPrefix(mt, "multipart/"):
				// shallow: ignore nested for MVP
			}
		}
		return textBody, htmlBody
	}
	b, _ := io.ReadAll(io.LimitReader(msg.Body, 512*1024))
	if strings.HasPrefix(mediatype, "text/html") {
		return "", string(b)
	}
	return string(b), ""
}

func domainOf(addr string) string {
	addr = strings.TrimSpace(addr)
	if addr == "" {
		return ""
	}
	if a, err := mail.ParseAddress(addr); err == nil {
		addr = a.Address
	}
	if i := strings.LastIndex(addr, "@"); i >= 0 && i+1 < len(addr) {
		return strings.ToLower(strings.Trim(addr[i+1:], "> "))
	}
	return ""
}

func lookupTXT(ctx context.Context, host string) ([]string, error) {
	cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	return net.DefaultResolver.LookupTXT(cctx, host)
}

func scoreOf(findings []Finding) (int, string) {
	s := 100
	for _, f := range findings {
		switch f.Severity {
		case "critical":
			s -= 35
		case "high":
			s -= 20
		case "medium":
			s -= 10
		case "low":
			s -= 5
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

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}

func unique(in []string) []string {
	seen := map[string]bool{}
	out := []string{}
	for _, v := range in {
		if seen[v] {
			continue
		}
		seen[v] = true
		out = append(out, v)
	}
	return out
}
