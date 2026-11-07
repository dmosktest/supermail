export type DnsblDelist = {
  name: string;
  url: string;
  noteEn: string;
  noteRu: string;
};

/** Removal / lookup pages for every zone checked by the API. */
export const DNSBL_DELIST: Record<string, DnsblDelist> = {
  "zen.spamhaus.org": {
    name: "Spamhaus ZEN",
    url: "https://check.spamhaus.org/",
    noteEn: "Look up the IP, then follow removal for SBL/XBL/PBL/CSS.",
    noteRu: "Проверьте IP и пройдите снятие с SBL/XBL/PBL/CSS.",
  },
  "bl.spamcop.net": {
    name: "SpamCop",
    url: "https://www.spamcop.net/bl.shtml",
    noteEn: "Usually clears in ~24h if there are no new reports.",
    noteRu: "Обычно сходит само за ~24 ч, если нет новых жалоб.",
  },
  "b.barracudacentral.org": {
    name: "Barracuda BRBL",
    url: "https://www.barracudacentral.org/rbl/removal-request",
    noteEn: "Submit a removal request after fixing the cause.",
    noteRu: "После устранения причины подайте заявку на снятие.",
  },
  "dnsbl.sorbs.net": {
    name: "SORBS",
    url: "https://www.sorbs.net/delisting/",
    noteEn: "Use the SORBS delisting process for the matching list.",
    noteRu: "Снятие через процедуру SORBS для нужного списка.",
  },
  "psbl.surriel.com": {
    name: "PSBL",
    url: "https://psbl.org/remove",
    noteEn: "Automated removal form on psbl.org.",
    noteRu: "Автоформа снятия на psbl.org.",
  },
  "dnsbl-1.uceprotect.net": {
    name: "UCEPROTECT Level 1",
    url: "https://www.uceprotect.net/en/rblcheck.php",
    noteEn: "Check the IP, then follow UCEPROTECT removal.",
    noteRu: "Проверьте IP и следуйте инструкции UCEPROTECT.",
  },
  "cbl.abuseat.org": {
    name: "CBL (AbuseAt)",
    url: "https://www.abuseat.org/lookup.cgi",
    noteEn: "Lookup the IP and request CBL delist if clean.",
    noteRu: "Проверьте IP и запросите снятие с CBL, если чисто.",
  },
  "spam.dnsbl.anonmails.de": {
    name: "anonmails.de",
    url: "https://www.anonmails.de/en/blacklist",
    noteEn: "Check the IP, then request removal on the same page.",
    noteRu: "Проверьте IP и запросите снятие на той же странице.",
  },
  "bl.mailspike.net": {
    name: "Mailspike",
    url: "https://mailspike.net/iplookup.html",
    noteEn: "Lookup the IP and contact Mailspike if needed.",
    noteRu: "Проверьте IP и при необходимости свяжитесь с Mailspike.",
  },
  "truncate.gbudb.net": {
    name: "GBUdb Truncate",
    url: "https://www.gbudb.com/truncate/how-ips-are-removed.jsp",
    noteEn: "No manual delist — usually clears in 1–2 days by itself.",
    noteRu: "Ручного снятия нет — обычно сходит само за 1–2 дня.",
  },
  "dyna.spamrats.com": {
    name: "SpamRats Dyna",
    url: "https://www.spamrats.com/removal.php",
    noteEn: "SpamRats removal form.",
    noteRu: "Форма снятия SpamRats.",
  },
  "spam.spamrats.com": {
    name: "SpamRats Spam",
    url: "https://www.spamrats.com/removal.php",
    noteEn: "SpamRats removal form.",
    noteRu: "Форма снятия SpamRats.",
  },
  "noptr.spamrats.com": {
    name: "SpamRats NoPTR",
    url: "https://www.spamrats.com/removal.php",
    noteEn: "SpamRats removal form.",
    noteRu: "Форма снятия SpamRats.",
  },
  "dnsbl.dronebl.org": {
    name: "DroneBL",
    url: "https://dronebl.org/lookup",
    noteEn: "Lookup the IP and request removal from the listed device.",
    noteRu: "Проверьте IP и запросите снятие с затронутого устройства.",
  },
  "all.s5h.net": {
    name: "s5h.net",
    url: "https://www.usenix.org.uk/content/rbl.html",
    noteEn: "See s5h / usenix.org.uk RBL notes for delist.",
    noteRu: "Смотрите страницу s5h / usenix.org.uk про снятие.",
  },
  "dnsbl.spfbl.net": {
    name: "SPFBL",
    url: "https://spfbl.net/en/delist/",
    noteEn: "Self-service free or paid delist on SPFBL.",
    noteRu: "Самостоятельное снятие (бесплатно или платно) на SPFBL.",
  },
  "ubl.unsubscore.com": {
    name: "LashBack UBL",
    url: "https://blacklist.lashback.com/",
    noteEn: "Check listing and follow LashBack UBL removal.",
    noteRu: "Проверьте попадание и снятие в LashBack UBL.",
  },
  "db.wpbl.info": {
    name: "WPBL",
    url: "https://www.wpbl.info/",
    noteEn: "Check WPBL and follow their removal process.",
    noteRu: "Проверьте WPBL и пройдите их процедуру снятия.",
  },
  "rbl.interserver.net": {
    name: "InterServer RBL",
    url: "https://rbl.interserver.net/",
    noteEn: "Lookup / contact InterServer RBL for removal.",
    noteRu: "Проверка / обращение в InterServer RBL для снятия.",
  },
  "dnsbl.zapbl.net": {
    name: "ZapBL",
    url: "https://zapbl.net/",
    noteEn: "Check ZapBL policy and request delist if eligible.",
    noteRu: "Смотрите политику ZapBL и запросите снятие, если можно.",
  },
};

export function expandDelistUrl(url: string, ip: string): string {
  return url.replaceAll("{ip}", ip || "");
}

export function formatDelistFix(
  zones: string[],
  ip: string,
  locale: string,
): string {
  if (!zones.length) return "";
  const ru = locale === "ru";
  const lines = [
    ru
      ? "Сначала уберите причину (спам, open relay, заражение). Затем снимите IP с каждого списка:"
      : "First stop the abuse source (spam, open relay, compromise). Then delist the IP on each list:",
  ];
  for (const zone of zones) {
    const info = DNSBL_DELIST[zone];
    if (!info) {
      lines.push(
        ru
          ? `- ${zone} — найдите страницу снятия у оператора списка`
          : `- ${zone} — find the list operator’s removal page`,
      );
      continue;
    }
    const url = expandDelistUrl(info.url, ip);
    const note = ru ? info.noteRu : info.noteEn;
    lines.push(`- ${info.name} (${zone}): ${url}${note ? ` — ${note}` : ""}`);
  }
  return lines.join("\n");
}

export function parseListedZonesFromDetail(detail: string): string[] {
  const arrow = detail.indexOf("→");
  const raw = arrow >= 0 ? detail.slice(arrow + 1) : detail;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.includes("."));
}
