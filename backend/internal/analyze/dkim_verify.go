package analyze

import (
	"bytes"
	"context"
	"fmt"
	"net/mail"
	"strings"

	"github.com/emersion/go-msgauth/dkim"
)

func checkDKIMFull(ctx context.Context, raw []byte, h mail.Header) (findings []Finding, alignedDomains []string) {
	findings = checkDKIMHeader(ctx, h)
	if len(raw) == 0 {
		return findings, nil
	}
	sel := dkimSelectorFromHeader(h)
	vers, err := dkim.VerifyWithOptions(bytes.NewReader(raw), &dkim.VerifyOptions{
		LookupTXT: func(name string) ([]string, error) {
			return lookupTXT(ctx, name)
		},
	})
	if err != nil && len(vers) == 0 {
		findings = append(findings, f("DKIM4", "DKIM4_ERROR", "info", "DKIM crypto verify error",
			err.Error(), "", 0))
		return findings, nil
	}
	if len(vers) == 0 {
		return findings, nil
	}
	for i, v := range vers {
		dom := strings.ToLower(strings.TrimSuffix(v.Domain, "."))
		if v.Err != nil {
			findings = append(findings, dkimVerifyErrFinding(i+1, dom, sel, v.Err))
			continue
		}
		if dom != "" {
			alignedDomains = append(alignedDomains, dom)
		}
		findings = append(findings, f("DKIM4", "DKIM4_PASS", "ok",
			fmt.Sprintf("DKIM signature #%d crypto pass", i+1),
			"d="+dom, "", -0.5))
	}
	return findings, alignedDomains
}

func dkimSelectorFromHeader(h mail.Header) string {
	dkimHdr := headerGet(h, "DKIM-Signature", "Dkim-Signature")
	if dkimHdr == "" {
		return ""
	}
	if m := dkimSRe.FindStringSubmatch(dkimHdr); len(m) == 2 {
		return strings.ToLower(strings.TrimSpace(m[1]))
	}
	return ""
}

func dkimVerifyErrFinding(n int, dom, sel string, err error) Finding {
	msg := strings.ToLower(err.Error())
	detail := fmt.Sprintf("d=%s: %v", dom, err)
	if sel != "" && dom != "" {
		host := sel + "._domainkey." + dom
		if strings.Contains(msg, "multiple txt") ||
			strings.Contains(msg, "no key") ||
			strings.Contains(msg, "no valid key") ||
			strings.Contains(msg, "key unavailable") ||
			strings.Contains(msg, "key revoked") ||
			strings.Contains(msg, "key syntax") ||
			strings.Contains(msg, "key is too short") ||
			strings.Contains(msg, "incompatible public key") ||
			strings.Contains(msg, "unsupported key") {
			detail = fmt.Sprintf("%s: %v", host, err)
		}
	}

	switch {
	case strings.Contains(msg, "multiple txt"):
		return f("DKIM4", "DKIM4_MULTI", "high",
			fmt.Sprintf("DKIM signature #%d: multiple DNS TXT for key", n),
			detail,
			"Keep exactly one TXT at the selector._domainkey name. Example record:\n\nName: {dkimLabel}\nType: TXT\nValue: v=DKIM1; k=rsa; p=<your_public_key_base64>\n\nExample check:\nnslookup -type=TXT {dkimHost}", 1.5)
	case strings.Contains(msg, "no key for signature") ||
		strings.Contains(msg, "no valid key found") ||
		strings.Contains(msg, "key unavailable"):
		return f("DKIM4", "DKIM4_NOKEY", "high",
			fmt.Sprintf("DKIM signature #%d: public key not usable in DNS", n),
			detail,
			"Publish the public key for selector {selector}. Example record:\n\nName: {dkimLabel}\nType: TXT\nValue: v=DKIM1; k=rsa; p=<your_public_key_base64>\n\nExample check:\nnslookup -type=TXT {dkimHost}", 1.5)
	case strings.Contains(msg, "key revoked"):
		return f("DKIM4", "DKIM4_REVOKED", "high",
			fmt.Sprintf("DKIM signature #%d: DNS key revoked (empty p=)", n),
			detail,
			"The TXT at {dkimHost} has an empty p= (revoked). Publish a new key and resign, or remove the empty record. Example record:\n\nName: {dkimLabel}\nType: TXT\nValue: v=DKIM1; k=rsa; p=<your_public_key_base64>\n\nExample check:\nnslookup -type=TXT {dkimHost}", 1.5)
	case strings.Contains(msg, "key is too short") ||
		strings.Contains(msg, "key syntax") ||
		strings.Contains(msg, "incompatible public key") ||
		strings.Contains(msg, "unsupported key algorithm") ||
		strings.Contains(msg, "inappropriate key") ||
		strings.Contains(msg, "inappropriate hash") ||
		strings.Contains(msg, "inappropriate service"):
		return f("DKIM4", "DKIM4_BADKEY", "high",
			fmt.Sprintf("DKIM signature #%d: DNS key unusable", n),
			detail,
			"Fix the DKIM public key TXT (RSA ≥1024, valid p=, matching k=/h=). Example record:\n\nName: {dkimLabel}\nType: TXT\nValue: v=DKIM1; k=rsa; p=<your_public_key_base64>\n\nExample check:\nnslookup -type=TXT {dkimHost}", 1.5)
	case strings.Contains(msg, "signature has expired"):
		return f("DKIM4", "DKIM4_EXPIRED", "medium",
			fmt.Sprintf("DKIM signature #%d expired", n),
			detail,
			"Resign with a fresh DKIM-Signature (check the x= expiration tag, or omit x= if you do not need expiry).", 0.8)
	case strings.Contains(msg, "body hash did not verify") ||
		strings.Contains(msg, "signature did not verify"):
		return f("DKIM4", "DKIM4_FAIL", "high",
			fmt.Sprintf("DKIM signature #%d crypto fail", n),
			detail,
			"Fix signing (body hash / headers / private key match) so the signature verifies.", 1.5)
	default:
		return f("DKIM4", "DKIM4_PERM", "high",
			fmt.Sprintf("DKIM signature #%d invalid (policy/format)", n),
			detail,
			"Fix DKIM-Signature tags (required fields, algorithms, From in h=, no insecure l=) and resign the message.", 1.2)
	}
}
