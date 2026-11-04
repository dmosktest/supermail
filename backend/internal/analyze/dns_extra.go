package analyze

import (
	"context"
	"fmt"
	"strings"
)

type DnsHint struct {
	Host  string `json:"host"`
	Type  string `json:"type"`
	Value string `json:"value"`
	Note  string `json:"note,omitempty"`
}

func checkMTASTS(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return nil
	}
	host := "_mta-sts." + domain
	txts, err := lookupTXT(ctx, host)
	if err != nil || len(txts) == 0 {
		return []Finding{f("STS1", "STS1_MISSING", "info", "No MTA-STS DNS record", host,
			fmt.Sprintf("Optional: add TXT on %s: v=STSv1; id=… and host policy at https://mta-sts.%s/.well-known/mta-sts.txt", host, domain), 0)}
	}
	for _, t := range txts {
		if strings.Contains(strings.ToUpper(t), "V=STSV1") {
			return []Finding{f("STS1", "STS1_OK", "ok", "MTA-STS DNS record present", t, "", -0.05)}
		}
	}
	return []Finding{f("STS1", "STS1_MISSING", "info", "No MTA-STS DNS record", host, "", 0)}
}

func checkTLSRPT(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return nil
	}
	host := "_smtp._tls." + domain
	txts, err := lookupTXT(ctx, host)
	if err != nil || len(txts) == 0 {
		return []Finding{f("TLSRPT1", "TLSRPT1_MISSING", "info", "No TLS-RPT DNS record", host,
			fmt.Sprintf("Optional: add TXT on %s: v=TLSRPTv1; rua=mailto:tlsrpt@%s", host, domain), 0)}
	}
	for _, t := range txts {
		if strings.Contains(strings.ToUpper(t), "V=TLSRPTV1") {
			return []Finding{f("TLSRPT1", "TLSRPT1_OK", "ok", "TLS-RPT DNS record present", t, "", -0.05)}
		}
	}
	return []Finding{f("TLSRPT1", "TLSRPT1_MISSING", "info", "No TLS-RPT DNS record", host, "", 0)}
}

func checkBIMI(ctx context.Context, domain string) []Finding {
	if domain == "" {
		return nil
	}
	host := "default._bimi." + domain
	txts, err := lookupTXT(ctx, host)
	if err != nil || len(txts) == 0 {
		return []Finding{f("BIMI1", "BIMI1_MISSING", "info", "No BIMI DNS record", host,
			"Optional brand logo via BIMI (needs DMARC enforce + SVG/VMC).", 0)}
	}
	for _, t := range txts {
		low := strings.ToLower(t)
		if strings.Contains(low, "v=bimi1") || strings.Contains(low, "l=") {
			return []Finding{f("BIMI1", "BIMI1_OK", "ok", "BIMI DNS record present", t, "", 0)}
		}
	}
	return []Finding{f("BIMI1", "BIMI1_MISSING", "info", "No BIMI DNS record", host, "", 0)}
}

func buildDnsHints(domain string) []DnsHint {
	domain = strings.ToLower(strings.TrimSuffix(strings.TrimSpace(domain), "."))
	if domain == "" {
		return nil
	}
	return []DnsHint{
		{
			Host:  domain,
			Type:  "TXT",
			Value: "v=spf1 mx a -all",
			Note:  "SPF — adjust includes for your ESP before -all",
		},
		{
			Host:  "_dmarc." + domain,
			Type:  "TXT",
			Value: fmt.Sprintf("v=DMARC1; p=none; rua=mailto:dmarc@%s; fo=1", domain),
			Note:  "DMARC — start with p=none, then quarantine/reject",
		},
		{
			Host:  "selector._domainkey." + domain,
			Type:  "TXT",
			Value: "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY",
			Note:  "DKIM — replace selector and p= with your MTA key",
		},
		{
			Host:  "_mta-sts." + domain,
			Type:  "TXT",
			Value: "v=STSv1; id=20260101T000000Z",
			Note:  "MTA-STS discovery (optional)",
		},
		{
			Host:  "_smtp._tls." + domain,
			Type:  "TXT",
			Value: fmt.Sprintf("v=TLSRPTv1; rua=mailto:tlsrpt@%s", domain),
			Note:  "TLS reporting (optional)",
		},
		{
			Host:  "default._bimi." + domain,
			Type:  "TXT",
			Value: fmt.Sprintf("v=BIMI1; l=https://%s/bimi/logo.svg;", domain),
			Note:  "BIMI (optional; needs DMARC enforce)",
		},
	}
}
