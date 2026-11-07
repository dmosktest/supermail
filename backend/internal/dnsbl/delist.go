package dnsbl

import (
	"fmt"
	"strings"
)

// Delist holds the public removal / lookup page for a DNSBL zone.
type Delist struct {
	Name string
	URL  string // may contain "{ip}"
	Note string // short English hint (auto-expire, etc.)
}

// DelistByZone maps every zone in Lists to a removal/lookup page.
var DelistByZone = map[string]Delist{
	"zen.spamhaus.org": {
		Name: "Spamhaus ZEN",
		URL:  "https://check.spamhaus.org/",
		Note: "Look up the IP, then follow the removal steps for SBL/XBL/PBL/CSS.",
	},
	"bl.spamcop.net": {
		Name: "SpamCop",
		URL:  "https://www.spamcop.net/bl.shtml",
		Note: "Listings usually clear automatically within about 24h if no new reports arrive.",
	},
	"b.barracudacentral.org": {
		Name: "Barracuda BRBL",
		URL:  "https://www.barracudacentral.org/rbl/removal-request",
	},
	"dnsbl.sorbs.net": {
		Name: "SORBS",
		URL:  "https://www.sorbs.net/delisting/",
	},
	"psbl.surriel.com": {
		Name: "PSBL",
		URL:  "https://psbl.org/remove",
	},
	"dnsbl-1.uceprotect.net": {
		Name: "UCEPROTECT Level 1",
		URL:  "https://www.uceprotect.net/en/rblcheck.php",
	},
	"cbl.abuseat.org": {
		Name: "CBL (AbuseAt)",
		URL:  "https://www.abuseat.org/lookup.cgi",
	},
	"spam.dnsbl.anonmails.de": {
		Name: "anonmails.de",
		URL:  "https://www.anonmails.de/en/blacklist",
	},
	"bl.mailspike.net": {
		Name: "Mailspike",
		URL:  "https://mailspike.net/iplookup.html",
	},
	"truncate.gbudb.net": {
		Name: "GBUdb Truncate",
		URL:  "https://www.gbudb.com/truncate/how-ips-are-removed.jsp",
		Note: "No manual delist — listings decay automatically (often 1–2 days).",
	},
	"dyna.spamrats.com": {
		Name: "SpamRats Dyna",
		URL:  "https://www.spamrats.com/removal.php",
	},
	"spam.spamrats.com": {
		Name: "SpamRats Spam",
		URL:  "https://www.spamrats.com/removal.php",
	},
	"noptr.spamrats.com": {
		Name: "SpamRats NoPTR",
		URL:  "https://www.spamrats.com/removal.php",
	},
	"dnsbl.dronebl.org": {
		Name: "DroneBL",
		URL:  "https://dronebl.org/lookup",
	},
	"all.s5h.net": {
		Name: "s5h.net",
		URL:  "https://www.usenix.org.uk/content/rbl.html",
	},
	"dnsbl.spfbl.net": {
		Name: "SPFBL",
		URL:  "https://spfbl.net/en/delist/",
	},
	"ubl.unsubscore.com": {
		Name: "LashBack UBL",
		URL:  "https://blacklist.lashback.com/",
	},
	"db.wpbl.info": {
		Name: "WPBL",
		URL:  "https://www.wpbl.info/",
	},
	"rbl.interserver.net": {
		Name: "InterServer RBL",
		URL:  "https://rbl.interserver.net/",
	},
	"dnsbl.zapbl.net": {
		Name: "ZapBL",
		URL:  "https://zapbl.net/",
	},
}

func expandURL(raw, ip string) string {
	u := strings.ReplaceAll(raw, "{ip}", ip)
	return u
}

// FormatDelistHints builds a plain-text fix block with one line per listed zone.
func FormatDelistHints(ip string, listed []string) string {
	if len(listed) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("Stop the abuse source, then request delisting on each list:")
	for _, zone := range listed {
		info, ok := DelistByZone[zone]
		if !ok {
			b.WriteString(fmt.Sprintf("\n- %s — check the list operator’s website for removal", zone))
			continue
		}
		url := expandURL(info.URL, ip)
		line := fmt.Sprintf("\n- %s (%s): %s", info.Name, zone, url)
		if info.Note != "" {
			line += " — " + info.Note
		}
		b.WriteString(line)
	}
	return b.String()
}
