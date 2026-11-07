import "./style.css";
import { detectLocale, t } from "./i18n";
import { findingCopy } from "./findings-messages";
import { downloadAdminBrief, downloadAiBrief, solutionForFinding } from "./briefs";
import {
  DNSBL_DELIST,
  expandDelistUrl,
  formatDelistFix,
  parseListedZonesFromDetail,
} from "./dnsbl-delist";
import { registerServiceWorker } from "./register-sw";
import type { Locale } from "./site-config";
import type { MessageKey } from "./i18n-keys";

type Finding = {
  id: string;
  code?: string;
  severity: string;
  title: string;
  detail: string;
  fix?: string;
  score?: number;
};

type Report = {
  grade: string;
  score: number;
  spamScore?: number;
  testsTotal?: number;
  testsPass?: number;
  testsFail?: number;
  mail: {
    from?: string;
    to?: string;
    subject?: string;
    remoteIp?: string;
    helo?: string;
    mailFrom?: string;
  };
  headers?: { name: string; value: string }[];
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
  hasRaw?: boolean;
};

type PillarState = "pass" | "fail" | "warn" | "unknown";

const state: {
  locale: Locale;
  inboxId: string | null;
  pollTimer: number | null;
  lastReport: Report | null;
  findingsFilter: "all" | "fail" | "pass";
} = { locale: "ru", inboxId: null, pollTimer: null, lastReport: null, findingsFilter: "fail" };

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

async function copyText(
  text: string,
  statusTarget: "waiting" | "share" | "headers" = "waiting",
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    if (statusTarget === "waiting") {
      byId("waiting-status").textContent = t(state.locale, "copied");
    } else {
      const btnId = statusTarget === "headers" ? "headers-copy" : "report-share-copy";
      byId(btnId).textContent = t(state.locale, "copied");
      window.setTimeout(() => {
        byId(btnId).textContent = t(state.locale, "copy");
      }, 1400);
    }
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
  byId("retest-btn").textContent = t(loc, "retest");
  byId("waiting-hint").textContent = t(loc, "waitingHint");
  byId("grade-label").textContent = t(loc, "gradeLabel");
  byId("findings-title").textContent = t(loc, "findingsTitle");
  const filters = byId("findings-filters");
  filters.setAttribute("aria-label", t(loc, "filterAria"));
  filters.querySelectorAll<HTMLElement>("[data-filter]").forEach((btn) => {
    const mode = btn.dataset.filter;
    if (mode === "all") btn.textContent = t(loc, "filterAll");
    if (mode === "fail") btn.textContent = t(loc, "filterFail");
    if (mode === "pass") btn.textContent = t(loc, "filterPass");
  });
  byId("ai-brief-btn-text").textContent = t(loc, "downloadAiBrief");
  byId("admin-brief-btn-text").textContent = t(loc, "downloadAdminBrief");
  byId("mail-meta-title").textContent = t(loc, "mailMetaTitle");
  byId("headers-title").textContent = t(loc, "headersTitle");
  byId("headers-copy").textContent = t(loc, "copy");
  byId("headers-empty").textContent = t(loc, "headersEmpty");
  byId("export-pdf-btn").textContent = t(loc, "exportPdf");
  const privacy = byId<HTMLAnchorElement>("privacy-link");
  privacy.textContent = t(loc, "privacyLink");
  privacy.href = `/${loc}/privacy/`;
  byId("report-share-label").textContent = t(loc, "reportShareLabel");
  byId("report-share-label").title = t(loc, "reportRetentionHint");
  byId("report-rule-label").textContent = t(loc, "reportRuleLabel");
  byId("report-pillars-title").textContent = t(loc, "reportPillarsTitle");
  byId("report-share-copy").textContent = t(loc, "copy");
}

function formatHeaders(list: { name: string; value: string }[]): string {
  return list.map((h) => `${h.name}: ${h.value}`).join("\n");
}

function renderHeaders(list: { name: string; value: string }[] | undefined): void {
  const section = byId("headers-section");
  const pre = byId("headers-raw");
  const empty = byId("headers-empty");
  const copyBtn = byId<HTMLButtonElement>("headers-copy");
  section.hidden = false;
  if (!list || list.length === 0) {
    pre.hidden = true;
    pre.textContent = "";
    empty.hidden = false;
    empty.textContent = t(state.locale, "headersEmpty");
    copyBtn.disabled = true;
    return;
  }
  empty.hidden = true;
  pre.hidden = false;
  pre.textContent = formatHeaders(list);
  copyBtn.disabled = false;
}

function formatSpamScore(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  if (Object.is(rounded, -0)) return "0";
  if (rounded > 0) return `+${rounded}`;
  return String(rounded);
}

function gradeDeltaFor(severity: string): number {
  switch (severity) {
    case "critical":
      return -25;
    case "high":
      return -12;
    case "medium":
      return -6;
    case "low":
      return -3;
    default:
      return 0;
  }
}

function formatGradeDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function spamParts(list: Finding[]): { fail: number; pass: number; total: number } {
  let fail = 0;
  let pass = 0;
  for (const f of list) {
    if (typeof f.score !== "number") continue;
    if (f.score > 0) fail += f.score;
    else if (f.score < 0) pass += f.score;
  }
  return { fail, pass, total: fail + pass };
}

function localizedFinding(f: Finding): {
  title: string;
  detail: string;
  problem: string;
  why: string;
  fix: string;
} {
  const copy = findingCopy(state.locale, f.code || "");
  if (!copy) {
    return {
      title: f.title,
      detail: f.detail,
      problem: "",
      why: "",
      fix: f.fix || solutionForFinding(state.locale, f),
    };
  }
  const detailTpl = copy.detail ?? "{detail}";
  const detail = format(detailTpl, { detail: f.detail || "" }).trim();
  return {
    title: copy.title || f.title,
    detail,
    problem: (copy.problem || "").trim(),
    why: (copy.why || "").trim(),
    fix: copy.fix || solutionForFinding(state.locale, f),
  };
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

function findingsByPrefixes(list: Finding[], prefixes: string[]): Finding[] {
  return list.filter((f) =>
    prefixes.some((prefix) => f.id === prefix || f.id.startsWith(prefix)),
  );
}

const SEV_RANK: Record<string, number> = {
  ok: 0,
  info: 1,
  low: 2,
  medium: 3,
  high: 4,
  critical: 5,
};

function worstFinding(list: Finding[]): Finding | undefined {
  let best: Finding | undefined;
  let rank = -1;
  for (const f of list) {
    const r = SEV_RANK[f.severity] ?? -1;
    if (r > rank) {
      rank = r;
      best = f;
    }
  }
  return best;
}

function pillarFromFinding(f: Finding | undefined): PillarState {
  if (!f) return "unknown";
  if (f.severity === "ok" || f.severity === "info") return "pass";
  if (f.severity === "low" || f.severity === "medium") return "warn";
  if (f.severity === "high" || f.severity === "critical") return "fail";
  return "unknown";
}

/** Auth pillar: any real issue → fail (do not show Pass when a sibling check failed). */
function pillarAuthState(list: Finding[]): PillarState {
  const worst = worstFinding(list);
  if (!worst) return "unknown";
  if (worst.severity === "ok" || worst.severity === "info") return "pass";
  return "fail";
}

function resolvePillars(rep: Report): { name: string; state: PillarState }[] {
  const findings = rep.findings || [];
  const spf = findingsByPrefixes(findings, ["AUTH1", "SPF"]);
  const dkim = findingsByPrefixes(findings, ["AUTH2", "DKIM"]);
  const dmarc = findingsByPrefixes(findings, ["AUTH3", "DMARC"]);
  let dnsbl = findingsByPrefixes(findings, ["BL1"]);
  if (!dnsbl.length && rep.blacklist) {
    dnsbl = [
      {
        id: "BL1",
        severity: rep.blacklist.listed?.length ? "critical" : "ok",
        title: "",
        detail: "",
      },
    ];
  }
  return [
    { name: "SPF", state: pillarAuthState(spf) },
    { name: "DKIM", state: pillarAuthState(dkim) },
    { name: "DMARC", state: pillarAuthState(dmarc) },
    { name: "DNSBL", state: pillarAuthState(dnsbl) },
  ];
}

function pillarLabel(st: PillarState): string {
  switch (st) {
    case "pass":
      return t(state.locale, "pillarPass");
    case "fail":
      return t(state.locale, "pillarFail");
    case "warn":
      return t(state.locale, "pillarWarn");
    default:
      return t(state.locale, "pillarUnknown");
  }
}

function verdictFor(score: number, grade: string): string {
  if (grade === "A" || score >= 90) return t(state.locale, "verdictExcellent");
  if (grade === "B" || score >= 75) return t(state.locale, "verdictGood");
  if (grade === "C" || score >= 55) return t(state.locale, "verdictFair");
  if (grade === "D" || score >= 35) return t(state.locale, "verdictPoor");
  return t(state.locale, "verdictBad");
}

function ensureScoreGradient(svg: SVGSVGElement): void {
  if (svg.querySelector("#scoreGradient")) return;
  const ns = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(ns, "defs");
  const grad = document.createElementNS(ns, "linearGradient");
  grad.id = "scoreGradient";
  grad.setAttribute("x1", "0%");
  grad.setAttribute("y1", "0%");
  grad.setAttribute("x2", "100%");
  grad.setAttribute("y2", "0%");
  const stops: [string, string][] = [
    ["0%", "#e07070"],
    ["35%", "#e08a4a"],
    ["65%", "#f0852a"],
    ["100%", "#7cbc7c"],
  ];
  for (const [offset, color] of stops) {
    const stop = document.createElementNS(ns, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    grad.append(stop);
  }
  defs.append(grad);
  svg.prepend(defs);
}

function renderPillars(rep: Report): void {
  const root = byId("auth-pillars");
  root.replaceChildren();
  for (const pillar of resolvePillars(rep)) {
    const el = document.createElement("div");
    el.className = "auth-pillar";
    el.dataset.state = pillar.state;
    const name = document.createElement("span");
    name.className = "auth-pillar-name";
    name.textContent = pillar.name;
    const st = document.createElement("span");
    st.className = "auth-pillar-state";
    st.textContent = pillarLabel(pillar.state);
    el.append(name, st);
    root.append(el);
  }
}

function findingFilterStatus(f: Finding): "pass" | "fail" | "warn" {
  const bucket = pillarFromFinding(f);
  if (bucket === "pass") return "pass";
  if (bucket === "fail") return "fail";
  return "warn";
}

function applyFindingsFilter(mode: "all" | "fail" | "pass" = state.findingsFilter): void {
  state.findingsFilter = mode;
  document.querySelectorAll<HTMLElement>("#findings-filters [data-filter]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === mode);
  });
  const root = byId("findings");
  let visible = 0;
  root.querySelectorAll<HTMLElement>(".finding").forEach((el) => {
    const st = el.dataset.status || "";
    let show = true;
    if (mode === "fail") show = st === "fail" || st === "warn";
    if (mode === "pass") show = st === "pass";
    el.hidden = !show;
    if (show) visible += 1;
  });
  let empty = root.querySelector<HTMLElement>(".findings-empty-filter");
  const hasCards = root.querySelector(".finding") !== null;
  if (!hasCards) {
    empty?.remove();
    return;
  }
  if (!empty) {
    empty = document.createElement("p");
    empty.className = "muted findings-empty-filter";
    root.append(empty);
  }
  empty.textContent = t(state.locale, "emptyFilter");
  empty.hidden = visible > 0;
}

function buildFindingSummary(
  f: Finding,
  loc: { title: string; detail: string; problem: string; why: string; fix: string },
  gradeDelta: number,
  solution: string,
): string {
  const lines = [
    loc.title,
    `${f.id}${f.code ? ` · ${f.code}` : ""} · ${f.severity || "info"}`,
  ];
  if (loc.detail) lines.push(`${t(state.locale, "evidenceLabel")}: ${loc.detail}`);
  if (loc.problem) lines.push(`${t(state.locale, "problemLabel")}: ${loc.problem}`);
  if (loc.why) lines.push(`${t(state.locale, "whyLabel")}: ${loc.why}`);
  if (gradeDelta !== 0) {
    lines.push(
      format(t(state.locale, "gradeDeltaLabel"), { delta: formatGradeDelta(gradeDelta) }),
    );
  }
  if (typeof f.score === "number" && f.score !== 0) {
    lines.push(
      format(t(state.locale, "spamScoreLabel"), { score: formatSpamScore(f.score) }),
    );
  }
  if (solution) {
    lines.push(`${t(state.locale, "fixLabel")}:`, solution);
  }
  return lines.join("\n");
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
    const loc = localizedFinding(f);
    const card = document.createElement("article");
    card.className = `finding sev-${f.severity || "info"}`;
    card.dataset.status = findingFilterStatus(f);
    const head = document.createElement("div");
    head.className = "finding-head";
    const badge = document.createElement("span");
    badge.className = "sev-badge";
    badge.textContent = t(state.locale, sevKey(f.severity));
    const code = document.createElement("span");
    code.className = "finding-id";
    code.textContent = f.id;
    const title = document.createElement("h3");
    title.textContent = loc.title;
    head.append(badge, code, title);
    const isIssue =
      f.severity === "low" ||
      f.severity === "medium" ||
      f.severity === "high" ||
      f.severity === "critical";
    if (loc.detail) {
      const evidence = document.createElement("p");
      evidence.className = "finding-detail";
      if (isIssue) {
        const evLabel = document.createElement("span");
        evLabel.className = "finding-inline-label";
        evLabel.textContent = `${t(state.locale, "evidenceLabel")}: `;
        evidence.append(evLabel, document.createTextNode(loc.detail));
      } else {
        evidence.textContent = loc.detail;
      }
      card.append(evidence);
    }
    if (loc.problem && isIssue) {
      const problem = document.createElement("p");
      problem.className = "finding-problem";
      const problemLabel = document.createElement("span");
      problemLabel.className = "finding-inline-label";
      problemLabel.textContent = `${t(state.locale, "problemLabel")}: `;
      problem.append(problemLabel, document.createTextNode(loc.problem));
      card.append(problem);
    }
    if (loc.why && isIssue) {
      const why = document.createElement("p");
      why.className = "finding-why";
      const whyLabel = document.createElement("span");
      whyLabel.className = "finding-inline-label";
      whyLabel.textContent = `${t(state.locale, "whyLabel")}: `;
      why.append(whyLabel, document.createTextNode(loc.why));
      card.append(why);
    }
    const gradeDelta = gradeDeltaFor(f.severity);
    const hasSpam = typeof f.score === "number" && f.score !== 0;
    if (gradeDelta !== 0 || hasSpam) {
      const metrics = document.createElement("div");
      metrics.className = "finding-metrics";
      if (gradeDelta !== 0) {
        const gd = document.createElement("p");
        gd.className = "finding-grade-delta is-bad";
        gd.textContent = format(t(state.locale, "gradeDeltaLabel"), {
          delta: formatGradeDelta(gradeDelta),
        });
        metrics.append(gd);
      }
      if (hasSpam) {
        const sc = document.createElement("p");
        sc.className = "finding-score";
        if ((f.score as number) > 0) sc.classList.add("is-bad");
        if ((f.score as number) < 0) sc.classList.add("is-good");
        sc.textContent = format(t(state.locale, "spamScoreLabel"), {
          score: formatSpamScore(f.score as number),
        });
        metrics.append(sc);
      }
      card.append(metrics);
    }
    let solution = (loc.fix || solutionForFinding(state.locale, f)).trim();
    const listedZones =
      f.code === "BL1_LISTED" || f.id === "BL1"
        ? state.lastReport?.blacklist?.listed?.length
          ? state.lastReport.blacklist.listed
          : parseListedZonesFromDetail(f.detail || "")
        : [];
    const blIp = state.lastReport?.blacklist?.ip || state.lastReport?.mail?.remoteIp || "";
    if (listedZones.length) {
      solution = formatDelistFix(listedZones, blIp, state.locale);
    }
    if (solution) {
      const fixWrap = document.createElement("div");
      fixWrap.className = "fix-block";
      const fixLabel = document.createElement("p");
      fixLabel.className = "seo-label";
      fixLabel.textContent = t(state.locale, "fixLabel");
      const pre = document.createElement("pre");
      pre.textContent = solution;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.textContent = t(state.locale, "copy");
      const summary = buildFindingSummary(f, { ...loc, fix: solution }, gradeDelta, solution);
      btn.addEventListener("click", () => void copyText(summary));
      fixWrap.append(fixLabel, pre, btn);
      if (listedZones.length) {
        fixWrap.append(renderDelistLinks(listedZones, blIp));
      }
      card.append(fixWrap);
    }
    root.append(card);
  }
  applyFindingsFilter(state.findingsFilter);
}

function renderDelistLinks(zones: string[], ip: string): HTMLElement {
  const wrap = document.createElement("ul");
  wrap.className = "dnsbl-delist-list";
  for (const zone of zones) {
    const info = DNSBL_DELIST[zone];
    const li = document.createElement("li");
    if (!info) {
      li.textContent = zone;
      wrap.append(li);
      continue;
    }
    const a = document.createElement("a");
    a.href = expandDelistUrl(info.url, ip);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = `${info.name} — ${zone}`;
    const note = document.createElement("span");
    note.className = "dnsbl-delist-note";
    note.textContent = ` — ${state.locale === "ru" ? info.noteRu : info.noteEn}`;
    li.append(a, note);
    wrap.append(li);
  }
  return wrap;
}

function showReport(rep: Report): void {
  state.lastReport = rep;
  const results = byId("results");
  results.hidden = false;
  byId("waiting-status").textContent = "";
  byId("waiting-hint").hidden = true;

  const subject = (rep.mail?.subject || "").trim() || "—";
  byId("report-subject").textContent = subject;
  const from = (rep.mail?.from || rep.mail?.mailFrom || "—").trim();
  const to = (rep.mail?.to || byId("address").textContent || "—").trim();
  byId("report-route").textContent = `${from} → ${to}`;

  const share = new URL(window.location.href);
  if (state.inboxId) share.searchParams.set("i", state.inboxId);
  const shareInput = byId<HTMLInputElement>("report-share-url");
  shareInput.value = share.toString();

  renderPillars(rep);

  const badge = byId("grade-badge");
  badge.textContent = rep.grade || "—";
  badge.dataset.grade = rep.grade || "";
  byId("score-verdict").textContent = verdictFor(rep.score ?? 0, rep.grade || "");
  byId("score-line").textContent = format(t(state.locale, "scorePoints"), {
    score: rep.score ?? 0,
  });

  const fill = document.getElementById("score-meter-fill");
  const svg = document.querySelector(".score-meter-svg");
  if (fill instanceof SVGPathElement && svg instanceof SVGSVGElement) {
    ensureScoreGradient(svg);
    const score = Math.max(0, Math.min(100, rep.score ?? 0));
    fill.style.strokeDashoffset = "100";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.strokeDashoffset = String(100 - score);
      });
    });
  }

  const meta = byId("mail-meta");
  const lines = [
    `${t(state.locale, "fromLabel")}: ${rep.mail?.from || "—"}`,
    `${t(state.locale, "subjectLabel")}: ${rep.mail?.subject || "—"}`,
    `${t(state.locale, "ipLabel")}: ${rep.mail?.remoteIp || "—"}`,
  ];
  if (rep.ptr) lines.push(`PTR: ${rep.ptr}`);
  if (rep.mail?.helo) lines.push(`EHLO: ${rep.mail.helo}`);
  meta.textContent = lines.join("\n");

  renderHeaders(rep.headers);

  const findings = rep.findings || [];
  const summary = byId("tests-summary");
  const explain = byId("score-explain");
  const total = rep.testsTotal ?? findings.length;
  const pass = rep.testsPass ?? 0;
  const fail = rep.testsFail ?? 0;
  if (total > 0) {
    summary.hidden = false;
    summary.textContent = format(t(state.locale, "testsSummary"), {
      total,
      pass,
      fail,
    });
    const parts = spamParts(findings);
    const lost = Math.max(0, 100 - (rep.score ?? 0));
    explain.hidden = false;
    explain.textContent = format(t(state.locale, "scoreExplain"), {
      score: rep.score ?? 0,
      lost,
      spam: formatSpamScore(rep.spamScore ?? parts.total),
      spamFail: formatSpamScore(parts.fail),
      spamPass: formatSpamScore(parts.pass),
    });
  } else {
    summary.hidden = true;
    summary.textContent = "";
    explain.hidden = true;
    explain.textContent = "";
  }

  renderFindings(findings);

  results.scrollIntoView({ behavior: "smooth", block: "start" });
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
      byId("waiting-hint").hidden = true;
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
  byId("waiting-hint").hidden = false;
  byId("waiting-hint").textContent = t(state.locale, "waitingHint");
  byId("waiting-status").textContent = t(state.locale, "waiting");
  void pollOnce();
  state.pollTimer = window.setInterval(() => void pollOnce(), 3000);
}

async function createInbox(opts?: { scrollToInbox?: boolean }): Promise<void> {
  setError("");
  stopPoll();
  state.lastReport = null;
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
    if (opts?.scrollToInbox) {
      byId("inbox-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch {
    setError(t(state.locale, "errorNetwork"));
  }
}

async function retestCurrent(): Promise<void> {
  if (!state.inboxId || !state.lastReport) {
    setError(t(state.locale, "retestUnavailable"));
    return;
  }
  const btn = byId<HTMLButtonElement>("retest-btn");
  setError("");
  btn.disabled = true;
  btn.textContent = t(state.locale, "retesting");
  try {
    const res = await fetch(`/api/v1/inbox/${state.inboxId}/retest`, { method: "POST" });
    const data = (await res.json()) as Inbox & { message?: string };
    if (!res.ok) {
      setError(data.message || t(state.locale, "retestUnavailable"));
      return;
    }
    if (data.status === "ready" && data.report) {
      showReport(data.report);
      return;
    }
    setError(t(state.locale, "retestUnavailable"));
  } catch {
    setError(t(state.locale, "errorNetwork"));
  } finally {
    btn.disabled = false;
    btn.textContent = t(state.locale, "retest");
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
      byId("waiting-hint").hidden = true;
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
byId("new-btn").addEventListener("click", () => void createInbox({ scrollToInbox: true }));
byId("retest-btn").addEventListener("click", () => void retestCurrent());
byId("report-share-copy").addEventListener("click", () => {
  const url = byId<HTMLInputElement>("report-share-url").value;
  if (url) void copyText(url, "share");
});
byId("headers-copy").addEventListener("click", () => {
  const text = byId("headers-raw").textContent || "";
  if (text) void copyText(text, "headers");
});
byId("ai-brief-btn").addEventListener("click", () => {
  if (!state.lastReport) return;
  const url = byId<HTMLInputElement>("report-share-url").value || window.location.href;
  downloadAiBrief(state.lastReport, state.locale, url);
});
byId("admin-brief-btn").addEventListener("click", () => {
  if (!state.lastReport) return;
  const url = byId<HTMLInputElement>("report-share-url").value || window.location.href;
  downloadAdminBrief(state.lastReport, state.locale, url);
});
byId("export-pdf-btn").addEventListener("click", () => {
  window.print();
});
byId("findings-filters").querySelectorAll<HTMLElement>("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.filter;
    if (mode === "all" || mode === "fail" || mode === "pass") applyFindingsFilter(mode);
  });
});
void resumeOrCreate();
registerServiceWorker();
