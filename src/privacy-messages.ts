import { localeNames, type Locale } from "./site-config";

export type PrivacyCopy = {
  title: string;
  heading: string;
  lead: string;
  bodyHtml: string;
  home: string;
};

const rows = {
  title: {
    en: "Privacy — supermail",
    ru: "Конфиденциальность — supermail",
  },
  heading: {
    en: "Privacy",
    ru: "Конфиденциальность",
  },
  lead: {
    en: "What we keep when you run a spam test, and for how long.",
    ru: "Что мы храним при спам-тесте и как долго.",
  },
  bodyHtml: {
    en: `<p>supermail creates a one-time inbox so you can send a test message from your mail server.</p>
<ul>
<li>We store the generated report on the server disk (not only in RAM) so a deploy or container restart does not erase a ready share link.</li>
<li>Waiting inboxes expire in about 30 minutes if no mail arrives.</li>
<li>Ready reports stay reachable by share link for about 7 days across restarts, then are removed.</li>
<li>We do not sell message content. Logs may keep connection metadata (IP, time) for abuse control.</li>
<li>DNS lookups (SPF, DKIM, DMARC, MTA-STS, TLS-RPT, BIMI, DNSBL) use public DNS for the domains in the message.</li>
</ul>
<p>Questions: <a href="https://t.me/dmosk">Telegram @dmosk</a>.</p>`,
    ru: `<p>supermail выдаёт одноразовый ящик, чтобы вы отправили тестовое письмо со своего почтового сервера.</p>
<ul>
<li>Готовый отчёт пишется на диск сервера (не только в RAM), поэтому деплой или рестарт контейнера не стирают рабочую ссылку.</li>
<li>Если письмо не пришло, ожидание ящика истекает примерно через 30 минут.</li>
<li>Готовый отчёт по ссылке доступен около 7 дней и переживает перезапуск, затем удаляется.</li>
<li>Мы не продаём содержимое писем. В логах могут остаться метаданные соединения (IP, время) против злоупотреблений.</li>
<li>DNS-запросы (SPF, DKIM, DMARC, MTA-STS, TLS-RPT, BIMI, DNSBL) идут в публичный DNS по доменам из письма.</li>
</ul>
<p>Вопросы: <a href="https://t.me/dmosk">Telegram @dmosk</a>.</p>`,
  },
  home: {
    en: "Back to supermail",
    ru: "На главную supermail",
  },
} as const;

function fill<T extends Record<string, string>>(row: T & { en: string }): Record<Locale, string> {
  return localeNames(row);
}

export const PRIVACY_COPY: Record<Locale, PrivacyCopy> = (() => {
  const title = fill(rows.title);
  const heading = fill(rows.heading);
  const lead = fill(rows.lead);
  const bodyHtml = fill(rows.bodyHtml);
  const home = fill(rows.home);
  const out = {} as Record<Locale, PrivacyCopy>;
  for (const loc of Object.keys(title) as Locale[]) {
    out[loc] = {
      title: title[loc],
      heading: heading[loc],
      lead: lead[loc],
      bodyHtml: bodyHtml[loc],
      home: home[loc],
    };
  }
  return out;
})();
