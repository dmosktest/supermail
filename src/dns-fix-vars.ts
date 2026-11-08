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

/** Host from "N TXT on sel._domainkey.dom" or "sel._domainkey.dom: dkim: …". */
function extractDkimHost(detail: string): string {
  const d = (detail || "").trim();
  const on = d.match(/\bon\s+([^\s:]+)/i);
  if (on) return on[1];
  const bare = d.match(/^([^\s:]+._domainkey\.[^\s:]+)/i);
  if (bare) return bare[1];
  return "";
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

/** Hostname/FQDN only — not a policy TXT body (v=spf1 / v=DMARC1; …). */
function looksLikeDnsName(s: string): boolean {
  const d = (s || "").trim().toLowerCase().replace(/\.$/, "");
  if (!d || d.includes(" ") || d.includes(";") || d.includes("=") || d.includes("@")) {
    return false;
  }
  return /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(d) && d.includes(".");
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

/** Relative owner name for DNS panels (zone already = domain). Prefer over FQDN. */
function relativeDnsName(fqdn: string, domain: string): string {
  const h = (fqdn || "").trim().toLowerCase().replace(/\.$/, "");
  const d = (domain || "").trim().toLowerCase().replace(/\.$/, "");
  if (!h) return "@";
  if (!d) return h;
  if (h === d) return "@";
  if (h.endsWith("." + d)) {
    const rel = h.slice(0, -(d.length + 1));
    return rel || "@";
  }
  return h;
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

  if (code.startsWith("DKIM3") || code.startsWith("DKIM4")) {
    const hostFromDetail = extractDkimHost(detail);
    if (hostFromDetail) {
      const p = parseDkimHost(hostFromDetail);
      dkimHost = p.dkimHost;
      selector = p.selector || selector;
      if (p.domain && looksLikeDnsName(p.domain)) domain = p.domain;
    } else {
      const dTag = detail.match(/\bd=([^\s:;]+)/i);
      if (dTag && looksLikeDnsName(dTag[1])) {
        domain = dTag[1].toLowerCase().replace(/\.$/, "");
      }
    }
  } else if (code.startsWith("DMARC")) {
    const d = stripDmarcHost(detail);
    if (looksLikeDnsName(d)) domain = d;
  } else if (code.startsWith("SPF1") || code.startsWith("MX1")) {
    if (looksLikeDnsName(detail)) domain = detail.toLowerCase().replace(/\.$/, "");
  } else if (code.startsWith("STS1")) {
    const d = stripPolicyHost(detail, "_mta-sts.");
    if (looksLikeDnsName(d)) domain = d;
  } else if (code.startsWith("TLSRPT1")) {
    const d = stripPolicyHost(detail, "_smtp._tls.");
    if (looksLikeDnsName(d)) domain = d;
  } else if (code.startsWith("BIMI1")) {
    const d = stripPolicyHost(detail, "default._bimi.");
    if (looksLikeDnsName(d)) domain = d;
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
  const hostFqdn = host || mailhost;
  const rua = `dmarc@${domain}`;
  const hostLabel = relativeDnsName(hostFqdn, domain);
  const dkimLabel = `${selector}._domainkey`;
  const mailhostLabel = relativeDnsName(mailhost, domain);

  return {
    ip: ip || "203.0.113.10",
    domain,
    name,
    helo: helo || name,
    ptr: ptr || "\u2014",
    host: hostFqdn,
    hostLabel,
    selector,
    dkimHost,
    dkimLabel,
    mailhost,
    mailhostLabel,
    rua,
  };
}

export function applyDnsFixVars(
  fix: string,
  rep: DnsFixReport | null | undefined,
  f: DnsFixFinding,
): string {
  if (
    !fix ||
    !/\{(ip|domain|name|helo|ptr|host|hostLabel|selector|dkimHost|dkimLabel|mailhost|mailhostLabel|rua)\}/.test(
      fix,
    )
  ) {
    return fix;
  }
  const vars = dnsFixVars(rep, f);
  return fix.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}
