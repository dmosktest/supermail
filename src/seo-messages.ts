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
    "title": "supermail — проверка MX, SPF, DKIM, DMARC и DNSBL",
    "description": "Проверьте почтовый домен: MX, SPF/DKIM/DMARC/BIMI, чёрные списки DNSBL, PTR и SMTP STARTTLS. Оценка A–F и копируемые фиксы.",
    "heading": "Проверка почтового сервера",
    "leadHtml": "Введите домен — получите разбор DNS-авторизации, репутации IP и лёгкий SMTP-probe. Без регистрации.",
    "benefitsTitle": "Зачем это нужно",
    "benefits": [
      "Оценка A–F и числовой балл",
      "MX, SPF, DKIM, DMARC и BIMI в одном отчёте",
      "DNSBL и PTR по IP SMTP",
      "Стартовые TXT для SPF и DMARC",
      "Понятные findings с фиксами"
    ],
    "howTitle": "Как проверить",
    "howSteps": [
      "Укажите домен отправителя",
      "При необходимости — селектор DKIM и IP SMTP",
      "Нажмите «Проверить»",
      "Скопируйте фиксы или стартовые записи"
    ],
    "strongTitle": "Советы по доставке",
    "strongLead": "SPF, DKIM и DMARC работают вместе: выравнивание From и корректный PTR сильно влияют на inbox.",
    "tipsLabel": "Практика",
    "strongTips": [
      "Один SPF на домен и не больше 10 DNS-lookup",
      "Начните DMARC с p=none, затем quarantine/reject",
      "Селектор DKIM должен совпадать с тем, что ставит MTA",
      "PTR SMTP-хоста должен совпадать с EHLO",
      "Не используйте +all в SPF"
    ],
    "usesTitle": "Типичные задачи",
    "uses": [
      "Перед запуском корпоративной почты",
      "После смены провайдера рассылок",
      "Когда письма уходят в спам",
      "Аудит DNSBL для IP SMTP"
    ],
    "faqTitle": "Вопросы и ответы",
    "faq": [
      {
        "q": "Это mail-tester?",
        "a": "Режим A проверяет DNS/SMTP без письма. Тест исходящего письма (одноразовый ящик) планируется отдельно."
      },
      {
        "q": "Нужен ли селектор DKIM?",
        "a": "Да, если ключ не на default._domainkey. Укажите тот же селектор, что в подписи."
      },
      {
        "q": "Зачем IP?",
        "a": "Если MX указывает не на ваш исходящий SMTP, задайте IP отправителя для DNSBL и PTR."
      },
      {
        "q": "Храните ли вы домены?",
        "a": "Проверка выполняется на лету; отдельной истории аккаунтов нет."
      },
      {
        "q": "Платно ли это?",
        "a": "Нет, сервис бесплатный."
      },
      {
        "q": "Как считается оценка?",
        "a": "Стартуем со 100 и снимаем баллы за critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  en: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  zh: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  es: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  hi: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ar: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  bn: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  pt: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  fr: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  de: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ja: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  id: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  pa: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  jv: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  te: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  tr: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ko: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  mr: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  vi: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ta: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  it: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  fa: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  tlh: {
    "title": "supermail — check MX, SPF, DKIM, DMARC and DNSBL",
    "description": "Check a mail domain: MX, SPF/DKIM/DMARC/BIMI, DNSBL lists, PTR and SMTP STARTTLS. Grade A–F with copy-paste fixes.",
    "heading": "Mail server check",
    "leadHtml": "Enter a domain for DNS authentication, IP reputation and a light SMTP probe. No signup.",
    "benefitsTitle": "Why use it",
    "benefits": [
      "A–F grade and numeric score",
      "MX, SPF, DKIM, DMARC and BIMI in one report",
      "DNSBL and PTR for the SMTP IP",
      "Starter SPF and DMARC TXT",
      "Plain-language findings with fixes"
    ],
    "howTitle": "How to check",
    "howSteps": [
      "Enter the sending domain",
      "Optionally add a DKIM selector and SMTP IP",
      "Press Check",
      "Copy fixes or starter records"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "SPF, DKIM and DMARC work together; From alignment and a correct PTR strongly affect inbox placement.",
    "tipsLabel": "Practice",
    "strongTips": [
      "One SPF per domain and at most 10 DNS lookups",
      "Start DMARC at p=none, then quarantine/reject",
      "DKIM selector must match what your MTA signs",
      "SMTP PTR should match EHLO",
      "Never use +all in SPF"
    ],
    "usesTitle": "Typical uses",
    "uses": [
      "Before launching corporate mail",
      "After changing an ESP",
      "When mail lands in spam",
      "DNSBL audit for an SMTP IP"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Is this mail-tester?",
        "a": "Mode A checks DNS/SMTP without receiving mail. An outbound spam-score inbox is planned separately."
      },
      {
        "q": "Do I need a DKIM selector?",
        "a": "Yes if the key is not at default._domainkey. Use the same selector your MTA signs with."
      },
      {
        "q": "Why an IP?",
        "a": "If MX is not your outbound SMTP, set the sending IP for DNSBL and PTR checks."
      },
      {
        "q": "Do you store domains?",
        "a": "Checks run on the fly; there is no account history."
      },
      {
        "q": "Is it free?",
        "a": "Yes, the service is free."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
};
