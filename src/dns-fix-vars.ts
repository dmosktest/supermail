export type DnsFixReport = {
  mail?: {
    from?: string;
    mailFrom?: string;
    remoteIp?: string;
    helo?: string;
  };
  ptr?: string;
  blacklist?: { ip?: string };
};

export type DnsFixFinding = {
  code?: string;
  detail?: string;
};

function domainFromAddr(addr?: string): string {
  const m = (addr || "").match(/@([^>\s]+)/);
  if (!m) return "";
  return m[1].toLowerCase().replace(/\.$/, "");
}

function parseDkimHost(detail: string): { dkimHost: string; selector: string; domain: string } {
  const host = (detail || "").trim().toLowerCase().replace(/\.$/, "");
  const m = host.match(/^([^.]+)\._domainkey\.(.+)$/);
  if (m) return { dkimHost: host, selector: m[1], domain: m[2] };
  return { dkimHost: host, selector: "mail", domain: "" };
}

function stripDmarcHost(detail: string): string {
  const d = (detail || "").trim().toLowerCase().replace(/\.$/, "");
  if (d.startsWith("_dmarc.")) return d.slice("_dmarc.".length);
  return d;
}

function stripPolicyHost(detail: string, prefix: string): string {
  const d = (detail || "").trim().toLowerCase().replace(/\.$/, "");
  if (d.startsWith(prefix)) return d.slice(prefix.length);
  return d;
}

function heloHostFromDetail(detail: string): string {
  const arrow = "\u2192";
  const ne = "\u2260";
  let cut = detail.length;
  const iArrow = detail.indexOf(arrow);
  const iNe = detail.indexOf(ne);
  if (iArrow >= 0) cut = Math.min(cut, iArrow);
  if (iNe >= 0) cut = Math.min(cut, iNe);
  return detail.slice(0, cut).trim().replace(/\.$/, "");
}

export function dnsFixVars(
  rep: DnsFixReport | null | undefined,
  f: DnsFixFinding,
): Record<string, string> {
  const code = f.code || "";
  const detail = (f.detail || "").trim();
  const ip =
    rep?.mail?.remoteIp ||
    rep?.blacklist?.ip ||
    (code === "PTR1_MISSING" ? detail : "") ||
    "203.0.113.10";
  const helo = (rep?.mail?.helo || "").trim().replace(/\.$/, "");
  const ptr = (rep?.ptr || "").trim().replace(/\.$/, "");

  let domain =
    domainFromAddr(rep?.mail?.from) ||
    domainFromAddr(rep?.mail?.mailFrom) ||
    "";

  let selector = "mail";
  let dkimHost = "";

  if (code.startsWith("DKIM3") || code === "DKIM3_DNS_MISSING") {
    const p = parseDkimHost(detail);
    dkimHost = p.dkimHost;
    selector = p.selector || selector;
    if (p.domain) domain = p.domain;
  } else if (code.startsWith("DMARC")) {
    const d = stripDmarcHost(detail);
    if (d && !d.includes(" ")) domain = d;
  } else if (code.startsWith("SPF1") || code.startsWith("MX1")) {
    if (detail && !detail.includes(" ") && detail.includes(".")) domain = detail.toLowerCase();
  } else if (code.startsWith("STS1")) {
    const d = stripPolicyHost(detail, "_mta-sts.");
    if (d) domain = d;
  } else if (code.startsWith("TLSRPT1")) {
    const d = stripPolicyHost(detail, "_smtp._tls.");
    if (d) domain = d;
  } else if (code.startsWith("BIMI1")) {
    const d = stripPolicyHost(detail, "default._bimi.");
    if (d) domain = d;
  }

  if (!domain) domain = "example.com";

  let name = helo;
  if (!name && code === "PTR2_MISMATCH" && detail.includes("\u2260")) {
    const parts = detail.split("\u2260").map((s) => s.trim());
    if (parts.length === 2) name = parts[1] || parts[0];
  }
  if (!name) name = ptr || `mail.${domain}`;

  let host = helo || name;
  if (code.startsWith("HELO2") && detail) {
    const left = heloHostFromDetail(detail);
    if (left) host = left;
  }

  if (!dkimHost) dkimHost = `${selector}._domainkey.${domain}`;

  const mailhost = helo && !/^\d/.test(helo) && !helo.includes(":") ? helo : `mail.${domain}`;
  const rua = `dmarc@${domain}`;

  return {
    ip: ip || "203.0.113.10",
    domain,
    name,
    helo: helo || name,
    ptr: ptr || "\u2014",
    host: host || mailhost,
    selector,
    dkimHost,
    mailhost,
    rua,
  };
}

export function applyDnsFixVars(
  fix: string,
  rep: DnsFixReport | null | undefined,
  f: DnsFixFinding,
): string {
  if (!fix || !/\{(ip|domain|name|helo|ptr|host|selector|dkimHost|mailhost|rua)\}/.test(fix)) {
    return fix;
  }
  const vars = dnsFixVars(rep, f);
  return fix.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}
