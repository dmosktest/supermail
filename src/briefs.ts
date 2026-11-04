import { findingCopy } from "./findings-messages";
import type { Locale } from "./site-config";

export type BriefFinding = {
  id: string;
  code?: string;
  severity: string;
  title: string;
  detail: string;
  fix?: string;
  score?: number;
};

export type BriefReport = {
  grade: string;
  score: number;
  spamScore?: number;
  testsTotal?: number;
  testsPass?: number;
  testsFail?: number;
  mail?: {
    from?: string;
    to?: string;
    subject?: string;
    remoteIp?: string;
    helo?: string;
    mailFrom?: string;
  };
  findings: BriefFinding[];
  ptr?: string;
  blacklist?: { ip: string; listed: string[]; checked: number };
};

function isRu(locale: Locale): boolean {
  return locale === "ru";
}

function isProblem(f: BriefFinding): boolean {
  if (typeof f.score === "number" && f.score > 0) return true;
  const sev = (f.severity || "").toLowerCase();
  return sev === "low" || sev === "medium" || sev === "high" || sev === "critical";
}

function localizedParts(
  locale: Locale,
  f: BriefFinding,
): { title: string; detail: string; why: string; fix: string } {
  const copy = findingCopy(locale, f.code || "");
  const title = copy?.title || f.title;
  let detail = copy?.detail ?? "{detail}";
  if (detail.includes("{detail}")) {
    detail = detail.replaceAll("{detail}", f.detail || "").trim() || f.detail || "";
  }
  const why = (copy?.why || "").trim();
  const sev = (f.severity || "").toLowerCase();
  let fix = (copy?.fix || f.fix || "").trim();
  if (!fix) {
    if (sev === "info") {
      fix = isRu(locale)
        ? "Это заметка, не обязательно ошибка с вашей стороны — менять настройки не требуется, если вы не настраиваете свой домен."
        : "This is a note, not necessarily your fault — no change needed unless you manage this domain’s mail.";
    } else if (isProblem(f)) {
      fix = isRu(locale)
        ? `Разберите «${title}»: проверьте DNS (SPF/DKIM/DMARC/PTR), HELO и содержимое письма на своём домене/сервере.`
        : `Review “${title}”: check DNS (SPF/DKIM/DMARC/PTR), HELO and content on your own domain/server.`;
    } else {
      fix = isRu(locale)
        ? "Менять ничего не нужно — проверка пройдена."
        : "No change needed — this check passed.";
    }
  }
  return { title, detail, why, fix };
}

function gradeHint(locale: Locale, grade: string): string {
  const g = (grade || "").toUpperCase();
  if (isRu(locale)) {
    if (g === "A") return "отлично";
    if (g === "B") return "хорошо";
    if (g === "C") return "средне";
    if (g === "D") return "слабо";
    if (g === "F") return "плохо";
    return "—";
  }
  if (g === "A") return "excellent";
  if (g === "B") return "good";
  if (g === "C") return "fair";
  if (g === "D") return "poor";
  if (g === "F") return "failing";
  return "—";
}

function spamStr(n: number | undefined): string {
  if (typeof n !== "number") return "—";
  const r = Math.round(n * 100) / 100;
  return r > 0 ? `+${r}` : String(r);
}

function downloadMarkdown(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function safeName(s: string): string {
  return (s || "mail").replace(/[^\w.-]+/g, "_").slice(0, 48) || "mail";
}

export function buildAiBrief(rep: BriefReport, locale: Locale, reportUrl: string): string {
  const problems = (rep.findings || []).filter(isProblem);
  const top = problems
    .slice()
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5)
    .map((f) => {
      const p = localizedParts(locale, f);
      return `- ${p.title} [\`${f.code || f.id}\`] · ${f.severity}${typeof f.score === "number" ? ` · score ${spamStr(f.score)}` : ""}`;
    })
    .join("\n");

  const blocks = problems
    .map((f, i) => {
      const p = localizedParts(locale, f);
      return [
        `## ${i + 1}. ${p.title} [\`${f.code || f.id}\`]`,
        `- Severity: ${f.severity}`,
        typeof f.score === "number" ? `- Spam score delta: ${spamStr(f.score)}` : "",
        p.detail ? `- Evidence: ${p.detail}` : "",
        p.why ? `- Why it matters for spam: ${p.why}` : "",
        ``,
        `### Fix`,
        p.fix,
      ]
        .filter((line) => line !== "")
        .join("\n");
    })
    .join("\n\n");

  const from = rep.mail?.from || rep.mail?.mailFrom || "—";
  const subject = rep.mail?.subject || "—";
  const ip = rep.mail?.remoteIp || "—";

  if (isRu(locale)) {
    return [
      `# ТЗ для ИИ: улучшить доставляемость письма (supermail)`,
      ``,
      `Ты — опытный почтовый / DevOps-инженер. Ниже уже готовый отчёт supermail по тестовому письму. Твоя задача — только текст: план правок DNS и почтового сервера (Postfix/Exim/ESP) для человека, который применит их сам.`,
      ``,
      `## Жёсткие ограничения`,
      `- Не сканируй домены, не ходи в сеть (dig/curl/nmap и т.п.) от своего имени — данные уже в отчёте.`,
      `- Не предлагай «сейчас прогнать» mail-tester / supermail / SpamAssassin — отчёт уже есть.`,
      `- Не обещай «гарантированный inbox». Не предлагай атаки и спам-техники.`,
      `- Не правь чужие аккаунты freemail (mail.ru/gmail…) как «свой домен» — если From freemail, скажи это прямо.`,
      ``,
      `## Контекст`,
      `- Тема: ${subject}`,
      `- From: ${from}`,
      `- IP отправителя: ${ip}`,
      `- HELO: ${rep.mail?.helo || "—"}`,
      `- PTR: ${rep.ptr || "—"}`,
      `- Оценка: ${rep.grade || "—"} (${rep.score ?? "—"} / 100), ${gradeHint(locale, rep.grade)}`,
      `- Спам-балл эвристик: ${spamStr(rep.spamScore)}`,
      `- Проверок: ${rep.testsTotal ?? "—"} (ок ${rep.testsPass ?? "—"} / замечаний ${rep.testsFail ?? "—"})`,
      `- DNSBL: ${(rep.blacklist?.listed || []).join(", ") || "чисто"}`,
      `- Готовый отчёт: ${reportUrl}`,
      ``,
      `## Приоритет (сначала это)`,
      top || "- (критичных замечаний нет)",
      ``,
      `## Задача`,
      `1. Разбери каждую проблему ниже и предложи конкретный план: DNS (SPF/DKIM/DMARC/PTR/MX), HELO, контент письма.`,
      `2. Дай готовые примеры записей/директив под типичный стек (Postfix/Exim/облачный ESP). Не сыпь всеми вариантами — выбери релевантные.`,
      `3. Укажи порядок внедрения и риски (например p=reject до стабильного DKIM).`,
      `4. Если данных мало — задай короткие вопросы, затем всё равно предложи безопасный дефолт.`,
      ``,
      `## Проблемы (${problems.length})`,
      blocks || "_Замечаний со штрафом нет._",
      ``,
      `## Формат ответа`,
      `- Краткий план работ (только правки, без повторных сканов)`,
      `- По каждой проблеме: что изменить и пример записи/настройки`,
      `- В конце — короткий чеклист для человека после выката`,
      ``,
    ].join("\n");
  }

  return [
    `# AI brief: improve email deliverability (supermail)`,
    ``,
    `You are an experienced mail / DevOps engineer. The supermail report below is already complete. Your job is text only: a remediation plan for DNS and the mail stack (Postfix/Exim/ESP) for a human who will apply the changes.`,
    ``,
    `## Hard constraints`,
    `- Do not scan domains or run dig/curl/nmap yourself — the report already has the data.`,
    `- Do not offer to re-run mail-tester / supermail / SpamAssassin — the report is here.`,
    `- Do not promise inbox placement. Do not suggest attacks or spam tricks.`,
    `- Do not treat freemail accounts (mail.ru/gmail…) as “your domain” — say so plainly if From is freemail.`,
    ``,
    `## Context`,
    `- Subject: ${subject}`,
    `- From: ${from}`,
    `- Sending IP: ${ip}`,
    `- HELO: ${rep.mail?.helo || "—"}`,
    `- PTR: ${rep.ptr || "—"}`,
    `- Grade: ${rep.grade || "—"} (${rep.score ?? "—"} / 100), ${gradeHint(locale, rep.grade)}`,
    `- Heuristic spam score: ${spamStr(rep.spamScore)}`,
    `- Checks: ${rep.testsTotal ?? "—"} (pass ${rep.testsPass ?? "—"} / issues ${rep.testsFail ?? "—"})`,
    `- DNSBL: ${(rep.blacklist?.listed || []).join(", ") || "clean"}`,
    `- Ready report: ${reportUrl}`,
    ``,
    `## Priority (do these first)`,
    top || "- (no scored issues)",
    ``,
    `## Task`,
    `1. For each issue, propose a concrete plan: DNS (SPF/DKIM/DMARC/PTR/MX), HELO, message content.`,
    `2. Provide ready examples for a typical stack (Postfix/Exim/cloud ESP) — pick what fits.`,
    `3. Include rollout order and risks (e.g. p=reject before stable DKIM).`,
    `4. If context is missing, ask short questions, then still propose a safe default.`,
    ``,
    `## Issues (${problems.length})`,
    blocks || "_No scored issues._",
    ``,
    `## Response format`,
    `- Short work plan (edits only, no rescans)`,
    `- Per issue: what to change and a sample record/setting`,
    `- End with a short post-deploy checklist for the human`,
    ``,
  ].join("\n");
}

export function buildAdminBrief(rep: BriefReport, locale: Locale, reportUrl: string): string {
  const problems = (rep.findings || []).filter(isProblem);
  const from = rep.mail?.from || rep.mail?.mailFrom || "—";
  const subject = rep.mail?.subject || "—";
  const ip = rep.mail?.remoteIp || "—";

  const items = problems
    .map((f, i) => {
      const p = localizedParts(locale, f);
      if (isRu(locale)) {
        return [
          `### ${i + 1}. ${p.title}`,
          ``,
          `**Что увидели:** ${p.detail || "см. заголовок проверки"}`,
          ``,
          `**Почему это важно для спама:** ${p.why || "фильтры учитывают такой сигнал при оценке письма"}`,
          ``,
          `**Что сделать простыми словами:** ${p.fix}`,
          ``,
        ].join("\n");
      }
      return [
        `### ${i + 1}. ${p.title}`,
        ``,
        `**Evidence:** ${p.detail || "see the check title"}`,
        ``,
        `**Why it matters for spam:** ${p.why || "filters use this signal when scoring mail"}`,
        ``,
        `**What to do in plain words:** ${p.fix}`,
        ``,
      ].join("\n");
    })
    .join("\n");

  if (isRu(locale)) {
    return [
      `# Задание для администратора почты`,
      ``,
      `Это не «страшилка для хакеров», а обычный чеклист: что поправить, чтобы письма реже падали в спам.`,
      ``,
      `## Кратко по отчёту`,
      `- Оценка письма: **${rep.grade || "—"}** (${rep.score ?? "—"} из 100) — ${gradeHint(locale, rep.grade)}`,
      `- Тема тестового письма: ${subject}`,
      `- От кого: ${from}`,
      `- IP, с которого пришло: ${ip}`,
      `- Имя сервера в HELO/EHLO: ${rep.mail?.helo || "не указано"}`,
      `- Обратный DNS (PTR): ${rep.ptr || "нет"}`,
      `- Чёрные списки: ${(rep.blacklist?.listed || []).length ? rep.blacklist!.listed.join(", ") : "IP в проверенных списках не найден"}`,
      `- Ссылка на отчёт: ${reportUrl}`,
      ``,
      `## С чего начать (если мало времени)`,
      `1. Проверьте, что у домена отправителя есть SPF, DKIM и DMARC (это записи в DNS).`,
      `2. Убедитесь, что PTR у IP совпадает с именем, которым представляется почтовый сервер (HELO).`,
      `3. Не шлите массовые письма с freemail (mail.ru / gmail и т.п.) «от имени компании» — лучше свой домен.`,
      `4. В письме избегайте коротких ссылок bit.ly и HTML со script/iframe.`,
      ``,
      `## Что поправить по пунктам`,
      items || "_Серьёзных замечаний нет — можно только перепроверить SPF/DKIM/DMARC на всякий случай._",
      ``,
      `## Как понять, что получилось`,
      `- Отправьте ещё одно тестовое письмо на новый адрес supermail и сравните оценку.`,
      `- Если SPF/DKIM/DMARC зелёные, PTR совпадает с HELO, а в DNSBL пусто — базовый минимум закрыт.`,
      ``,
      `## Если что-то непонятно`,
      `Покажите это задание коллеге или хостеру и попросите: «настройте SPF, DKIM, DMARC и PTR под наш SMTP». Этого обычно достаточно, чтобы вас поняли.`,
      ``,
    ].join("\n");
  }

  return [
    `# Task sheet for the mail administrator`,
    ``,
    `This is a plain checklist — what to fix so messages land in spam less often.`,
    ``,
    `## Report summary`,
    `- Grade: **${rep.grade || "—"}** (${rep.score ?? "—"} / 100) — ${gradeHint(locale, rep.grade)}`,
    `- Subject: ${subject}`,
    `- From: ${from}`,
    `- Sending IP: ${ip}`,
    `- HELO/EHLO: ${rep.mail?.helo || "not set"}`,
    `- PTR: ${rep.ptr || "none"}`,
    `- Blocklists: ${(rep.blacklist?.listed || []).length ? rep.blacklist!.listed.join(", ") : "not listed on checked lists"}`,
    `- Report link: ${reportUrl}`,
    ``,
    `## Start here (if short on time)`,
    `1. Make sure the From domain has SPF, DKIM and DMARC DNS records.`,
    `2. Make sure the IP PTR matches the SMTP HELO name.`,
    `3. Do not send company mail from freemail (gmail/mail.ru…) — use your own domain.`,
    `4. Avoid public URL shorteners and HTML with script/iframe.`,
    ``,
    `## Fixes item by item`,
    items || "_No major issues — optionally double-check SPF/DKIM/DMARC._",
    ``,
    `## How to verify`,
    `- Send another test message to a fresh supermail address and compare the grade.`,
    `- If SPF/DKIM/DMARC look good, PTR matches HELO, and DNSBL is clean — the baseline is covered.`,
    ``,
    `## If this is unclear`,
    `Show this sheet to a colleague or hosting support and ask: “please set SPF, DKIM, DMARC and PTR for our SMTP”. That is usually enough.`,
    ``,
  ].join("\n");
}

export function downloadAiBrief(rep: BriefReport, locale: Locale, reportUrl: string): void {
  const text = buildAiBrief(rep, locale, reportUrl);
  const tag = safeName(rep.mail?.from || rep.mail?.mailFrom || "mail");
  downloadMarkdown(`supermail-${tag}-ai-brief.md`, text);
}

export function downloadAdminBrief(rep: BriefReport, locale: Locale, reportUrl: string): void {
  const text = buildAdminBrief(rep, locale, reportUrl);
  const tag = safeName(rep.mail?.from || rep.mail?.mailFrom || "mail");
  downloadMarkdown(`supermail-${tag}-admin-checklist.md`, text);
}

export function solutionForFinding(locale: Locale, f: BriefFinding): string {
  return localizedParts(locale, f).fix;
}

export { isProblem as isProblemFinding };
