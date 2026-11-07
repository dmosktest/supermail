package analyze

import (
	"context"
	"fmt"
	"strings"
)

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
	stsRecs := txtMatch(txts, func(t string) bool {
		return strings.Contains(strings.ToUpper(t), "V=STSV1")
	})
	if len(stsRecs) > 1 {
		return []Finding{f("STS1", "STS1_MULTI", "medium", "Multiple MTA-STS TXT records",
			fmt.Sprintf("%d × v=STSv1 on %s", len(stsRecs), host),
			"Keep exactly one MTA-STS TXT; discovery fails when several records exist.", 0.4)}
	}
	if len(stsRecs) == 1 {
		return []Finding{f("STS1", "STS1_OK", "ok", "MTA-STS DNS record present", stsRecs[0], "", -0.05)}
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
	tlsRecs := txtMatch(txts, func(t string) bool {
		return strings.Contains(strings.ToUpper(t), "V=TLSRPTV1")
	})
	if len(tlsRecs) > 1 {
		return []Finding{f("TLSRPT1", "TLSRPT1_MULTI", "medium", "Multiple TLS-RPT TXT records",
			fmt.Sprintf("%d × v=TLSRPTv1 on %s", len(tlsRecs), host),
			"Keep exactly one TLS-RPT TXT at _smtp._tls.", 0.3)}
	}
	if len(tlsRecs) == 1 {
		return []Finding{f("TLSRPT1", "TLSRPT1_OK", "ok", "TLS-RPT DNS record present", tlsRecs[0], "", -0.05)}
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
	bimiRecs := txtMatch(txts, func(t string) bool {
		low := strings.ToLower(t)
		return strings.Contains(low, "v=bimi1") || strings.Contains(low, "l=")
	})
	if len(bimiRecs) > 1 {
		return []Finding{f("BIMI1", "BIMI1_MULTI", "medium", "Multiple BIMI TXT records",
			fmt.Sprintf("%d BIMI TXT on %s", len(bimiRecs), host),
			"Keep exactly one BIMI TXT at default._bimi.", 0.3)}
	}
	if len(bimiRecs) == 1 {
		return []Finding{f("BIMI1", "BIMI1_OK", "ok", "BIMI DNS record present", bimiRecs[0], "", 0)}
	}
	return []Finding{f("BIMI1", "BIMI1_MISSING", "info", "No BIMI DNS record", host, "", 0)}
}
