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
    "title": "supermail — спам-тест письма для почтового сервера",
    "description": "Отправьте письмо на одноразовый адрес и получите разбор: SPF/DKIM/DMARC, DNSBL, PTR, стоп-слова и оценка A–F.",
    "heading": "Спам-тест вашего письма",
    "leadHtml": "Мы выдаём уникальный ящик. Вы отправляете письмо со своего SMTP — и видите, почему оно может уйти в спам.",
    "benefitsTitle": "Что проверяем",
    "benefits": [
      "Реальное письмо, не только DNS-форма",
      "SPF / DKIM / DMARC по домену From",
      "DNSBL и PTR IP отправителя",
      "Тема и тело: стоп-слова, CAPS, сокращённые URL",
      "Оценка A–F и копируемые фиксы"
    ],
    "howTitle": "Как пользоваться",
    "howSteps": [
      "Скопируйте тестовый адрес на странице",
      "Отправьте на него письмо со своего сервера или ящика",
      "Подождите 10–60 секунд — вкладку не закрывайте",
      "Разберите findings и поправьте DNS/контент"
    ],
    "strongTitle": "Советы по доставке",
    "strongLead": "Фильтры смотрят и на инфраструктуру, и на текст. Исправляйте auth и контент вместе.",
    "tipsLabel": "Практика",
    "strongTips": [
      "Подписывайте DKIM тем же доменом, что в From",
      "Не используйте +all в SPF",
      "PTR SMTP должен совпадать с EHLO",
      "Избегайте публичных коротких ссылок",
      "Добавьте текстовую часть, не только картинку"
    ],
    "usesTitle": "Когда это нужно",
    "uses": [
      "Перед массовой рассылкой",
      "После смены ESP или своего Postfix/Exim",
      "Когда Gmail/Mail.ru кладут письма в спам",
      "Проверка репутации IP отправителя"
    ],
    "faqTitle": "Вопросы и ответы",
    "faq": [
      {
        "q": "Куда слать письмо?",
        "a": "На уникальный адрес вида …@inbox.supermail.dmosk.net, который показывает страница."
      },
      {
        "q": "Сколько живёт ящик?",
        "a": "Около 30 минут. После истечения создайте новый адрес."
      },
      {
        "q": "Читаете ли вы чужие письма?",
        "a": "Только то, что вы сами отправили на тестовый адрес. Тела дольше сессии не храним."
      },
      {
        "q": "Это замена mail-tester?",
        "a": "По сценарию — да: ящик → письмо → отчёт. Набор тестов и формулировки — наши."
      },
      {
        "q": "Платно?",
        "a": "Нет, сервис бесплатный."
      },
      {
        "q": "Как считается оценка?",
        "a": "Со 100 баллов снимаем critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  en: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  zh: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  es: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  hi: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ar: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  bn: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  pt: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  fr: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  de: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ja: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  id: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  pa: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  jv: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  te: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  tr: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ko: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  mr: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  vi: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  ta: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  it: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  fa: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
  tlh: {
    "title": "supermail — email spam test for your mail server",
    "description": "Send a message to a one-time address and get SPF/DKIM/DMARC, DNSBL, PTR, spam-word checks and an A–F grade.",
    "heading": "Spam-test your email",
    "leadHtml": "We give you a unique inbox. Send from your SMTP and see why the message may land in spam.",
    "benefitsTitle": "What we check",
    "benefits": [
      "A real message, not just a DNS form",
      "SPF / DKIM / DMARC for the From domain",
      "DNSBL and PTR of the sending IP",
      "Subject/body: spam words, CAPS, short URLs",
      "A–F grade with copy-paste fixes"
    ],
    "howTitle": "How to use",
    "howSteps": [
      "Copy the test address on the page",
      "Send a message to it from your server or mailbox",
      "Wait 10–60 seconds — keep the tab open",
      "Read findings and fix DNS/content"
    ],
    "strongTitle": "Deliverability tips",
    "strongLead": "Filters look at both infrastructure and wording. Fix auth and content together.",
    "tipsLabel": "Practice",
    "strongTips": [
      "Sign DKIM with the same domain as From",
      "Never use +all in SPF",
      "SMTP PTR should match EHLO",
      "Avoid public URL shorteners",
      "Include a text part, not only an image"
    ],
    "usesTitle": "When you need it",
    "uses": [
      "Before a bulk campaign",
      "After changing ESP or your Postfix/Exim",
      "When Gmail/Mail.ru file mail as spam",
      "Checking sending-IP reputation"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "q": "Where do I send mail?",
        "a": "To the unique …@inbox.supermail.dmosk.net address shown on the page."
      },
      {
        "q": "How long does the inbox live?",
        "a": "About 30 minutes. Create a new address when it expires."
      },
      {
        "q": "Do you read other people’s mail?",
        "a": "Only what you send to the test address. Bodies are not kept past the session."
      },
      {
        "q": "Is this a mail-tester clone?",
        "a": "Same flow: inbox → message → report. The checks and wording are ours."
      },
      {
        "q": "Is it free?",
        "a": "Yes."
      },
      {
        "q": "How is the grade calculated?",
        "a": "We start at 100 and subtract for critical/high/medium/low findings."
      }
    ],
    "appName": "supermail"
  },
};
