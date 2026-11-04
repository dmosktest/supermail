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
	vers, err := dkim.Verify(bytes.NewReader(raw))
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
			findings = append(findings, f("DKIM4", "DKIM4_FAIL", "high",
				fmt.Sprintf("DKIM signature #%d crypto fail", i+1),
				fmt.Sprintf("d=%s: %v", dom, v.Err),
				"Fix signing (body hash / headers / key) so the signature verifies.", 1.5))
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
