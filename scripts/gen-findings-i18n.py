# -*- coding: utf-8 -*-
"""Generate src/findings-messages.ts from analyze.go codes + en/ru COPY + locale extras."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ANALYZE_DIR = ROOT / "backend/internal/analyze"
OUT = ROOT / "src/findings-messages.ts"
LOCALES = [
    "ru", "en", "zh", "es", "hi", "ar", "bn", "pt", "fr", "de", "ja", "id",
    "pa", "jv", "te", "tr", "ko", "mr", "vi", "ta", "it", "fa", "tlh",
]

sys.path.insert(0, str(Path(__file__).resolve().parent))
from findings_locale_extra import OTHER_LOCALES, TR_LISTS  # noqa: E402
from findings_problem import PROBLEM  # noqa: E402
from findings_why import WHY  # noqa: E402

# code -> {title_en, title_ru, detail_en, detail_ru, fix_en?, fix_ru?}
# detail may include {detail} for API payload
COPY: dict[str, dict[str, str]] = {
    "PARSE1": {
        "title_en": "Could not parse message",
        "title_ru": "Не удалось разобрать письмо",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SUB1_EMPTY": {
        "title_en": "Empty subject",
        "title_ru": "Пустая тема",
        "detail_en": "Empty subjects often look suspicious.",
        "detail_ru": "Пустая тема часто выглядит подозрительно.",
    },
    "SUB2_CAPS": {
        "title_en": "Subject mostly UPPERCASE",
        "title_ru": "Тема почти полностью ЗАГЛАВНЫМИ",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Use normal sentence case in the subject.",
        "fix_ru": "Пишите тему обычным регистром, как предложение.",
    },
    "SUB2_OK": {
        "title_en": "Subject casing looks fine",
        "title_ru": "Регистр темы в порядке",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SUB3_MANY": {
        "title_en": "Many punctuation marks in subject",
        "title_ru": "Много знаков препинания в теме",
        "detail_en": "{detail} of !/? in the subject",
        "detail_ru": "В теме {detail} знаков !/?",
    },
    "SUB3_OK": {
        "title_en": "Subject punctuation looks fine",
        "title_ru": "Знаки препинания в теме в порядке",
        "detail_en": "{detail} of !/?",
        "detail_ru": "{detail} знаков !/?",
    },
    "SUB4_SPAM": {
        "title_en": "Spam-like words in subject",
        "title_ru": "Спам-слова в теме",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Avoid hard-sell spam vocabulary in the subject line.",
        "fix_ru": "Избегайте агрессивной «рекламной» лексики в теме.",
    },
    "SUB4_OK": {
        "title_en": "No spam-like words in subject",
        "title_ru": "В теме нет явных спам-слов",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "CNT1_IMAGE": {
        "title_en": "Mostly image / little text",
        "title_ru": "Почти только картинка, мало текста",
        "detail_en": "HTML with almost no text body is a common spam pattern.",
        "detail_ru": "HTML почти без текста — типичный спам-паттерн.",
        "fix_en": "Include a real text alternative and contact details.",
        "fix_ru": "Добавьте текстовую версию и нормальные контакты.",
    },
    "CNT1_TEXT": {
        "title_en": "Text content present",
        "title_ru": "Есть текстовое тело",
        "detail_en": "Plain text body found.",
        "detail_ru": "Найдена текстовая часть письма.",
    },
    "CNT1_HTML": {
        "title_en": "HTML-only body",
        "title_ru": "Только HTML, без текста",
        "detail_en": "No text/plain part.",
        "detail_ru": "Нет части text/plain.",
        "fix_en": "Add a text/plain alternative.",
        "fix_ru": "Добавьте альтернативу text/plain.",
    },
    "CNT2_SPAM": {
        "title_en": "Multiple spam-like words in body",
        "title_ru": "Несколько спам-слов в теле",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "CNT2_OK": {
        "title_en": "Body spam vocabulary looks fine",
        "title_ru": "Лексика тела без явного спама",
        "detail_en": "{detail} hit(s)",
        "detail_ru": "Совпадений: {detail}",
    },
    "CNT3_SHORT": {
        "title_en": "Shortened URL detected",
        "title_ru": "Обнаружена короткая ссылка",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Link to the real destination domain instead of public shorteners.",
        "fix_ru": "Давайте прямую ссылку на свой домен, без публичных сокращателей.",
    },
    "CNT3_OK": {
        "title_en": "No public URL shortener",
        "title_ru": "Публичных сокращателей ссылок нет",
        "detail_en": "No known shortener hosts in body.",
        "detail_ru": "В теле нет известных хостов-сокращателей.",
    },
    "CNT4_SCRIPT": {
        "title_en": "HTML contains risky elements",
        "title_ru": "В HTML есть опасные элементы",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Remove script, iframe, embed, object, applet, base and form from email HTML.",
        "fix_ru": "Уберите script, iframe, embed, object, applet, base и form из HTML письма.",
    },
    "CNT4_CLEAN": {
        "title_en": "No risky HTML elements",
        "title_ru": "Опасных HTML-элементов нет",
        "detail_en": "No script/iframe/embed/object/applet/base/form tags.",
        "detail_ru": "Нет тегов script/iframe/embed/object/applet/base/form.",
    },
    "CNT4_NOHTML": {
        "title_en": "No HTML part",
        "title_ru": "HTML-части нет",
        "detail_en": "Nothing to scan for risky HTML elements.",
        "detail_ru": "Нечего проверять на опасные HTML-элементы.",
    },
    "CNT5_EMPTY": {
        "title_en": "Empty body",
        "title_ru": "Пустое тело письма",
        "detail_en": "Message has no text or HTML body.",
        "detail_ru": "Нет ни текста, ни HTML.",
    },
    "CNT5_OK": {
        "title_en": "Body is not empty",
        "title_ru": "Тело письма не пустое",
        "detail_en": "",
        "detail_ru": "",
    },
    "CNT6_NOIMG": {
        "title_en": "No images in HTML",
        "title_ru": "В HTML нет картинок",
        "detail_en": "",
        "detail_ru": "",
    },
    "CNT6_NOALT": {
        "title_en": "Images without ALT attribute",
        "title_ru": "Картинки без атрибута ALT",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Add alt=\"…\" on every <img> for accessibility and filters.",
        "fix_ru": "Добавьте alt=\"…\" на каждый <img> — для доступности и фильтров.",
    },
    "CNT6_ALT": {
        "title_en": "Images have ALT attributes",
        "title_ru": "У картинок есть ALT",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MIME1_KNOWN": {
        "title_en": "Known content-type",
        "title_ru": "Известный Content-Type",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MIME1_HTML": {
        "title_en": "HTML content-type without multipart",
        "title_ru": "HTML без multipart",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Prefer multipart/alternative with text/plain.",
        "fix_ru": "Лучше multipart/alternative с text/plain.",
    },
    "MIME1_UNUSUAL": {
        "title_en": "Unusual content-type",
        "title_ru": "Необычный Content-Type",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MIME2_BOTH": {
        "title_en": "Both text and HTML parts",
        "title_ru": "Есть и текст, и HTML",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MIME2_HTML_ONLY": {
        "title_en": "HTML without text alternative",
        "title_ru": "HTML без текстовой альтернативы",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Include text/plain.",
        "fix_ru": "Добавьте text/plain.",
    },
    "MIME2_TEXT_ONLY": {
        "title_en": "No HTML alternative",
        "title_ru": "Нет HTML-альтернативы",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Optional: add multipart/alternative with text/html for richer clients.",
        "fix_ru": "По желанию: добавьте multipart/alternative с text/html.",
    },
    "MIME2_OK": {
        "title_en": "MIME structure acceptable",
        "title_ru": "MIME-структура приемлема",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR1_FREEMAIL": {
        "title_en": "From is a freemail address",
        "title_ru": "From — freemail-адрес",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Fine for personal mail. For company / bulk / transactional mail use your own domain.",
        "fix_ru": "Для личной почты нормально. Для компании, рассылок и транзакций лучше свой домен.",
    },
    "ADDR1_OK": {
        "title_en": "From is not a known freemail domain",
        "title_ru": "From не из известных freemail-доменов",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR2_FREEMAIL": {
        "title_en": "Envelope From is a freemail address",
        "title_ru": "Envelope From — freemail",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Normal for personal freemail. Prefer your domain for bulk or branded mail.",
        "fix_ru": "Для личного freemail нормально. Для массовой или брендовой почты лучше свой домен.",
    },
    "ADDR2_OK": {
        "title_en": "Envelope From is not a known freemail domain",
        "title_ru": "Envelope From не freemail",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR2_EMPTY": {
        "title_en": "Empty envelope sender",
        "title_ru": "Пустой envelope sender",
        "detail_en": "MAIL FROM was empty or missing.",
        "detail_ru": "MAIL FROM пустой или отсутствует.",
    },
    "ADDR3_MATCH": {
        "title_en": "From matches envelope",
        "title_ru": "From совпадает с envelope",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR3_DIFF": {
        "title_en": "From differs from envelope",
        "title_ru": "From не совпадает с envelope",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Align header From with SMTP MAIL FROM when possible.",
        "fix_ru": "По возможности выровняйте From и SMTP MAIL FROM.",
    },
    "ADDR4_DN": {
        "title_en": "From has a display name",
        "title_ru": "У From есть display name",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR4_NO_DN": {
        "title_en": "From has no display name",
        "title_ru": "У From нет display name",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR5_NUMS": {
        "title_en": "From local-part starts with many digits",
        "title_ru": "Local-part From начинается с многих цифр",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Common on freemail and fine for personal use. For new brand mailboxes prefer a name without a long digit prefix.",
        "fix_ru": "На freemail обычно и для личной почты нормально. Для нового корпоративного ящика лучше имя без длинного цифрового префикса.",
    },
    "ADDR5_OK": {
        "title_en": "From local-part does not start with many digits",
        "title_ru": "Local-part From не начинается с многих цифр",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "ADDR6_DIGIT": {
        "title_en": "Freemail envelope username ends with a digit",
        "title_ru": "Имя freemail в envelope заканчивается цифрой",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Very common on freemail; not a problem for personal mail.",
        "fix_ru": "На freemail очень обычно; для личной почты не проблема.",
    },
    "ADDR6_OK": {
        "title_en": "Freemail envelope username does not end with a digit",
        "title_ru": "Имя freemail в envelope не заканчивается цифрой",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCPT1_ONE": {
        "title_en": "One recipient",
        "title_ru": "Один получатель",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCPT1_FEW": {
        "title_en": "Few recipients",
        "title_ru": "Несколько получателей",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCPT1_NONE": {
        "title_en": "No parseable recipients in To/Cc",
        "title_ru": "Не удалось разобрать To/Cc",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCPT1_MANY": {
        "title_en": "Many recipients in headers",
        "title_ru": "Много получателей в заголовках",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Bulk To/Cc lists look spammy; use BCC or an ESP.",
        "fix_ru": "Длинные To/Cc выглядят как спам; используйте BCC или ESP.",
    },
    "RCPT2_NO_DN": {
        "title_en": "Recipients have no display names",
        "title_ru": "У получателей нет display name",
        "detail_en": "None of the recipients have display names",
        "detail_ru": "Ни у одного получателя нет отображаемого имени",
    },
    "RCPT2_SOME_DN": {
        "title_en": "Some recipients have display names",
        "title_ru": "У части получателей есть display name",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MID1_MISSING": {
        "title_en": "Missing Message-ID",
        "title_ru": "Нет Message-ID",
        "detail_en": "No Message-ID header.",
        "detail_ru": "Заголовок Message-ID отсутствует.",
        "fix_en": "MTAs should generate Message-ID.",
        "fix_ru": "MTA должен генерировать Message-ID.",
    },
    "MID1_OK": {
        "title_en": "Message-ID present",
        "title_ru": "Message-ID есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MID2_MATCH": {
        "title_en": "Message-ID domain matches From",
        "title_ru": "Домен Message-ID совпадает с From",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "MID2_DIFF": {
        "title_en": "Message-ID domain differs from From",
        "title_ru": "Домен Message-ID отличается от From",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DATE1_MISSING": {
        "title_en": "Missing Date header",
        "title_ru": "Нет заголовка Date",
        "detail_en": "",
        "detail_ru": "",
    },
    "DATE1_BAD": {
        "title_en": "Unparseable Date header",
        "title_ru": "Date не разбирается",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DATE1_FUTURE": {
        "title_en": "Date is in the future",
        "title_ru": "Date в будущем",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DATE1_OLD": {
        "title_en": "Date is older than 30 days",
        "title_ru": "Date старше 30 дней",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DATE1_OK": {
        "title_en": "Date looks reasonable",
        "title_ru": "Date выглядит нормально",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "UA1_MISSING": {
        "title_en": "No User-Agent / X-Mailer",
        "title_ru": "Нет User-Agent / X-Mailer",
        "detail_en": "Client did not advertise a mailer string.",
        "detail_ru": "Клиент не указал строку почтовой программы.",
    },
    "UA1_VERSION": {
        "title_en": "Mailer string has a version",
        "title_ru": "В строке почтовой программы есть версия",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "UA1_NO_VERSION": {
        "title_en": "Mailer string has no version",
        "title_ru": "В строке почтовой программы нет версии",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCVD1_NONE": {
        "title_en": "No Received headers",
        "title_ru": "Нет заголовков Received",
        "detail_en": "Unexpected for internet mail.",
        "detail_ru": "Для интернет-почты это необычно.",
    },
    "RCVD1_ONE": {
        "title_en": "One Received header",
        "title_ru": "Один заголовок Received",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCVD1_TWO": {
        "title_en": "Two Received headers",
        "title_ru": "Два заголовка Received",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCVD1_OK": {
        "title_en": "Received hop count looks normal",
        "title_ru": "Число hops Received в норме",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCVD1_MANY": {
        "title_en": "Many Received hops",
        "title_ru": "Много hops Received",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCVD2_TLS": {
        "title_en": "Inbound SMTP to this tester used STARTTLS",
        "title_ru": "Входящий SMTP на этот тестер шёл по STARTTLS",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "RCVD2_NO_TLS": {
        "title_en": "Inbound SMTP to this tester without STARTTLS",
        "title_ru": "Входящий SMTP на этот тестер без STARTTLS",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Nothing to fix on freemail. On your own MTA prefer STARTTLS with a public CA cert; this tester’s cert is self-signed.",
        "fix_ru": "На freemail чинить нечего. На своём MTA включайте STARTTLS с публичным сертификатом; у этого тестера сертификат самоподписанный.",
    },
    "RCVD3_AUTH": {
        "title_en": "Authenticated hand-off seen in Received",
        "title_ru": "В Received видна SMTP AUTH",
        "detail_en": "AUTH/SASL markers present",
        "detail_ru": "Есть маркеры AUTH/SASL",
    },
    "RCVD3_NO_AUTH": {
        "title_en": "No SMTP AUTH marker in top Received",
        "title_ru": "В верхнем Received нет SMTP AUTH",
        "detail_en": "Common for server-to-server delivery.",
        "detail_ru": "Обычная картина для server-to-server.",
    },
    "ARC1_OK": {
        "title_en": "ARC headers present",
        "title_ru": "Заголовки ARC есть",
        "detail_en": "ARC-Seal / ARC-Message-Signature found.",
        "detail_ru": "Найдены ARC-Seal / ARC-Message-Signature.",
    },
    "ARC1_NA": {
        "title_en": "ARC signature absent",
        "title_ru": "Подписи ARC нет",
        "detail_en": "No ARC chain (normal for direct sender→inbox).",
        "detail_ru": "Нет цепочки ARC (нормально при прямой доставке на тестовый ящик).",
    },
    "LIST1_OK": {
        "title_en": "List-Unsubscribe present",
        "title_ru": "Есть List-Unsubscribe",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "LIST1_NA": {
        "title_en": "No List-Unsubscribe",
        "title_ru": "Нет List-Unsubscribe",
        "detail_en": "Fine for one-off mail; useful for bulk.",
        "detail_ru": "Для разовых писем нормально; для рассылок полезен.",
    },
    "AUTH1_NA": {
        "title_en": "No Authentication-Results header",
        "title_ru": "Нет Authentication-Results",
        "detail_en": "Upstream MTA did not add Authentication-Results (normal for direct delivery to this test inbox).",
        "detail_ru": "Входящий MTA не добавил Authentication-Results (нормально при прямой доставке сюда).",
    },
    "AUTH1_SPF_PASS": {
        "title_en": "SPF pass (Authentication-Results)",
        "title_ru": "SPF pass (Authentication-Results)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "AUTH1_SPF_FAIL": {
        "title_en": "SPF fail (Authentication-Results)",
        "title_ru": "SPF fail (Authentication-Results)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "AUTH2_DKIM_PASS": {
        "title_en": "DKIM pass (Authentication-Results)",
        "title_ru": "DKIM pass (Authentication-Results)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "AUTH2_DKIM_FAIL": {
        "title_en": "DKIM fail (Authentication-Results)",
        "title_ru": "DKIM fail (Authentication-Results)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "AUTH3_DMARC_PASS": {
        "title_en": "DMARC pass (Authentication-Results)",
        "title_ru": "DMARC pass (Authentication-Results)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "AUTH3_DMARC_FAIL": {
        "title_en": "DMARC fail (Authentication-Results)",
        "title_ru": "DMARC fail (Authentication-Results)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SPF1_NO_DOMAIN": {
        "title_en": "Cannot determine From domain for SPF",
        "title_ru": "Не удалось определить домен From для SPF",
        "detail_en": "Missing From / MAIL FROM domain.",
        "detail_ru": "Нет домена в From / MAIL FROM.",
    },
    "SPF1_MISSING": {
        "title_en": "No SPF record for From domain",
        "title_ru": "Нет SPF у домена From",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Add a TXT SPF record for the From domain.",
        "fix_ru": "Добавьте TXT SPF для домена From.",
    },
    "SPF1_PLUSALL": {
        "title_en": "SPF uses +all",
        "title_ru": "В SPF стоит +all",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Replace +all with ~all or -all.",
        "fix_ru": "Замените +all на ~all или -all.",
    },
    "SPF1_OK": {
        "title_en": "SPF record present",
        "title_ru": "SPF-запись есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC1_MISSING": {
        "title_en": "No DMARC record",
        "title_ru": "Нет DMARC",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Publish a DMARC TXT record (_dmarc.domain).",
        "fix_ru": "Опубликуйте TXT DMARC (_dmarc.домен).",
    },
    "DMARC1_REJECT": {
        "title_en": "DMARC permit policy (reject)",
        "title_ru": "DMARC с политикой reject",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC1_QUAR": {
        "title_en": "DMARC quarantine policy",
        "title_ru": "DMARC с политикой quarantine",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC1_NONE": {
        "title_en": "DMARC policy is monitoring-only (p=none)",
        "title_ru": "DMARC только мониторинг (p=none)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Move to p=quarantine then p=reject when ready.",
        "fix_ru": "Когда будете готовы — переходите на p=quarantine, затем p=reject.",
    },
    "DKIM1_MISSING": {
        "title_en": "No DKIM-Signature header",
        "title_ru": "Нет заголовка DKIM-Signature",
        "detail_en": "Message arrived without DKIM signature.",
        "detail_ru": "Письмо пришло без DKIM-подписи.",
        "fix_en": "Optional but recommended: enable DKIM and publish the public key. Missing is milder than a broken signature.",
        "fix_ru": "По желанию, но лучше: включите DKIM и опубликуйте ключ. Отсутствие мягче, чем сломанная подпись.",
    },
    "DKIM1_OK": {
        "title_en": "DKIM-Signature header present",
        "title_ru": "Заголовок DKIM-Signature есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DKIM2_TRACE": {
        "title_en": "DKIM trace",
        "title_ru": "Трасса DKIM",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DKIM3_DNS_OK": {
        "title_en": "DKIM public key published in DNS",
        "title_ru": "Публичный ключ DKIM есть в DNS",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DKIM3_DNS_MISSING": {
        "title_en": "DKIM public key not found in DNS",
        "title_ru": "Публичный ключ DKIM не найден в DNS",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Publish a TXT DKIM key for the selector and domain from the signature.",
        "fix_ru": "Опубликуйте TXT-ключ DKIM для selector и домена из подписи.",
    },
    "DKIM4_PASS": {
        "title_en": "DKIM cryptographic verify pass",
        "title_ru": "Криптопроверка DKIM пройдена",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DKIM4_FAIL": {
        "title_en": "DKIM cryptographic verify fail",
        "title_ru": "Криптопроверка DKIM не прошла",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Fix signing (body hash / headers / key) so the signature verifies.",
        "fix_ru": "Исправьте подпись (хэш тела / заголовки / ключ), чтобы она проверялась.",
    },
    "DKIM4_ERROR": {
        "title_en": "DKIM crypto verify error",
        "title_ru": "Ошибка криптопроверки DKIM",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SPF2_PASS": {
        "title_en": "SPF evaluation pass for sending IP",
        "title_ru": "SPF-проверка IP отправителя: pass",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SPF2_FAIL": {
        "title_en": "SPF evaluation fail for sending IP",
        "title_ru": "SPF-проверка IP отправителя: fail",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Authorize this sending IP (or include) in the SPF TXT.",
        "fix_ru": "Разрешите этот IP (или include) в SPF TXT.",
    },
    "SPF2_SOFTFAIL": {
        "title_en": "Sending IP got SPF softfail",
        "title_ru": "IP отправителя получил SPF softfail",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Add your outbound IP (or the right include) to SPF so the check returns pass. Do not treat swapping ~all for -all as the spam fix by itself.",
        "fix_ru": "Добавьте свой исходящий IP (или нужный include) в SPF, чтобы проверка дала pass. Не считайте одной заменой ~all на -all исправление спама.",
    },
    "SPF2_SOFTFAIL_FREEMAIL": {
        "title_en": "SPF softfail on freemail path (informational)",
        "title_ru": "SPF softfail на пути freemail (информационно)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Typical for some freemail/ESP hops — not a sender config error. Ignore for personal freemail.",
        "fix_ru": "Типично для части freemail/ESP — не ошибка вашей настройки. Для личного freemail можно не трогать.",
    },
    "SPF2_NEUTRAL": {
        "title_en": "SPF neutral for sending IP (no policy assertion)",
        "title_ru": "SPF neutral для IP (политика не утверждает pass/fail)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Neutral is not a fail. Tighten SPF only if this is your domain and you expected pass.",
        "fix_ru": "Neutral — не fail. Ужесточайте SPF только если это ваш домен и вы ждали pass.",
    },
    "SPF2_NEUTRAL_FREEMAIL": {
        "title_en": "SPF neutral on freemail path (informational)",
        "title_ru": "SPF neutral на пути freemail (информационно)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Not a bug and not your fault: Mail.ru/Gmail-style SPF often ends neutral here. No grade penalty.",
        "fix_ru": "Не баг и не ваша вина: у Mail.ru/Gmail SPF часто даёт neutral на этом хопе. Баллы не снимаем.",
    },
    "SPF2_FAIL_FREEMAIL": {
        "title_en": "SPF fail on freemail path (informational)",
        "title_ru": "SPF fail на пути freemail (информационно)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Freemail SPF is owned by the provider — nothing for you to fix on personal Mail.ru/Gmail mail.",
        "fix_ru": "SPF freemail принадлежит провайдеру — в личной почте Mail.ru/Gmail вам нечего чинить.",
    },
    "SPF2_NONE": {
        "title_en": "SPF evaluation skipped / none",
        "title_ru": "SPF-оценка пропущена / none",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SPF2_TEMPERROR": {
        "title_en": "SPF temporary DNS error",
        "title_ru": "Временная DNS-ошибка SPF",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "SPF2_PERMERROR": {
        "title_en": "SPF permanent error (bad record)",
        "title_ru": "Постоянная ошибка SPF (битая запись)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Fix the SPF TXT syntax and DNS publication.",
        "fix_ru": "Исправьте синтаксис SPF TXT и публикацию в DNS.",
    },
    "SPF2_PERMERROR_FREEMAIL": {
        "title_en": "SPF parse issue on freemail path (informational)",
        "title_ru": "Разбор SPF freemail неполный (информационно)",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Provider SPF can be too complex for a full local eval — not a reason to change personal freemail settings.",
        "fix_ru": "SPF провайдера бывает слишком сложным для полного локального разбора — личный freemail из‑за этого не чинят.",
    },
    "DMARC2_ALIGN_PASS": {
        "title_en": "DMARC alignment pass",
        "title_ru": "DMARC alignment пройден",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC2_ALIGN_FAIL": {
        "title_en": "DMARC alignment fail",
        "title_ru": "DMARC alignment не пройден",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Make SPF Mail-From or DKIM d= align with From (aspf/adkim).",
        "fix_ru": "Выровняйте SPF Mail-From или DKIM d= с From (aspf/adkim).",
    },
    "DMARC2_ALIGN_NA": {
        "title_en": "DMARC alignment not evaluated",
        "title_ru": "DMARC alignment не оценивался",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC3_RUA": {
        "title_en": "DMARC rua (aggregate reports) set",
        "title_ru": "DMARC rua (агрегатные отчёты) задан",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC3_RUA_MISSING": {
        "title_en": "DMARC rua not set",
        "title_ru": "DMARC rua не задан",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Add rua=mailto:… for aggregate DMARC reports.",
        "fix_ru": "Добавьте rua=mailto:… для агрегатных отчётов DMARC.",
    },
    "DMARC3_RUF": {
        "title_en": "DMARC ruf (failure reports) set",
        "title_ru": "DMARC ruf (отчёты о сбоях) задан",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "DMARC3_OPTS": {
        "title_en": "DMARC alignment / scope options",
        "title_ru": "Параметры alignment / scope DMARC",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "STS1_OK": {
        "title_en": "MTA-STS DNS record present",
        "title_ru": "DNS-запись MTA-STS есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "STS1_MISSING": {
        "title_en": "No MTA-STS DNS record",
        "title_ru": "Нет DNS-записи MTA-STS",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Optional: publish _mta-sts TXT and the HTTPS policy file.",
        "fix_ru": "Опционально: опубликуйте TXT _mta-sts и HTTPS-политику.",
    },
    "TLSRPT1_OK": {
        "title_en": "TLS-RPT DNS record present",
        "title_ru": "DNS-запись TLS-RPT есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "TLSRPT1_MISSING": {
        "title_en": "No TLS-RPT DNS record",
        "title_ru": "Нет DNS-записи TLS-RPT",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Optional: publish _smtp._tls TXT with rua=mailto:…",
        "fix_ru": "Опционально: опубликуйте TXT _smtp._tls с rua=mailto:…",
    },
    "BIMI1_OK": {
        "title_en": "BIMI DNS record present",
        "title_ru": "DNS-запись BIMI есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "BIMI1_MISSING": {
        "title_en": "No BIMI DNS record",
        "title_ru": "Нет DNS-записи BIMI",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Optional brand logo via BIMI (needs DMARC enforce).",
        "fix_ru": "Опциональный логотип BIMI (нужен жёсткий DMARC).",
    },
    "MX1_MISSING": {
        "title_en": "No MX for From domain",
        "title_ru": "Нет MX у домена From",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Publish MX (or rely on a valid A only if intentional).",
        "fix_ru": "Опубликуйте MX (или осознанно оставьте только A).",
    },
    "MX1_OK": {
        "title_en": "MX record was ok",
        "title_ru": "MX-запись в порядке",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "HELO1_EMPTY": {
        "title_en": "Empty HELO/EHLO",
        "title_ru": "Пустой HELO/EHLO",
        "detail_en": "",
        "detail_ru": "",
    },
    "HELO1_IP_MATCH": {
        "title_en": "HELO is the connecting IP",
        "title_ru": "HELO совпадает с IP соединения",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "HELO1_IP": {
        "title_en": "HELO is a bare IP",
        "title_ru": "HELO — голый IP",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Use a hostname that matches PTR.",
        "fix_ru": "Укажите hostname, совпадающий с PTR.",
    },
    "HELO1_LOCAL": {
        "title_en": "HELO looks local/non-public",
        "title_ru": "HELO похож на локальный",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "HELO1_HOST": {
        "title_en": "HELO hostname present",
        "title_ru": "HELO содержит hostname",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "HELO2_NOA": {
        "title_en": "HELO hostname has no A/AAAA record",
        "title_ru": "У HELO hostname нет A/AAAA",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Publish A/AAAA for the SMTP HELO name.",
        "fix_ru": "Опубликуйте A/AAAA для имени SMTP HELO.",
    },
    "HELO2_A": {
        "title_en": "HELO hostname resolves in DNS",
        "title_ru": "HELO hostname резолвится в DNS",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "HELO2_MATCH": {
        "title_en": "HELO hostname resolves to connecting IP",
        "title_ru": "HELO hostname указывает на IP соединения",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "HELO2_MISMATCH": {
        "title_en": "HELO hostname does not resolve to connecting IP",
        "title_ru": "HELO hostname не совпадает с IP соединения",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Align HELO A/AAAA with the SMTP client IP.",
        "fix_ru": "Выровняйте A/AAAA HELO с IP SMTP-клиента.",
    },
    "BL1_LISTED": {
        "title_en": "Sending IP listed on DNSBL",
        "title_ru": "IP отправителя в чёрном списке DNSBL",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Stop the abuse source first, then open each list’s removal page (links are in the report).",
        "fix_ru": "Сначала уберите причину, затем откройте страницу снятия у каждого списка (ссылки — в отчёте).",
    },
    "BL1_CLEAN": {
        "title_en": "Sending IP not listed on checked DNSBLs",
        "title_ru": "IP отправителя нет в проверенных DNSBL",
        "detail_en": "Checked {detail}",
        "detail_ru": "Проверено: {detail}",
    },
    "PTR1_OK": {
        "title_en": "Reverse DNS present",
        "title_ru": "Обратный DNS (PTR) есть",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "PTR1_MISSING": {
        "title_en": "No reverse DNS (PTR)",
        "title_ru": "Нет обратного DNS (PTR)",
        "detail_en": "No PTR for {detail}",
        "detail_ru": "Нет PTR для {detail}",
        "fix_en": "Ask the hosting provider to set PTR matching the SMTP hostname.",
        "fix_ru": "Попросите хостера выставить PTR под SMTP-hostname.",
    },
    "PTR2_MATCH": {
        "title_en": "PTR matches HELO",
        "title_ru": "PTR совпадает с HELO",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
    },
    "PTR2_MISMATCH": {
        "title_en": "PTR does not match HELO",
        "title_ru": "PTR не совпадает с HELO",
        "detail_en": "{detail}",
        "detail_ru": "{detail}",
        "fix_en": "Set PTR to the SMTP HELO hostname (or the reverse).",
        "fix_ru": "Выставьте PTR под SMTP HELO (или наоборот).",
    },
}


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def locale_row(en: str, ru: str) -> dict[str, str]:
    if en == "{detail}":
        return {loc: "{detail}" for loc in LOCALES}
    if en == "":
        return {loc: "" for loc in LOCALES}
    extras = TR_LISTS.get(en)
    if extras is None:
        return locale_row_soft(en, ru)
    if len(extras) != len(OTHER_LOCALES):
        raise SystemExit(f"bad TR length for {en!r}: {len(extras)}")
    out = {"en": en, "ru": ru}
    for loc, text in zip(OTHER_LOCALES, extras):
        out[loc] = text
    return out


def locale_row_soft(en: str, ru: str) -> dict[str, str]:
    """en/ru required; other locales use TR_LISTS when present, else English."""
    if en == "":
        return {loc: "" for loc in LOCALES}
    out = {"en": en, "ru": ru or en}
    extras = TR_LISTS.get(en)
    for i, loc in enumerate(OTHER_LOCALES):
        if extras and i < len(extras):
            out[loc] = extras[i]
        else:
            out[loc] = en
    return out


def emit_locale_object(row: dict[str, str]) -> str:
    parts = [f"{loc}: {js_str(row[loc])}" for loc in LOCALES]
    return "{ " + ", ".join(parts) + " }"


def main() -> None:
    text = "\n".join(p.read_text(encoding="utf-8") for p in sorted(ANALYZE_DIR.glob("*.go")))
    codes = sorted({m.group(1) for m in re.finditer(r'f\("[A-Z0-9]+", "([A-Z0-9_]+)",', text)})
    missing = [c for c in codes if c not in COPY]
    if missing:
        raise SystemExit(f"missing COPY for: {', '.join(missing)}")

    lines = [
        'import type { Locale } from "./site-config";',
        "",
        "export type FindingCopy = {",
        "  title: string;",
        "  detail?: string;",
        "  problem?: string;",
        "  why?: string;",
        "  fix?: string;",
        "};",
        "",
        "type FindingPack = {",
        "  title: Partial<Record<Locale, string>> & { en: string };",
        "  detail?: Partial<Record<Locale, string>> & { en: string };",
        "  problem?: Partial<Record<Locale, string>> & { en: string };",
        "  why?: Partial<Record<Locale, string>> & { en: string };",
        "  fix?: Partial<Record<Locale, string>> & { en: string };",
        "};",
        "",
        "const PACK: Record<string, FindingPack> = {",
    ]
    missing_why = [c for c in codes if c not in WHY]
    if missing_why:
        raise SystemExit(f"missing WHY for: {', '.join(missing_why)}")
    missing_problem = [c for c in codes if c not in PROBLEM]
    if missing_problem:
        raise SystemExit(f"missing PROBLEM for: {', '.join(missing_problem)}")
    for code in codes:
        c = COPY[code]
        lines.append(f"  {code}: {{")
        title = locale_row(c["title_en"], c["title_ru"])
        lines.append(f"    title: {emit_locale_object(title)},")
        if "detail_en" in c or "detail_ru" in c:
            detail = locale_row(c.get("detail_en", ""), c.get("detail_ru", ""))
            lines.append(f"    detail: {emit_locale_object(detail)},")
        problem_en, problem_ru = PROBLEM[code]
        problem = locale_row_soft(problem_en, problem_ru)
        lines.append(f"    problem: {emit_locale_object(problem)},")
        why_en, why_ru = WHY[code]
        why = locale_row_soft(why_en, why_ru)
        lines.append(f"    why: {emit_locale_object(why)},")
        if c.get("fix_en") or c.get("fix_ru"):
            fix_en = c.get("fix_en", "")
            fix_ru = c.get("fix_ru", "")
            if fix_en in TR_LISTS or fix_en in ("", "{detail}"):
                fix = locale_row(fix_en, fix_ru)
            else:
                fix = locale_row_soft(fix_en, fix_ru)
            lines.append(f"    fix: {emit_locale_object(fix)},")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    lines.append("function pick(row: Partial<Record<Locale, string>> & { en: string }, locale: Locale): string {")
    lines.append("  return row[locale] ?? row.en;")
    lines.append("}")
    lines.append("")
    lines.append("export function findingCopy(locale: Locale, code: string): FindingCopy | null {")
    lines.append("  const pack = PACK[code];")
    lines.append("  if (!pack) return null;")
    lines.append("  const out: FindingCopy = { title: pick(pack.title, locale) };")
    lines.append("  if (pack.detail) out.detail = pick(pack.detail, locale);")
    lines.append("  if (pack.problem) {")
    lines.append("    const problem = pick(pack.problem, locale);")
    lines.append("    if (problem) out.problem = problem;")
    lines.append("  }")
    lines.append("  if (pack.why) {")
    lines.append("    const why = pick(pack.why, locale);")
    lines.append("    if (why) out.why = why;")
    lines.append("  }")
    lines.append("  if (pack.fix) {")
    lines.append("    const fix = pick(pack.fix, locale);")
    lines.append("    if (fix) out.fix = fix;")
    lines.append("  }")
    lines.append("  return out;")
    lines.append("}")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {OUT.name} codes={len(codes)} locales={len(LOCALES)} why={len(WHY)} problem={len(PROBLEM)}")


if __name__ == "__main__":
    main()
