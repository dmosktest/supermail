import "./style.css";
import { detectLocale, t } from "./i18n";
import { registerServiceWorker } from "./register-sw";
import type { Locale } from "./site-config";
import type { MessageKey } from "./i18n-keys";

type Finding = {
  id: string;
  severity: string;
  title: string;
  detail: string;
  fix?: string;
};

type Report = {
  domain: string;
  grade: string;
  score: number;
  findings: Finding[];
  records: {
    mx: string[];
    spf: string;
    dmarc: string;
    dkim: string;
    bimi: string;
  };
  generators: {
    spf: string;
    dmarc: string;
    dkimHint: string;
  };
  blacklist: { ip: string; listed: string[]; checked: number };
  smtp: { host?: string; banner?: string; starttls: boolean; ok: boolean; error?: string };
  ptr?: string;
};

const state: { locale: Locale } = { locale: "ru" };

function byId<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ""));
}

function setStatus(message: string, isError = false): void {
  const el = byId<HTMLElement>("status");
  el.textContent = message;
  el.classList.toggle("is-error", isError);
}

function sevKey(severity: string): MessageKey {
  switch (severity) {
    case "ok":
      return "sevOk";
    case "info":
      return "sevInfo";
    case "low":
      return "sevLow";
    case "medium":
      return "sevMedium";
    case "high":
      return "sevHigh";
    case "critical":
      return "sevCritical";
    default:
      return "sevInfo";
  }
}

async function copyText(text: string, statusEl?: HTMLElement): Promise<void> {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    if (statusEl) {
      statusEl.textContent = t(state.locale, "copied");
      statusEl.classList.remove("is-error");
    } else {
      setStatus(t(state.locale, "copied"));
    }
  } catch {
    setStatus(t(state.locale, "copyError"), true);
  }
}

function applyChrome(): void {
  const loc = state.locale;
  byId("domain-label").textContent = t(loc, "domainLabel");
  byId("selector-label").textContent = t(loc, "selectorLabel");
  byId("ip-label").textContent = t(loc, "ipLabel");
  byId("check-btn").textContent = t(loc, "checkBtn");
  byId("grade-label").textContent = t(loc, "gradeLabel");
  byId("findings-title").textContent = t(loc, "findingsTitle");
  byId("records-title").textContent = t(loc, "recordsTitle");
  byId("generators-title").textContent = t(loc, "generatorsTitle");
  byId("blacklist-title").textContent = t(loc, "blacklistTitle");
  byId("smtp-title").textContent = t(loc, "smtpTitle");
}

function bindLangMenu(): void {
  const details = document.querySelector("details.lang");
  if (!(details instanceof HTMLDetailsElement)) return;
  document.addEventListener("click", (ev) => {
    if (!details.open) return;
    if (!details.contains(ev.target as Node)) details.open = false;
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") details.open = false;
  });
}

function renderFindings(list: Finding[]): void {
  const root = byId("findings");
  root.replaceChildren();
  if (!list.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = t(state.locale, "emptyFindings");
    root.append(p);
    return;
  }
  for (const f of list) {
    const card = document.createElement("article");
    card.className = `finding sev-${f.severity || "info"}`;
    const head = document.createElement("div");
    head.className = "finding-head";
    const badge = document.createElement("span");
    badge.className = "sev-badge";
    badge.textContent = t(state.locale, sevKey(f.severity));
    const code = document.createElement("span");
    code.className = "finding-id";
    code.textContent = f.id;
    const title = document.createElement("h3");
    title.textContent = f.title;
    head.append(badge, code, title);
    const detail = document.createElement("p");
    detail.className = "finding-detail";
    detail.textContent = f.detail;
    card.append(head, detail);
    if (f.fix) {
      const fixWrap = document.createElement("div");
      fixWrap.className = "fix-block";
      const fixLabel = document.createElement("p");
      fixLabel.className = "seo-label";
      fixLabel.textContent = t(state.locale, "fixLabel");
      const pre = document.createElement("pre");
      pre.textContent = f.fix;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.textContent = t(state.locale, "copy");
      const st = document.createElement("span");
      st.className = "row-status";
      btn.addEventListener("click", () => void copyText(f.fix!, st));
      fixWrap.append(fixLabel, pre, btn, st);
      card.append(fixWrap);
    }
    root.append(card);
  }
}

function recordLine(label: string, value: string): HTMLElement {
  const row = document.createElement("div");
  row.className = "record-row";
  const name = document.createElement("strong");
  name.textContent = label;
  const pre = document.createElement("pre");
  pre.textContent = value || t(state.locale, "recNone");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-ghost";
  btn.textContent = t(state.locale, "copy");
  btn.disabled = !value;
  btn.addEventListener("click", () => void copyText(value));
  row.append(name, pre, btn);
  return row;
}

function renderRecords(rep: Report): void {
  const root = byId("records");
  root.replaceChildren();
  root.append(recordLine("MX", (rep.records.mx || []).join("\n")));
  root.append(recordLine("SPF", rep.records.spf || ""));
  root.append(recordLine("DKIM", rep.records.dkim || ""));
  root.append(recordLine("DMARC", rep.records.dmarc || ""));
  root.append(recordLine("BIMI", rep.records.bimi || ""));
}

function renderGenerators(rep: Report): void {
  const root = byId("generators");
  root.replaceChildren();
  root.append(recordLine("SPF", rep.generators.spf || ""));
  root.append(recordLine("DMARC", rep.generators.dmarc || ""));
  root.append(recordLine("DKIM", rep.generators.dkimHint || ""));
}

function renderMeta(rep: Report): void {
  const bl = byId("blacklist");
  if (rep.blacklist?.listed?.length) {
    bl.textContent = format(t(state.locale, "blacklistListed"), {
      lists: rep.blacklist.listed.join(", "),
    });
  } else if (rep.blacklist?.ip) {
    bl.textContent = `${rep.blacklist.ip}: ${t(state.locale, "blacklistClean")}`;
  } else {
    bl.textContent = t(state.locale, "blacklistClean");
  }
  if (rep.ptr) bl.textContent += ` · PTR ${rep.ptr}`;

  const smtp = byId("smtp");
  if (!rep.smtp?.ok) {
    smtp.textContent = rep.smtp?.error || "—";
    return;
  }
  const tls = rep.smtp.starttls ? t(state.locale, "yes") : t(state.locale, "no");
  smtp.textContent = `${rep.smtp.host || ""} · STARTTLS: ${tls}`;
  if (rep.smtp.banner) {
    smtp.textContent += `\n${t(state.locale, "smtpBanner")}: ${rep.smtp.banner}`;
  }
}

function showReport(rep: Report): void {
  const results = byId("results");
  results.hidden = false;
  const badge = byId("grade-badge");
  badge.textContent = rep.grade;
  badge.dataset.grade = rep.grade;
  byId("score-line").textContent = `${rep.score}/100 · ${rep.domain}`;
  renderFindings(rep.findings || []);
  renderRecords(rep);
  renderGenerators(rep);
  renderMeta(rep);
}

async function runCheck(ev: Event): Promise<void> {
  ev.preventDefault();
  const domain = byId<HTMLInputElement>("domain").value.trim();
  const selector = byId<HTMLInputElement>("selector").value.trim();
  const ip = byId<HTMLInputElement>("ip").value.trim();
  if (!domain || !domain.includes(".")) {
    setStatus(t(state.locale, "errorDomain"), true);
    return;
  }
  if (ip && !/^[\d.:a-fA-F]+$/.test(ip)) {
    setStatus(t(state.locale, "errorIp"), true);
    return;
  }
  const btn = byId<HTMLButtonElement>("check-btn");
  btn.disabled = true;
  btn.textContent = t(state.locale, "checking");
  setStatus("");
  try {
    const res = await fetch("/api/v1/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, selector: selector || undefined, ip: ip || undefined }),
    });
    const data = (await res.json()) as Report & { error?: string; message?: string };
    if (!res.ok) {
      setStatus(data.message || t(state.locale, "errorServer"), true);
      return;
    }
    showReport(data);
  } catch {
    setStatus(t(state.locale, "errorNetwork"), true);
  } finally {
    btn.disabled = false;
    btn.textContent = t(state.locale, "checkBtn");
  }
}

state.locale = detectLocale();
applyChrome();
bindLangMenu();
byId("check-form").addEventListener("submit", (ev) => void runCheck(ev));
registerServiceWorker();
