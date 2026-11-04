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
  grade: string;
  score: number;
  mail: {
    from?: string;
    subject?: string;
    remoteIp?: string;
    helo?: string;
    mailFrom?: string;
  };
  findings: Finding[];
  ptr?: string;
  blacklist?: { ip: string; listed: string[]; checked: number };
};

type Inbox = {
  id: string;
  address: string;
  status: "waiting" | "ready" | "expired";
  expiresAt?: string;
  report?: Report;
};

const state: {
  locale: Locale;
  inboxId: string | null;
  pollTimer: number | null;
} = { locale: "ru", inboxId: null, pollTimer: null };

function byId<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ""));
}

function setError(message: string): void {
  const el = byId("status");
  el.textContent = message;
  el.classList.toggle("is-error", Boolean(message));
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

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    byId("waiting-status").textContent = t(state.locale, "copied");
  } catch {
    setError(t(state.locale, "copyError"));
  }
}

function applyChrome(): void {
  const loc = state.locale;
  byId("inbox-lead").textContent = t(loc, "inboxLead");
  byId("your-address-label").textContent = t(loc, "yourAddress");
  byId("copy-btn").textContent = t(loc, "copy");
  byId("new-btn").textContent = t(loc, "newAddress");
  byId("waiting-hint").textContent = t(loc, "waitingHint");
  byId("grade-label").textContent = t(loc, "gradeLabel");
  byId("findings-title").textContent = t(loc, "findingsTitle");
  byId("mail-meta-title").textContent = t(loc, "mailMetaTitle");
  byId("blacklist-title").textContent = t(loc, "blacklistTitle");
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

function stopPoll(): void {
  if (state.pollTimer != null) {
    window.clearInterval(state.pollTimer);
    state.pollTimer = null;
  }
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
      btn.addEventListener("click", () => void copyText(f.fix!));
      fixWrap.append(fixLabel, pre, btn);
      card.append(fixWrap);
    }
    root.append(card);
  }
}

function showReport(rep: Report): void {
  const results = byId("results");
  results.hidden = false;
  byId("waiting-status").textContent = "";
  const badge = byId("grade-badge");
  badge.textContent = rep.grade;
  badge.dataset.grade = rep.grade;
  byId("score-line").textContent = `${rep.score}/100`;

  const meta = byId("mail-meta");
  const lines = [
    `${t(state.locale, "fromLabel")}: ${rep.mail?.from || "—"}`,
    `${t(state.locale, "subjectLabel")}: ${rep.mail?.subject || "—"}`,
    `${t(state.locale, "ipLabel")}: ${rep.mail?.remoteIp || "—"}`,
  ];
  if (rep.ptr) lines.push(`PTR: ${rep.ptr}`);
  if (rep.mail?.helo) lines.push(`EHLO: ${rep.mail.helo}`);
  meta.textContent = lines.join("\n");

  renderFindings(rep.findings || []);

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
}

async function pollOnce(): Promise<void> {
  if (!state.inboxId) return;
  try {
    const res = await fetch(`/api/v1/inbox/${state.inboxId}`);
    const data = (await res.json()) as Inbox & { message?: string };
    if (!res.ok) {
      setError(data.message || t(state.locale, "errorServer"));
      return;
    }
    if (data.status === "ready" && data.report) {
      stopPoll();
      showReport(data.report);
      return;
    }
    if (data.status === "expired") {
      stopPoll();
      byId("waiting-status").textContent = t(state.locale, "expired");
      return;
    }
    byId("waiting-status").textContent = t(state.locale, "waiting");
  } catch {
    setError(t(state.locale, "errorNetwork"));
  }
}

function startPoll(): void {
  stopPoll();
  byId("results").hidden = true;
  byId("waiting-status").textContent = t(state.locale, "waiting");
  void pollOnce();
  state.pollTimer = window.setInterval(() => void pollOnce(), 3000);
}

async function createInbox(): Promise<void> {
  setError("");
  stopPoll();
  byId("results").hidden = true;
  byId("address").textContent = "…";
  try {
    const res = await fetch("/api/v1/inbox", { method: "POST" });
    const data = (await res.json()) as Inbox & { message?: string };
    if (!res.ok) {
      setError(data.message || t(state.locale, "errorServer"));
      return;
    }
    state.inboxId = data.id;
    byId("address").textContent = data.address;
    const url = new URL(window.location.href);
    url.searchParams.set("i", data.id);
    window.history.replaceState({}, "", url.toString());
    startPoll();
  } catch {
    setError(t(state.locale, "errorNetwork"));
  }
}

async function resumeOrCreate(): Promise<void> {
  const id = new URL(window.location.href).searchParams.get("i");
  if (!id) {
    await createInbox();
    return;
  }
  try {
    const res = await fetch(`/api/v1/inbox/${id}`);
    const data = (await res.json()) as Inbox;
    if (!res.ok) {
      await createInbox();
      return;
    }
    state.inboxId = data.id;
    byId("address").textContent = data.address;
    if (data.status === "ready" && data.report) {
      showReport(data.report);
      return;
    }
    if (data.status === "expired") {
      byId("waiting-status").textContent = t(state.locale, "expired");
      return;
    }
    startPoll();
  } catch {
    await createInbox();
  }
}

state.locale = detectLocale();
applyChrome();
bindLangMenu();
byId("copy-btn").addEventListener("click", () => {
  const addr = byId("address").textContent || "";
  if (addr && addr !== "…") void copyText(addr);
});
byId("new-btn").addEventListener("click", () => void createInbox());
void resumeOrCreate();
registerServiceWorker();
