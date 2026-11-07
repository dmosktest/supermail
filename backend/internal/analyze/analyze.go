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
	"regexp"
	"strconv"
	"strings"
	"time"

	"supermail/internal/dnsbl"
)

type Finding struct {
	ID       string   `json:"id"`
	Code     string   `json:"code"`
	Severity string   `json:"severity"`
	Title    string   `json:"title"`
	Detail   string   `json:"detail"`
	Fix      string   `json:"fix,omitempty"`
	Score    *float64 `json:"score,omitempty"`
}

type MailMeta struct {
	From      string `json:"from"`
	To        string `json:"to"`
	Subject   string `json:"subject"`
	MessageID string `json:"messageId,omitempty"`
	Date      string `json:"date,omitempty"`
	HasHTML   bool   `json:"hasHtml"`
	HasText   bool   `json:"hasText"`
	RemoteIP  string `json:"remoteIp"`
	Helo      string `json:"helo,omitempty"`
	MailFrom  string `json:"mailFrom,omitempty"`
}

type HeaderField struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type Report struct {
	Grade       string        `json:"grade"`
	Score       int           `json:"score"`
	SpamScore   float64       `json:"spamScore"`
	TestsTotal  int           `json:"testsTotal"`
	TestsPass   int           `json:"testsPass"`
	TestsFail   int           `json:"testsFail"`
	Mail        MailMeta      `json:"mail"`
	Headers     []HeaderField `json:"headers,omitempty"`
	Findings    []Finding     `json:"findings"`
	PTR         string        `json:"ptr,omitempty"`
	Blacklist   dnsbl.Result  `json:"blacklist"`
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

var freemailDomains = map[string]bool{
	"mail.ru": true, "inbox.ru": true, "bk.ru": true, "list.ru": true, "internet.ru": true,
	"gmail.com": true, "googlemail.com": true,
	"yandex.ru": true, "yandex.com": true, "ya.ru": true,
	"yahoo.com": true, "yahoo.co.uk": true,
	"hotmail.com": true, "outlook.com": true, "live.com": true, "msn.com": true,
	"rambler.ru": true, "ro.ru": true, "autorambler.ru": true,
	"proton.me": true, "protonmail.com": true,
	"icloud.com": true, "me.com": true, "mac.com": true,
	"aol.com": true, "gmx.com": true, "gmx.de": true, "gmx.net": true,
	"mail.com": true, "zoho.com": true, "tutanota.com": true,
}

var versionRe = regexp.MustCompile(`(?i)(?:v(?:ersion)?[\s./-]*)?\d+\.\d+`)
var dkimDRe = regexp.MustCompile(`(?i)(?:^|;)\s*d=([^;\s]+)`)
var dkimSRe = regexp.MustCompile(`(?i)(?:^|;)\s*s=([^;\s]+)`)
var fromLeadingDigitsRe = regexp.MustCompile(`^\d{3,}`)
var imgTagRe = regexp.MustCompile(`(?is)<img\b[^>]*>`)
var imgAltRe = regexp.MustCompile(`(?i)\balt\s*=`)

func Run(ctx context.Context, raw []byte, remoteIP, helo, mailFrom string, inboundTLS bool) Report {
	meta := MailMeta{
		RemoteIP: remoteIP,
		Helo:     helo,
		MailFrom: mailFrom,
	}
	findings := []Finding{}
	headers := extractHeaders(raw)

	msg, err := mail.ReadMessage(bytes.NewReader(raw))
	if err != nil {
		findings = append(findings, f("PARSE1", "PARSE1", "critical", "Could not parse message", err.Error(), "", 2.0))
		return finalize(meta, findings, "", dnsbl.Result{}, headers)
	}

	meta.From = prettyAddressHeader(msg.Header.Get("From"))
	meta.To = prettyAddressHeader(msg.Header.Get("To"))
	meta.Subject = decodeMIMEHeader(msg.Header.Get("Subject"))
	meta.MessageID = headerGet(msg.Header, "Message-Id", "Message-ID")
	meta.Date = strings.TrimSpace(msg.Header.Get("Date"))

	fromAddr := addressOf(meta.From)
	fromDomain := domainOf(meta.From)
	if fromDomain == "" {
		fromDomain = domainOf(mailFrom)
	}
	envDomain := domainOf(mailFrom)

	textBody, htmlBody, mimeKind := extractBodies(msg)
	meta.HasText = strings.TrimSpace(textBody) != ""
	meta.HasHTML = strings.TrimSpace(htmlBody) != ""

	findings = append(findings, checkSubject(meta.Subject)...)
	findings = append(findings, checkContent(textBody, htmlBody)...)
	findings = append(findings, checkMime(msg.Header, mimeKind, meta.HasText, meta.HasHTML)...)
	findings = append(findings, checkAddresses(meta.From, fromAddr, mailFrom, fromDomain, envDomain)...)
	findings = append(findings, checkRecipients(msg.Header)...)
	findings = append(findings, checkMessageID(meta.MessageID, fromDomain)...)
	findings = append(findings, checkDate(meta.Date)...)
	findings = append(findings, checkUserAgent(msg.Header)...)
	findings = append(findings, checkReceived(msg.Header, inboundTLS)...)
	findings = append(findings, checkARC(msg.Header)...)
	findings = append(findings, checkListHeaders(msg.Header)...)
	findings = append(findings, checkAuthHeaders(msg.Header)...)
	findings = append(findings, checkSPFRecord(ctx, fromDomain)...)
	spfDomain := envDomain
	if spfDomain == "" {
		spfDomain = fromDomain
	}
	spfRes := evalSPF(ctx, remoteIP, spfDomain)
	findings = append(findings, spfEvalFindings(spfRes, spfDomain)...)
	dmarcPol, dmarcFindings := checkDMARC(ctx, fromDomain)
	findings = append(findings, dmarcFindings...)
	dkimFindings, dkimDomains := checkDKIMFull(ctx, raw, msg.Header)
	findings = append(findings, dkimFindings...)
	findings = append(findings, checkDMARCAlignment(fromDomain, spfDomain, spfRes, dkimDomains, dmarcPol)...)
	findings = append(findings, checkMTASTS(ctx, fromDomain)...)
	findings = append(findings, checkTLSRPT(ctx, fromDomain)...)
	findings = append(findings, checkBIMI(ctx, fromDomain)...)
	findings = append(findings, checkMX(ctx, fromDomain)...)
	findings = append(findings, checkHelo(ctx, helo, remoteIP)...)

	bl := dnsbl.Result{}
	ptr := ""
	if remoteIP != "" && net.ParseIP(remoteIP) != nil {
		bl = dnsbl.Check(ctx, remoteIP)
		if len(bl.Listed) > 0 {
			sev, sc := dnsblSeverity(bl.Listed)
			findings = append(findings, f("BL1", "BL1_LISTED", sev, "Sending IP listed on DNSBL",
				fmt.Sprintf("%s → %s", remoteIP, strings.Join(bl.Listed, ", ")),
				dnsbl.FormatDelistHints(remoteIP, bl.Listed), sc))
		} else {
			findings = append(findings, f("BL1", "BL1_CLEAN", "ok", "Sending IP not listed on checked DNSBLs",
				fmt.Sprintf("%s · %d", remoteIP, bl.Checked), "", -0.1))
		}
		ptrs, _ := net.DefaultResolver.LookupAddr(ctx, remoteIP)
		if len(ptrs) > 0 {
			ptr = strings.TrimSuffix(ptrs[0], ".")
			findings = append(findings, f("PTR1", "PTR1_OK", "ok", "Reverse DNS present",
				fmt.Sprintf("%s → %s", remoteIP, ptr), "", -0.05))
			findings = append(findings, checkPtrHelo(ptr, helo)...)
		} else {
			findings = append(findings, f("PTR1", "PTR1_MISSING", "medium", "No reverse DNS (PTR)",
				remoteIP,
				"Ask the hosting provider to set PTR matching the SMTP hostname.", 0.8))
		}
	}

	return finalize(meta, findings, ptr, bl, headers)
}

func finalize(meta MailMeta, findings []Finding, ptr string, bl dnsbl.Result, headers []HeaderField) Report {
	score, grade := scoreOf(findings)
	pass, fail := 0, 0
	spam := 0.0
	for _, x := range findings {
		if x.Score != nil {
			spam += *x.Score
		}
		if isPositive(x) {
			pass++
		} else {
			fail++
		}
	}
	return Report{
		Grade: grade, Score: score, SpamScore: round1(spam),
		TestsTotal: len(findings), TestsPass: pass, TestsFail: fail,
		Mail: meta, Headers: headers, Findings: findings, PTR: ptr, Blacklist: bl,
	}
}

func extractHeaders(raw []byte) []HeaderField {
	const maxBlock = 256 * 1024
	if len(raw) == 0 {
		return nil
	}
	chunk := raw
	if len(chunk) > maxBlock {
		chunk = chunk[:maxBlock]
	}
	sep := []byte("\r\n\r\n")
	idx := bytes.Index(chunk, sep)
	if idx < 0 {
		sep = []byte("\n\n")
		idx = bytes.Index(chunk, sep)
	}
	if idx < 0 {
		return nil
	}
	block := string(chunk[:idx])
	block = strings.ReplaceAll(block, "\r\n", "\n")
	block = strings.ReplaceAll(block, "\r", "\n")
	lines := strings.Split(block, "\n")
	out := make([]HeaderField, 0, len(lines))
	for _, line := range lines {
		if line == "" {
			continue
		}
		if len(out) > 0 && (strings.HasPrefix(line, " ") || strings.HasPrefix(line, "\t")) {
			i := len(out) - 1
			out[i].Value = strings.TrimSpace(out[i].Value + " " + strings.TrimSpace(line))
			continue
		}
		colon := strings.IndexByte(line, ':')
		if colon <= 0 {
			continue
		}
		name := strings.TrimSpace(line[:colon])
		value := strings.TrimSpace(line[colon+1:])
		if name == "" {
			continue
		}
		out = append(out, HeaderField{Name: name, Value: value})
	}
	if len(out) == 0 {
		return nil
	}
	return out
}

func isPositive(x Finding) bool {
	if x.Score != nil {
		if *x.Score > 0 {
			return false
		}
		if *x.Score < 0 {
			return true
		}
	}
	return x.Severity == "ok" || x.Severity == "info"
}

func f(id, code, sev, title, detail, fix string, score float64) Finding {
	if code == "" {
		code = id
	}
	s := score
	return Finding{ID: id, Code: code, Severity: sev, Title: title, Detail: detail, Fix: fix, Score: &s}
}

func checkSubject(subject string) []Finding {
	out := []Finding{}
	if subject == "" {
		return []Finding{f("SUB1", "SUB1_EMPTY", "low", "Empty subject", "Empty subjects often look suspicious.", "", 0.3)}
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
		out = append(out, f("SUB2", "SUB2_CAPS", "medium", "Subject mostly UPPERCASE", subject, "Use normal sentence case in the subject.", 0.6))
	} else {
		out = append(out, f("SUB2", "SUB2_OK", "ok", "Subject casing looks fine", subject, "", 0))
	}
	punct := strings.Count(subject, "!") + strings.Count(subject, "?")
	if punct >= 3 {
		out = append(out, f("SUB3", "SUB3_MANY", "low", "Many punctuation marks in subject",
			strconv.Itoa(punct), "", 0.2))
	} else {
		out = append(out, f("SUB3", "SUB3_OK", "ok", "Subject punctuation looks fine",
			strconv.Itoa(punct), "", 0))
	}
	low := strings.ToLower(subject)
	hits := []string{}
	for _, w := range spamWords {
		if strings.Contains(low, w) {
			hits = append(hits, w)
		}
	}
	if len(hits) > 0 {
		out = append(out, f("SUB4", "SUB4_SPAM", "medium", "Spam-like words in subject",
			strings.Join(hits, ", "), "Avoid hard-sell spam vocabulary in the subject line.", 0.7))
	} else {
		out = append(out, f("SUB4", "SUB4_OK", "ok", "No spam-like words in subject", subject, "", 0))
	}
	return out
}

func checkContent(textBody, htmlBody string) []Finding {
	out := []Finding{}
	combined := strings.ToLower(textBody + "\n" + htmlBody)
	if !strings.Contains(combined, "@") && !strings.Contains(combined, "http") && len(strings.TrimSpace(textBody)) < 20 && htmlBody != "" {
		out = append(out, f("CNT1", "CNT1_IMAGE", "medium", "Mostly image / little text",
			"HTML with almost no text body is a common spam pattern.",
			"Include a real text alternative and contact details.", 0.8))
	} else if strings.TrimSpace(textBody) != "" {
		out = append(out, f("CNT1", "CNT1_TEXT", "ok", "Text content present", "Plain text body found.", "", -0.1))
	} else if htmlBody != "" {
		out = append(out, f("CNT1", "CNT1_HTML", "low", "HTML-only body", "No text/plain part.", "Add a text/plain alternative.", 0.2))
	}

	hits := []string{}
	for _, w := range spamWords {
		if strings.Contains(combined, w) {
			hits = append(hits, w)
		}
	}
	if len(hits) >= 3 {
		out = append(out, f("CNT2", "CNT2_SPAM", "medium", "Multiple spam-like words in body",
			strings.Join(unique(hits), ", "), "", 0.9))
	} else {
		out = append(out, f("CNT2", "CNT2_OK", "ok", "Body spam vocabulary looks fine",
			strconv.Itoa(len(hits)), "", 0))
	}

	shortHit := ""
	for _, h := range shortURLHosts {
		if strings.Contains(combined, h) {
			shortHit = h
			break
		}
	}
	if shortHit != "" {
		out = append(out, f("CNT3", "CNT3_SHORT", "medium", "Shortened URL detected", shortHit,
			"Link to the real destination domain instead of public shorteners.", 0.7))
	} else {
		out = append(out, f("CNT3", "CNT3_OK", "ok", "No public URL shortener", "No known shortener hosts in body.", "", 0))
	}

	lowHTML := strings.ToLower(htmlBody)
	dangerHits := []string{}
	for _, tag := range []string{"<script", "<iframe", "<embed", "<object", "<applet", "<base", "<form"} {
		if strings.Contains(lowHTML, tag) {
			dangerHits = append(dangerHits, strings.TrimPrefix(tag, "<"))
		}
	}
	if len(dangerHits) > 0 {
		out = append(out, f("CNT4", "CNT4_SCRIPT", "high", "HTML contains risky elements",
			strings.Join(dangerHits, ", "),
			"Remove script, iframe, embed, object, applet, base and form from email HTML.", 1.5))
	} else if htmlBody != "" {
		out = append(out, f("CNT4", "CNT4_CLEAN", "ok", "No risky HTML elements", "No script/iframe/embed/object/applet/base/form tags.", "", 0))
	} else {
		out = append(out, f("CNT4", "CNT4_NOHTML", "ok", "No HTML part", "Nothing to scan for risky HTML elements.", "", 0))
	}

	if textBody == "" && htmlBody == "" {
		out = append(out, f("CNT5", "CNT5_EMPTY", "high", "Empty body", "Message has no text or HTML body.", "", 1.2))
	} else {
		out = append(out, f("CNT5", "CNT5_OK", "ok", "Body is not empty", "", "", 0))
	}

	if htmlBody != "" {
		imgs := imgTagRe.FindAllString(htmlBody, -1)
		missingAlt := 0
		for _, tag := range imgs {
			if !imgAltRe.MatchString(tag) {
				missingAlt++
			}
		}
		if len(imgs) == 0 {
			out = append(out, f("CNT6", "CNT6_NOIMG", "ok", "No images in HTML", "", "", 0))
		} else if missingAlt > 0 {
			out = append(out, f("CNT6", "CNT6_NOALT", "low", "Images without ALT attribute",
				strconv.Itoa(missingAlt),
				"Add alt=\"…\" on every <img> for accessibility and filters.", 0.25))
		} else {
			out = append(out, f("CNT6", "CNT6_ALT", "ok", "Images have ALT attributes",
				strconv.Itoa(len(imgs)), "", -0.05))
		}
	}

	return out
}

func checkMime(h mail.Header, mimeKind string, hasText, hasHTML bool) []Finding {
	ct := strings.TrimSpace(h.Get("Content-Type"))
	if ct == "" {
		ct = "text/plain (implied)"
	}
	out := []Finding{}
	low := strings.ToLower(ct)
	switch {
	case strings.Contains(low, "text/plain"), strings.Contains(low, "multipart/alternative"), strings.Contains(low, "multipart/mixed"), strings.Contains(low, "multipart/related"):
		out = append(out, f("MIME1", "MIME1_KNOWN", "ok", "Known content-type", ct, "", -0.1))
	case strings.Contains(low, "text/html"):
		out = append(out, f("MIME1", "MIME1_HTML", "low", "HTML content-type without multipart", ct, "Prefer multipart/alternative with text/plain.", 0.15))
	default:
		out = append(out, f("MIME1", "MIME1_UNUSUAL", "medium", "Unusual content-type", ct, "", 0.4))
	}
	if hasText && hasHTML {
		out = append(out, f("MIME2", "MIME2_BOTH", "ok", "Both text and HTML parts", mimeKind, "", -0.05))
	} else if hasHTML && !hasText {
		out = append(out, f("MIME2", "MIME2_HTML_ONLY", "low", "HTML without text alternative", mimeKind, "Include text/plain.", 0.2))
	} else if hasText && !hasHTML {
		out = append(out, f("MIME2", "MIME2_TEXT_ONLY", "info", "No HTML alternative", mimeKind,
			"Optional: add multipart/alternative with text/html for richer clients.", 0))
	} else {
		out = append(out, f("MIME2", "MIME2_OK", "ok", "MIME structure acceptable", mimeKind, "", 0))
	}
	return out
}

func checkAddresses(fromHeader, fromAddr, mailFrom, fromDomain, envDomain string) []Finding {
	out := []Finding{}
	if fromDomain != "" && freemailDomains[fromDomain] {
		out = append(out, f("ADDR1", "ADDR1_FREEMAIL", "info", "From is a freemail address",
			fromDomain, "Fine for personal mail. For company / bulk / transactional mail use your own domain.", 0))
	} else if fromDomain != "" {
		out = append(out, f("ADDR1", "ADDR1_OK", "ok", "From is not a known freemail domain", fromDomain, "", -0.05))
	}
	if envDomain != "" && freemailDomains[envDomain] {
		out = append(out, f("ADDR2", "ADDR2_FREEMAIL", "info", "Envelope From is a freemail address",
			envDomain, "Normal for personal freemail. Prefer your domain for bulk or branded mail.", 0))
	} else if envDomain != "" {
		out = append(out, f("ADDR2", "ADDR2_OK", "ok", "Envelope From is not a known freemail domain", envDomain, "", 0))
	} else {
		out = append(out, f("ADDR2", "ADDR2_EMPTY", "info", "Empty envelope sender", "MAIL FROM was empty or missing.", "", 0))
	}

	envAddr := addressOf(mailFrom)
	if fromAddr != "" && envAddr != "" {
		if strings.EqualFold(fromAddr, envAddr) {
			out = append(out, f("ADDR3", "ADDR3_MATCH", "ok", "From matches envelope", fromAddr, "", 0))
		} else {
			out = append(out, f("ADDR3", "ADDR3_DIFF", "medium", "From differs from envelope",
				fmt.Sprintf("%s ≠ %s", fromAddr, envAddr),
				"When possible, use the same address in header From and in SMTP MAIL FROM.", 0.5))
		}
	}

	if _, err := mail.ParseAddress(fromHeader); err == nil && strings.Contains(fromHeader, "<") && !strings.HasPrefix(strings.TrimSpace(fromHeader), "<") {
		out = append(out, f("ADDR4", "ADDR4_DN", "ok", "From has a display name", fromHeader, "", 0))
	} else if fromHeader != "" {
		out = append(out, f("ADDR4", "ADDR4_NO_DN", "info", "From has no display name", fromHeader, "", 0))
	}

	if fromAddr != "" {
		local := fromAddr
		if i := strings.IndexByte(local, '@'); i >= 0 {
			local = local[:i]
		}
		if fromLeadingDigitsRe.MatchString(local) {
			out = append(out, f("ADDR5", "ADDR5_NUMS", "info", "From local-part starts with many digits",
				local, "Common on freemail and fine for personal use. For new brand mailboxes prefer a name without a long digit prefix.", 0))
		} else {
			out = append(out, f("ADDR5", "ADDR5_OK", "ok", "From local-part does not start with many digits", local, "", 0))
		}
	}

	if envAddr != "" && envDomain != "" && freemailDomains[envDomain] {
		local := envAddr
		if i := strings.IndexByte(local, '@'); i >= 0 {
			local = local[:i]
		}
		if local != "" && local[len(local)-1] >= '0' && local[len(local)-1] <= '9' {
			out = append(out, f("ADDR6", "ADDR6_DIGIT", "info", "Freemail envelope username ends with a digit",
				envAddr, "Very common on freemail; not a problem for personal mail.", 0))
		} else {
			out = append(out, f("ADDR6", "ADDR6_OK", "ok", "Freemail envelope username does not end with a digit", envAddr, "", 0))
		}
	}

	return out
}

func checkRecipients(h mail.Header) []Finding {
	out := []Finding{}
	to := strings.TrimSpace(h.Get("To"))
	cc := strings.TrimSpace(h.Get("Cc"))
	raw := to
	if cc != "" {
		if raw != "" {
			raw += ", " + cc
		} else {
			raw = cc
		}
	}
	list, err := mail.ParseAddressList(raw)
	n := 0
	withDN := 0
	if err == nil {
		n = len(list)
		for _, a := range list {
			if strings.TrimSpace(a.Name) != "" {
				withDN++
			}
		}
	} else if to != "" {
		n = 1
	}
	switch {
	case n == 1:
		out = append(out, f("RCPT1", "RCPT1_ONE", "ok", "One recipient", "1", "", 0))
	case n == 0:
		out = append(out, f("RCPT1", "RCPT1_NONE", "low", "No parseable recipients in To/Cc", raw, "", 0.1))
	case n <= 5:
		out = append(out, f("RCPT1", "RCPT1_FEW", "ok", "Few recipients", strconv.Itoa(n), "", 0))
	default:
		out = append(out, f("RCPT1", "RCPT1_MANY", "medium", "Many recipients in headers",
			strconv.Itoa(n), "Bulk To/Cc lists look spammy; use BCC or a ESP.", 0.6))
	}
	if n > 0 && withDN == 0 {
		out = append(out, f("RCPT2", "RCPT2_NO_DN", "ok", "Recipients have no display names", "", "", 0))
	} else if withDN > 0 {
		out = append(out, f("RCPT2", "RCPT2_SOME_DN", "ok", "Some recipients have display names",
			fmt.Sprintf("%d/%d", withDN, n), "", 0))
	}
	return out
}

func checkMessageID(mid, fromDomain string) []Finding {
	if mid == "" {
		return []Finding{f("MID1", "MID1_MISSING", "medium", "Missing Message-ID", "No Message-ID header.", "MTAs should generate Message-ID.", 0.4)}
	}
	out := []Finding{f("MID1", "MID1_OK", "ok", "Message-ID present", truncate(mid, 120), "", 0)}
	rhs := domainOf(mid)
	if rhs == "" {
		if i := strings.LastIndex(mid, "@"); i >= 0 {
			rhs = strings.ToLower(strings.Trim(mid[i+1:], "> "))
		}
	}
	if fromDomain != "" && rhs != "" {
		if rhs == fromDomain || strings.HasSuffix(rhs, "."+fromDomain) {
			out = append(out, f("MID2", "MID2_MATCH", "ok", "Message-ID domain matches From",
				fmt.Sprintf("%s ↔ %s", rhs, fromDomain), "", 0))
		} else {
			out = append(out, f("MID2", "MID2_DIFF", "low", "Message-ID domain differs from From",
				fmt.Sprintf("%s vs %s", rhs, fromDomain), "", 0.15))
		}
	}
	return out
}

func checkDate(date string) []Finding {
	if date == "" {
		return []Finding{f("DATE1", "DATE1_MISSING", "low", "Missing Date header", "", "", 0.2)}
	}
	t, err := mail.ParseDate(date)
	if err != nil {
		return []Finding{f("DATE1", "DATE1_BAD", "low", "Unparseable Date header", date, "", 0.2)}
	}
	now := time.Now()
	if t.After(now.Add(24 * time.Hour)) {
		return []Finding{f("DATE1", "DATE1_FUTURE", "medium", "Date is in the future", date, "", 0.5)}
	}
	if t.Before(now.Add(-30 * 24 * time.Hour)) {
		return []Finding{f("DATE1", "DATE1_OLD", "low", "Date is older than 30 days", date, "", 0.3)}
	}
	return []Finding{f("DATE1", "DATE1_OK", "ok", "Date looks reasonable", date, "", 0)}
}

func checkUserAgent(h mail.Header) []Finding {
	ua := strings.TrimSpace(h.Get("User-Agent"))
	xm := strings.TrimSpace(h.Get("X-Mailer"))
	val := ua
	which := "User-Agent"
	if val == "" {
		val = xm
		which = "X-Mailer"
	}
	if val == "" {
		return []Finding{f("UA1", "UA1_MISSING", "info", "No User-Agent / X-Mailer", "Client did not advertise a mailer string.", "", 0)}
	}
	if versionRe.MatchString(val) {
		return []Finding{f("UA1", "UA1_VERSION", "ok", which+" has a version", truncate(val, 120), "", 0)}
	}
	return []Finding{f("UA1", "UA1_NO_VERSION", "info", which+" has no version", truncate(val, 120), "", 0)}
}

func checkReceived(h mail.Header, inboundTLS bool) []Finding {
	rec := headerValues(h, "Received")
	n := len(rec)
	out := []Finding{}
	switch {
	case n == 0:
		out = append(out, f("RCVD1", "RCVD1_NONE", "medium", "No Received headers", "Unexpected for internet mail.", "", 0.4))
	case n == 1:
		out = append(out, f("RCVD1", "RCVD1_ONE", "ok", "One Received header", "1", "", 0))
	case n == 2:
		out = append(out, f("RCVD1", "RCVD1_TWO", "ok", "Two Received headers", "2", "", 0))
	case n <= 6:
		out = append(out, f("RCVD1", "RCVD1_OK", "ok", "Received hop count looks normal", strconv.Itoa(n), "", 0))
	default:
		out = append(out, f("RCVD1", "RCVD1_MANY", "low", "Many Received hops", strconv.Itoa(n), "", 0.2))
	}
	if inboundTLS {
		out = append(out, f("RCVD2", "RCVD2_TLS", "ok", "Inbound SMTP to this tester used STARTTLS",
			"TLS session on the hop into supermail.", "", -0.05))
	} else {
		out = append(out, f("RCVD2", "RCVD2_NO_TLS", "info", "Inbound SMTP to this tester without STARTTLS",
			"The delivery hop into this test inbox was cleartext (or STARTTLS was skipped). That often happens because the tester presents a self-signed certificate — it does not mean Mail.ru/Gmail never use TLS elsewhere.",
			"Nothing to fix on freemail. On your own MTA, prefer STARTTLS to peers with a public CA cert; this tester’s cert is not a production trust anchor.", 0))
	}
	if n > 0 {
		last := rec[0]
		low := strings.ToLower(last)
		auth := strings.Contains(low, "authenticated") || strings.Contains(low, "auth ") ||
			strings.Contains(low, "sasl") || strings.Contains(low, "smtp auth")
		if auth {
			out = append(out, f("RCVD3", "RCVD3_AUTH", "ok", "Authenticated hand-off seen in Received", "", "", 0))
		} else {
			out = append(out, f("RCVD3", "RCVD3_NO_AUTH", "info", "No SMTP AUTH marker in top Received", "", "", 0))
		}
	}
	return out
}

func checkARC(h mail.Header) []Finding {
	if headerGet(h, "ARC-Seal", "Arc-Seal") != "" || headerGet(h, "ARC-Message-Signature", "Arc-Message-Signature") != "" {
		return []Finding{f("ARC1", "ARC1_OK", "ok", "ARC headers present", "ARC-Seal / ARC-Message-Signature found.", "", -0.05)}
	}
	return []Finding{f("ARC1", "ARC1_NA", "info", "ARC signature absent", "No ARC chain (normal for direct sender→inbox).", "", 0)}
}

func checkListHeaders(h mail.Header) []Finding {
	lu := headerGet(h, "List-Unsubscribe", "List-Unsubscribe")
	if lu != "" {
		return []Finding{f("LIST1", "LIST1_OK", "ok", "List-Unsubscribe present", truncate(lu, 120), "", -0.05)}
	}
	return []Finding{f("LIST1", "LIST1_NA", "info", "No List-Unsubscribe", "Fine for one-off mail; useful for bulk.", "", 0)}
}

func checkAuthHeaders(h mail.Header) []Finding {
	out := []Finding{}
	ar := headerGet(h, "Authentication-Results", "Authentication-Results")
	if ar == "" {
		out = append(out, f("AUTH1", "AUTH1_NA", "info", "No Authentication-Results header",
			"Upstream MTA did not add Authentication-Results (normal for direct delivery to this test inbox).", "", 0))
		return out
	}
	low := strings.ToLower(ar)
	if strings.Contains(low, "spf=pass") {
		out = append(out, f("AUTH1", "AUTH1_SPF_PASS", "ok", "SPF pass (Authentication-Results)", ar, "", -0.2))
	} else if strings.Contains(low, "spf=fail") {
		out = append(out, f("AUTH1", "AUTH1_SPF_FAIL", "high", "SPF fail (Authentication-Results)", ar, "", 1.5))
	}
	if strings.Contains(low, "dkim=pass") {
		out = append(out, f("AUTH2", "AUTH2_DKIM_PASS", "ok", "DKIM pass (Authentication-Results)", ar, "", -0.2))
	} else if strings.Contains(low, "dkim=fail") {
		out = append(out, f("AUTH2", "AUTH2_DKIM_FAIL", "high", "DKIM fail (Authentication-Results)", ar, "", 1.5))
	}
	if strings.Contains(low, "dmarc=pass") {
		out = append(out, f("AUTH3", "AUTH3_DMARC_PASS", "ok", "DMARC pass (Authentication-Results)", ar, "", -0.5))
	} else if strings.Contains(low, "dmarc=fail") {
		out = append(out, f("AUTH3", "AUTH3_DMARC_FAIL", "high", "DMARC fail (Authentication-Results)", ar, "", 1.8))
	}
	return out
}

func checkSPFRecord(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return []Finding{f("SPF1", "SPF1_NO_DOMAIN", "high", "Cannot determine From domain for SPF", "Missing From / MAIL FROM domain.", "", 1.0)}
	}
	txts, err := lookupTXT(ctx, domain)
	if err != nil || len(txts) == 0 {
		return []Finding{f("SPF1", "SPF1_MISSING", "high", "No SPF record for From domain", domain,
			fmt.Sprintf("Add TXT on %s: v=spf1 mx a ~all", domain), 1.2)}
	}
	for _, t := range txts {
		if strings.HasPrefix(strings.ToLower(strings.TrimSpace(t)), "v=spf1") {
			if strings.Contains(strings.ToLower(t), "+all") {
				return []Finding{f("SPF1", "SPF1_PLUSALL", "high", "SPF uses +all", t, "Replace +all with ~all or -all.", 1.5)}
			}
			return []Finding{f("SPF1", "SPF1_OK", "ok", "SPF record present", t, "", -0.2)}
		}
	}
	return []Finding{f("SPF1", "SPF1_MISSING", "high", "No SPF record for From domain", domain, "", 1.2)}
}

func checkDMARC(ctx context.Context, domain string) (dmarcPolicy, []Finding) {
	if domain == "" {
		return dmarcPolicy{}, nil
	}
	host := "_dmarc." + domain
	txts, err := lookupTXT(ctx, host)
	if err != nil || len(txts) == 0 {
		return dmarcPolicy{}, []Finding{f("DMARC1", "DMARC1_MISSING", "medium", "No DMARC record", host,
			fmt.Sprintf("Add TXT on %s: v=DMARC1; p=none; rua=mailto:dmarc@%s", host, domain), 0.6)}
	}
	for _, t := range txts {
		if strings.Contains(strings.ToUpper(t), "V=DMARC1") {
			pol := parseDMARC(t)
			return pol, dmarcRecordFindings(host, t, pol)
		}
	}
	return dmarcPolicy{}, []Finding{f("DMARC1", "DMARC1_MISSING", "medium", "No DMARC record", host, "", 0.6)}
}

func checkDKIMHeader(ctx context.Context, h mail.Header) []Finding {
	dkim := headerGet(h, "DKIM-Signature", "Dkim-Signature")
	if dkim == "" {
		return []Finding{f("DKIM1", "DKIM1_MISSING", "low", "No DKIM-Signature header",
			"Message arrived without DKIM signature.",
			"Optional but recommended: enable DKIM signing and publish the public key as TXT. Missing DKIM is milder than a broken signature.", 0.4)}
	}
	out := []Finding{f("DKIM1", "DKIM1_OK", "ok", "DKIM-Signature header present", truncate(dkim, 180), "", -0.2)}
	d, s := "", ""
	if m := dkimDRe.FindStringSubmatch(dkim); len(m) == 2 {
		d = strings.ToLower(strings.TrimSuffix(m[1], "."))
	}
	if m := dkimSRe.FindStringSubmatch(dkim); len(m) == 2 {
		s = strings.ToLower(strings.TrimSpace(m[1]))
	}
	if d != "" || s != "" {
		out = append(out, f("DKIM2", "DKIM2_TRACE", "ok", "DKIM trace",
			fmt.Sprintf("%s:s=%s", d, s), "", 0))
	}
	if d != "" && s != "" {
		host := s + "._domainkey." + d
		txts, err := lookupTXT(ctx, host)
		found := false
		if err == nil {
			for _, t := range txts {
				low := strings.ToLower(t)
				if strings.Contains(low, "v=dkim1") || strings.Contains(low, "p=") {
					found = true
					break
				}
			}
		}
		if found {
			out = append(out, f("DKIM3", "DKIM3_DNS_OK", "ok", "DKIM public key published in DNS", host, "", -0.2))
		} else {
			out = append(out, f("DKIM3", "DKIM3_DNS_MISSING", "high", "DKIM public key not found in DNS", host,
				fmt.Sprintf("Publish TXT on %s with v=DKIM1; k=rsa; p=…", host), 1.2))
		}
	}
	return out
}

func checkMX(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return nil
	}
	cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	mxs, err := net.DefaultResolver.LookupMX(cctx, domain)
	if err != nil || len(mxs) == 0 {
		return []Finding{f("MX1", "MX1_MISSING", "medium", "No MX for From domain", domain,
			"Publish MX (or rely on a valid A only if intentional).", 0.5)}
	}
	host := strings.TrimSuffix(mxs[0].Host, ".")
	return []Finding{f("MX1", "MX1_OK", "ok", "MX record was ok",
		fmt.Sprintf("%s (pref %d)", host, mxs[0].Pref), "", 0)}
}

func checkHelo(ctx context.Context, helo, remoteIP string) []Finding {
	helo = strings.TrimSpace(helo)
	if helo == "" {
		return []Finding{f("HELO1", "HELO1_EMPTY", "low", "Empty HELO/EHLO", "", "", 0.2)}
	}
	if ip := net.ParseIP(strings.Trim(helo, "[]")); ip != nil {
		if remoteIP != "" && ip.String() == remoteIP {
			return []Finding{f("HELO1", "HELO1_IP_MATCH", "ok", "HELO is the connecting IP", helo, "", 0)}
		}
		return []Finding{f("HELO1", "HELO1_IP", "low", "HELO is a bare IP", helo, "Use a hostname that matches PTR.", 0.25)}
	}
	if strings.EqualFold(helo, "localhost") || strings.HasSuffix(strings.ToLower(helo), ".local") {
		return []Finding{f("HELO1", "HELO1_LOCAL", "medium", "HELO looks local/non-public", helo, "", 0.6)}
	}
	out := []Finding{f("HELO1", "HELO1_HOST", "ok", "HELO hostname present", helo, "", 0)}
	host := strings.TrimSuffix(strings.ToLower(helo), ".")
	cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	addrs, err := net.DefaultResolver.LookupHost(cctx, host)
	if err != nil || len(addrs) == 0 {
		out = append(out, f("HELO2", "HELO2_NOA", "medium", "HELO hostname has no A/AAAA record", host,
			"Publish A/AAAA for the SMTP HELO name.", 0.4))
		return out
	}
	if remoteIP == "" {
		out = append(out, f("HELO2", "HELO2_A", "ok", "HELO hostname resolves in DNS", host, "", -0.05))
		return out
	}
	match := false
	for _, a := range addrs {
		if a == remoteIP {
			match = true
			break
		}
	}
	if match {
		out = append(out, f("HELO2", "HELO2_MATCH", "ok", "HELO hostname resolves to connecting IP",
			fmt.Sprintf("%s → %s", host, remoteIP), "", -0.1))
	} else {
		out = append(out, f("HELO2", "HELO2_MISMATCH", "low", "HELO hostname does not resolve to connecting IP",
			fmt.Sprintf("%s → %s (peer %s)", host, strings.Join(addrs, ","), remoteIP),
			"Point the HELO hostname’s A/AAAA records at the SMTP client IP.", 0.3))
	}
	return out
}

func checkPtrHelo(ptr, helo string) []Finding {
	helo = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(helo)), ".")
	ptr = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(ptr)), ".")
	if helo == "" || ptr == "" || net.ParseIP(strings.Trim(helo, "[]")) != nil {
		return nil
	}
	if ptr == helo || strings.HasSuffix(ptr, "."+helo) || strings.HasSuffix(helo, "."+ptr) {
		return []Finding{f("PTR2", "PTR2_MATCH", "ok", "PTR matches HELO",
			fmt.Sprintf("%s ↔ %s", ptr, helo), "", -0.1)}
	}
	return []Finding{f("PTR2", "PTR2_MISMATCH", "medium", "PTR does not match HELO",
		fmt.Sprintf("%s ≠ %s", ptr, helo),
		"Set PTR to the SMTP HELO hostname (or the reverse).", 0.5)}
}

func extractBodies(msg *mail.Message) (textBody, htmlBody, kind string) {
	ct := msg.Header.Get("Content-Type")
	if ct == "" {
		b, _ := io.ReadAll(io.LimitReader(msg.Body, 512*1024))
		return string(b), "", "text/plain"
	}
	mediatype, params, err := mime.ParseMediaType(ct)
	if err != nil {
		b, _ := io.ReadAll(io.LimitReader(msg.Body, 512*1024))
		return string(b), "", "unknown"
	}
	kind = mediatype
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
			}
		}
		return textBody, htmlBody, mediatype
	}
	b, _ := io.ReadAll(io.LimitReader(msg.Body, 512*1024))
	if strings.HasPrefix(mediatype, "text/html") {
		return "", string(b), mediatype
	}
	return string(b), "", mediatype
}

var rfc2047Decoder = &mime.WordDecoder{}

func decodeMIMEHeader(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return ""
	}
	if !strings.Contains(s, "=?") {
		return s
	}
	out, err := rfc2047Decoder.DecodeHeader(s)
	if err != nil {
		return s
	}
	out = strings.TrimSpace(out)
	if out == "" {
		return s
	}
	return out
}

func prettyAddressHeader(s string) string {
	s = decodeMIMEHeader(s)
	if s == "" {
		return ""
	}
	if a, err := mail.ParseAddress(s); err == nil {
		if strings.TrimSpace(a.Name) != "" {
			return fmt.Sprintf("%s <%s>", a.Name, a.Address)
		}
		return a.Address
	}
	if list, err := mail.ParseAddressList(s); err == nil && len(list) > 0 {
		parts := make([]string, 0, len(list))
		for _, a := range list {
			if strings.TrimSpace(a.Name) != "" {
				parts = append(parts, fmt.Sprintf("%s <%s>", a.Name, a.Address))
			} else {
				parts = append(parts, a.Address)
			}
		}
		return strings.Join(parts, ", ")
	}
	return s
}

func addressOf(addr string) string {
	addr = strings.TrimSpace(addr)
	if addr == "" {
		return ""
	}
	if a, err := mail.ParseAddress(addr); err == nil {
		return strings.ToLower(a.Address)
	}
	if i := strings.LastIndex(addr, "<"); i >= 0 {
		addr = addr[i+1:]
	}
	return strings.ToLower(strings.Trim(addr, "> "))
}

func domainOf(addr string) string {
	a := addressOf(addr)
	if i := strings.LastIndex(a, "@"); i >= 0 && i+1 < len(a) {
		return a[i+1:]
	}
	return ""
}

func headerGet(h mail.Header, keys ...string) string {
	for _, k := range keys {
		if v := strings.TrimSpace(h.Get(k)); v != "" {
			return v
		}
	}
	for k, vals := range h {
		for _, want := range keys {
			if strings.EqualFold(k, want) && len(vals) > 0 {
				return strings.TrimSpace(vals[0])
			}
		}
	}
	return ""
}

func headerValues(h mail.Header, name string) []string {
	for k, vals := range h {
		if strings.EqualFold(k, name) {
			return vals
		}
	}
	return nil
}

func lookupTXT(ctx context.Context, host string) ([]string, error) {
	cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	return net.DefaultResolver.LookupTXT(cctx, host)
}

// GradePenalty is the /100 grade cut for a finding severity.
// Keep in sync with UI gradeDeltaFor (src/main.ts) and SEO/FAQ copy.
func GradePenalty(severity string) int {
	switch severity {
	case "critical":
		return 25
	case "high":
		return 12
	case "medium":
		return 6
	case "low":
		return 3
	default:
		return 0
	}
}

func dnsblSeverity(listed []string) (sev string, spam float64) {
	major := map[string]bool{
		"zen.spamhaus.org":         true,
		"bl.spamcop.net":           true,
		"b.barracudacentral.org":   true,
		"cbl.abuseat.org":          true,
		"dnsbl-1.uceprotect.net":   true,
	}
	for _, z := range listed {
		if major[strings.ToLower(z)] {
			return "critical", 2.5
		}
	}
	return "high", 1.4
}

func scoreOf(findings []Finding) (int, string) {
	s := 100
	for _, f := range findings {
		s -= GradePenalty(f.Severity)
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

func round1(v float64) float64 {
	return float64(int(v*10+0.5)) / 10
}
