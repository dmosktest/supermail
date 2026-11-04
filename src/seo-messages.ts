import type { Locale } from "./site-config";

export type SeoCopy = {
  title: string;
  description: string;
  heading: string;
  leadHtml: string;
  benefitsTitle: string;
  benefits: string[];
  howTitle: string;
  howSteps: string[];
  strongTitle: string;
  strongLead: string;
  tipsLabel: string;
  strongTips: string[];
  usesTitle: string;
  uses: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  appName: string;
};

export const SEO_COPY: Record<Locale, SeoCopy> = {
  ru: {
    "title": "supermail — спам-тест письма: DKIM, SPF по IP, DMARC, DNS-мастер",
    "description": "Одноразовый ящик и реальное письмо с вашего SMTP. Оценка A–F: крипто-DKIM, SPF по IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS-мастер, JSON/PDF, ТЗ для ИИ. Бесплатно.",
    "heading": "Спам-тест вашего исходящего письма",
    "leadHtml": "Выдаём уникальный адрес @supermail.dmosk.net. Вы шлёте письмо со своего SMTP — получаете оценку A–F, криптопроверку DKIM, SPF по IP соединения, DMARC alignment, DNS-мастер с черновиками TXT, экспорт JSON и Печать/PDF, исходные заголовки и два Markdown-ТЗ: для ИИ и для админа почты. Ссылка на отчёт живёт около 7 дней.",
    "benefitsTitle": "Что умеет supermail",
    "benefits": [
      "Реальное письмо по SMTP, не «форма только DNS»",
      "Криптопроверка DKIM и публикация ключа в DNS",
      "SPF-запись и оценка SPF по IP отправителя",
      "DMARC: политика, rua/ruf, alignment со From",
      "MTA-STS, TLS-RPT и BIMI в DNS (по желанию домена)",
      "DNSBL, PTR↔HELO, A у HELO, контент и MIME",
      "DNS-мастер: готовые черновики TXT для домена From",
      "Экспорт отчёта: JSON и Печать/PDF; ТЗ для ИИ и админа",
      "Фильтр разбора (Все / Ошибки / Пройдено), 23 языка UI"
    ],
    "howTitle": "Как пользоваться",
    "howSteps": [
      "Скопируйте тестовый адрес (ссылку с ?i=… можно сохранить или переслать)",
      "Отправьте письмо со своего сервера, ESP или обычного ящика",
      "Подождите 10–60 секунд — вкладку не закрывайте",
      "Смотрите оценку, фильтр разбора, DNS-мастер и заголовки",
      "Скачайте JSON, распечатайте в PDF, возьмите ТЗ для ИИ или админа"
    ],
    "strongTitle": "Советы по доставке",
    "strongLead": "Фильтры смотрят на DNS, имя сервера и текст. Закройте auth (SPF/DKIM/DMARC alignment) и контент вместе — одной TXT-записи мало.",
    "tipsLabel": "Практика",
    "strongTips": [
      "DKIM тем же доменом, что в From; подпись должна проходить криптопроверку",
      "В SPF не ставьте +all; IP отправки должен попадать в pass",
      "DMARC: p=none + rua, затем quarantine → reject; следите за alignment",
      "PTR IP должен совпадать с HELO/EHLO, у HELO — рабочий A",
      "По желанию: MTA-STS и TLS-RPT; BIMI — после жёсткого DMARC",
      "Черновики TXT берите из DNS-мастера и подставляйте свои selector/ключи"
    ],
    "usesTitle": "Когда это нужно",
    "uses": [
      "Перед массовой рассылкой или запуском транзакционных писем",
      "После смены ESP, Postfix/Exim или IP отправки",
      "Когда Gmail, Mail.ru или Outlook кладут письма в спам",
      "Проверка SPF/DKIM/DMARC alignment и репутации IP (DNSBL)",
      "Собрать DNS-записи и отдать админу или ИИ готовое ТЗ"
    ],
    "faqTitle": "Вопросы и ответы",
    "faq": [
      {
        "q": "Куда слать письмо?",
        "a": "На уникальный адрес …@supermail.dmosk.net на странице. Можно отправить с вашего SMTP, ESP или обычного ящика."
      },
      {
        "q": "Что именно проверяете?",
        "a": "Криптопроверку DKIM, SPF-запись и SPF по IP соединения, DMARC (политика, rua/ruf, alignment с From), DNS-ключ DKIM, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO и A у HELO, контент и MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC и др. В отчёте — оценка A–F, спам-балл, DNS-мастер, заголовки, JSON и Печать/PDF."
      },
      {
        "q": "Как считается оценка?",
        "a": "Оценка из 100 и спам-балл — разные шкалы. Оценка: старт 100, за замечание снимаем по серьёзности (critical −35, high −20, medium −10, low −5). Спам-балл эвристик — сумма мелких вкладов по проверкам; он не обязан совпадать с «сколько сняли из 100»."
      },
      {
        "q": "Проверяете ли криптографию DKIM и SPF по IP?",
        "a": "Да. Подпись DKIM проверяем криптографически; SPF оцениваем по IP соединения и домену MAIL FROM / From. Плюс смотрим публикацию ключа DKIM и alignment DMARC."
      },
      {
        "q": "Что такое DNS-мастер?",
        "a": "В отчёте — черновики TXT (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) для домена From. Скопируйте запись и подставьте свои selector, ключи и include перед публикацией в DNS."
      },
      {
        "q": "Как скачать отчёт?",
        "a": "Кнопки «Скачать JSON» и «Печать / PDF» в отчёте. Также два Markdown-ТЗ: для ИИ-агента (без повторных сетевых сканов) и понятный чеклист для админа почты."
      },
      {
        "q": "Сколько живёт ящик и ссылка на отчёт?",
        "a": "Ожидание письма — около 30 минут. Готовый отчёт по ссылке с ?i=… доступен около 7 дней, затем удаляется. Подробности — на странице «Конфиденциальность»."
      },
      {
        "q": "Есть публичный API?",
        "a": "Да: POST /api/v1/inbox и GET /api/v1/inbox/{id}. Контракт описан в README на GitHub и в документации сервиса."
      },
      {
        "q": "На каких языках интерфейс?",
        "a": "23 локали. Тексты проверок переводятся по коду; Markdown-ТЗ — на русском или английском в зависимости от языка страницы."
      },
      {
        "q": "Это клон mail-tester?",
        "a": "Сценарий тот же: ящик → письмо → отчёт. Набор проверок, формулировки, DNS-мастер, экспорт и два ТЗ — наши; полного SpamAssassin внутри нет."
      },
      {
        "q": "Платно?",
        "a": "Нет, сервис бесплатный."
      }
    ],
    "appName": "supermail"
  },
  en: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  zh: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  es: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  hi: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  ar: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  bn: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  pt: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  fr: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  de: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  ja: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  id: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  pa: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  jv: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  te: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  tr: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  ko: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  mr: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  vi: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  ta: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  it: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  fa: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
  tlh: {
    "title": "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC, DNS wizard",
    "description": "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, DNS wizard, JSON/PDF, AI briefs. Free.",
    "heading": "Spam-test your outbound email",
    "leadHtml": "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, a DNS wizard with TXT drafts, JSON and Print/PDF export, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    "benefitsTitle": "What supermail covers",
    "benefits": [
      "A real SMTP message, not a DNS-only form",
      "Cryptographic DKIM verify plus DNS key publication",
      "SPF record and SPF evaluation against the sending IP",
      "DMARC policy, rua/ruf, and alignment with From",
      "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
      "DNSBL, PTR↔HELO, HELO A, content and MIME",
      "DNS wizard: ready TXT drafts for the From domain",
      "Export: JSON and Print/PDF; AI and mail-admin briefs",
      "Findings filter (All / Errors / Passed), 23 UI languages"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address (you can keep or share the ?i=… link)",
      "Send a message from your server, ESP or normal mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read the grade, findings filter, DNS wizard and headers",
      "Download JSON, print to PDF, or take the AI / admin brief"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From; the signature must crypto-verify",
      "Never use +all in SPF; the sending IP should evaluate to pass",
      "DMARC: p=none + rua, then quarantine → reject; watch alignment",
      "IP PTR should match HELO/EHLO; HELO needs a working A record",
      "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
      "Copy TXT drafts from the DNS wizard and fill in your selector/keys"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign or transactional mail launch",
      "After changing ESP, Postfix/Exim or the sending IP",
      "When Gmail, Mail.ru or Outlook file mail as spam",
      "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
      "Gather DNS records and hand an admin or AI a ready brief"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox."
      },
      {
        "q": "What exactly do you check?",
        "a": "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, DNS wizard, headers, JSON and Print/PDF."
      },
      {
        "q": "How is the grade calculated?",
        "a": "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −35, high −20, medium −10, low −5). Spam score sums small per-check weights; it does not have to match points taken from 100."
      },
      {
        "q": "Do you verify DKIM crypto and SPF against the IP?",
        "a": "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment."
      },
      {
        "q": "What is the DNS wizard?",
        "a": "The report includes TXT drafts (SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI) for the From domain. Copy them and fill in your selector, keys and includes before publishing DNS."
      },
      {
        "q": "How do I export the report?",
        "a": "Use Download JSON and Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist."
      },
      {
        "q": "How long do the inbox and report link live?",
        "a": "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details."
      },
      {
        "q": "Is there a public API?",
        "a": "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs."
      },
      {
        "q": "Which languages are supported?",
        "a": "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks, wording, DNS wizard, export and two briefs are ours; we do not ship full SpamAssassin."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      }
    ],
    "appName": "supermail"
  },
};
