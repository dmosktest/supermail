# -*- coding: utf-8 -*-
"""Human "what's wrong / what this means" copy (en/ru). Paired with findings_why spam-impact text."""
from __future__ import annotations

# code -> (problem_en, problem_ru)
PROBLEM: dict[str, tuple[str, str]] = {
    'ADDR1_FREEMAIL': (
        'From is a freemail address.',
        'From — freemail-адрес.',
    ),
    'ADDR1_OK': (
        'Check result: from is not a known freemail domain.',
        'Результат проверки: from не из известных freemail-доменов.',
    ),
    'ADDR2_EMPTY': (
        'Empty envelope sender.',
        'Пустой envelope sender.',
    ),
    'ADDR2_FREEMAIL': (
        'Envelope From is a freemail address.',
        'Envelope From — freemail.',
    ),
    'ADDR2_OK': (
        'Check result: envelope From is not a known freemail domain.',
        'Результат проверки: envelope From не freemail.',
    ),
    'ADDR3_DIFF': (
        'From differs from envelope.',
        'From не совпадает с envelope.',
    ),
    'ADDR3_MATCH': (
        'Check result: from matches envelope.',
        'Результат проверки: from совпадает с envelope.',
    ),
    'ADDR4_DN': (
        'From has a display name.',
        'У From есть display name.',
    ),
    'ADDR4_NO_DN': (
        'From has no display name.',
        'У From нет display name.',
    ),
    'ADDR5_NUMS': (
        'From local-part starts with many digits.',
        'Local-part From начинается с многих цифр.',
    ),
    'ADDR5_OK': (
        'Check result: from local-part does not start with many digits.',
        'Результат проверки: local-part From не начинается с многих цифр.',
    ),
    'ADDR6_DIGIT': (
        'Freemail envelope username ends with a digit.',
        'Имя freemail в envelope заканчивается цифрой.',
    ),
    'ADDR6_OK': (
        'Check result: freemail envelope username does not end with a digit.',
        'Результат проверки: имя freemail в envelope не заканчивается цифрой.',
    ),
    'ARC1_NA': (
        'ARC signature absent.',
        'Подписи ARC нет.',
    ),
    'ARC1_OK': (
        'Check result: aRC headers present.',
        'Результат проверки: заголовки ARC есть.',
    ),
    'AUTH1_NA': (
        'No Authentication-Results header.',
        'Нет Authentication-Results.',
    ),
    'AUTH1_SPF_FAIL': (
        'SPF fail (Authentication-Results).',
        'SPF fail (Authentication-Results).',
    ),
    'AUTH1_SPF_PASS': (
        'Check result: sPF pass (Authentication-Results).',
        'Результат проверки: sPF pass (Authentication-Results).',
    ),
    'AUTH2_DKIM_FAIL': (
        'DKIM fail (Authentication-Results).',
        'DKIM fail (Authentication-Results).',
    ),
    'AUTH2_DKIM_PASS': (
        'Check result: dKIM pass (Authentication-Results).',
        'Результат проверки: dKIM pass (Authentication-Results).',
    ),
    'AUTH3_DMARC_FAIL': (
        'DMARC fail (Authentication-Results).',
        'DMARC fail (Authentication-Results).',
    ),
    'AUTH3_DMARC_PASS': (
        'Check result: dMARC pass (Authentication-Results).',
        'Результат проверки: dMARC pass (Authentication-Results).',
    ),
    'BIMI1_MISSING': (
        'No BIMI DNS record.',
        'Нет DNS-записи BIMI.',
    ),
    'BIMI1_MULTI': (
        'More than one BIMI TXT is published at default._bimi.',
        'На default._bimi опубликовано больше одной BIMI TXT.',
    ),
    'BIMI1_OK': (
        'Check result: bIMI DNS record present.',
        'Результат проверки: dNS-запись BIMI есть.',
    ),
    'BL1_CLEAN': (
        'Check result: sending IP not listed on checked DNSBLs.',
        'Результат проверки: iP отправителя нет в проверенных DNSBL.',
    ),
    'BL1_LISTED': (
        'This sending IP is on one or more public DNS blacklists that many mail filters consult. A common cause is abuse — or a missing/wrong PTR (reverse DNS).',
        'Этот IP отправителя есть в одном или нескольких публичных DNS-чёрных списках, на которые смотрят фильтры. Частая причина — злоупотребления или отсутствующий/неверный PTR (обратный DNS).',
    ),
    'CNT1_HTML': (
        'HTML-only body.',
        'Только HTML, без текста.',
    ),
    'CNT1_IMAGE': (
        'Mostly image / little text.',
        'Почти только картинка, мало текста.',
    ),
    'CNT1_TEXT': (
        'Text content present.',
        'Есть текстовое тело.',
    ),
    'CNT2_OK': (
        'Check result: body spam vocabulary looks fine.',
        'Результат проверки: лексика тела без явного спама.',
    ),
    'CNT2_SPAM': (
        'Multiple spam-like words in body.',
        'Несколько спам-слов в теле.',
    ),
    'CNT3_OK': (
        'Check result: no public URL shortener.',
        'Результат проверки: публичных сокращателей ссылок нет.',
    ),
    'CNT3_SHORT': (
        'Shortened URL detected.',
        'Обнаружена короткая ссылка.',
    ),
    'CNT4_CLEAN': (
        'Check result: no risky HTML elements.',
        'Результат проверки: опасных HTML-элементов нет.',
    ),
    'CNT4_NOHTML': (
        'No HTML part.',
        'HTML-части нет.',
    ),
    'CNT4_SCRIPT': (
        'HTML contains risky elements.',
        'В HTML есть опасные элементы.',
    ),
    'CNT5_EMPTY': (
        'Empty body.',
        'Пустое тело письма.',
    ),
    'CNT5_OK': (
        'Check result: body is not empty.',
        'Результат проверки: тело письма не пустое.',
    ),
    'CNT6_ALT': (
        'Images have ALT attributes.',
        'У картинок есть ALT.',
    ),
    'CNT6_NOALT': (
        'Images without ALT attribute.',
        'Картинки без атрибута ALT.',
    ),
    'CNT6_NOIMG': (
        'No images in HTML.',
        'В HTML нет картинок.',
    ),
    'DATE1_BAD': (
        'Unparseable Date header.',
        'Date не разбирается.',
    ),
    'DATE1_FUTURE': (
        'Date is in the future.',
        'Date в будущем.',
    ),
    'DATE1_MISSING': (
        'Missing Date header.',
        'Нет заголовка Date.',
    ),
    'DATE1_OK': (
        'Check result: date looks reasonable.',
        'Результат проверки: date выглядит нормально.',
    ),
    'DATE1_OLD': (
        'Date is older than 30 days.',
        'Date старше 30 дней.',
    ),
    'DKIM1_MISSING': (
        'The message has no DKIM-Signature header.',
        'В письме нет заголовка DKIM-Signature.',
    ),
    'DKIM1_OK': (
        'Check result: dKIM-Signature header present.',
        'Результат проверки: заголовок DKIM-Signature есть.',
    ),
    'DKIM2_TRACE': (
        'DKIM trace.',
        'Трасса DKIM.',
    ),
    'DKIM3_DNS_MISSING': (
        'DKIM public key not found in DNS.',
        'Публичный ключ DKIM не найден в DNS.',
    ),
    'DKIM3_DNS_MULTI': (
        'More than one TXT is published at the DKIM selector name.',
        'На имени селектора DKIM опубликовано больше одной TXT.',
    ),
    'DKIM3_DNS_OK': (
        'Check result: dKIM public key published in DNS.',
        'Результат проверки: публичный ключ DKIM есть в DNS.',
    ),
    'DKIM4_ERROR': (
        'DKIM crypto verify error.',
        'Ошибка криптопроверки DKIM.',
    ),
    'DKIM4_FAIL': (
        'A DKIM signature is present, but cryptographic verification failed.',
        'Подпись DKIM есть, но криптопроверка не прошла.',
    ),
    'DKIM4_MULTI': (
        'Verifier could not pick a DKIM public key because several TXT records exist at the selector.',
        'Верификатор не смог выбрать публичный ключ DKIM: на селекторе несколько TXT.',
    ),
    'DKIM4_NOKEY': (
        'The DKIM public key for this signature was not found or not reachable in DNS.',
        'Публичный ключ DKIM для этой подписи не найден или недоступен в DNS.',
    ),
    'DKIM4_REVOKED': (
        'The DKIM DNS key is revoked (empty p=), so the signature cannot verify.',
        'Ключ DKIM в DNS отозван (пустой p=), подпись проверить нельзя.',
    ),
    'DKIM4_BADKEY': (
        'The DKIM DNS key exists but is unusable (syntax, size, or algorithm mismatch).',
        'Ключ DKIM в DNS есть, но непригоден (синтаксис, длина или несовпадение алгоритма).',
    ),
    'DKIM4_EXPIRED': (
        'The DKIM signature expiration (x=) is in the past.',
        'Срок действия подписи DKIM (x=) уже истёк.',
    ),
    'DKIM4_PERM': (
        'The DKIM-Signature failed a format or policy check before crypto verify.',
        'DKIM-Signature не прошёл проверку формата или политики до криптопроверки.',
    ),
    'DKIM4_PASS': (
        'At least one DKIM signature verified cryptographically.',
        'Хотя бы одна подпись DKIM прошла криптопроверку.',
    ),
    'DMARC1_MISSING': (
        'There is no DMARC record for the From domain.',
        'У домена From нет записи DMARC.',
    ),
    'DMARC1_MULTI': (
        'More than one DMARC TXT (v=DMARC1) is published at _dmarc.',
        'На _dmarc опубликовано больше одной DMARC TXT (v=DMARC1).',
    ),
    'DMARC1_NONE': (
        'DMARC policy is monitoring-only (p=none).',
        'DMARC только мониторинг (p=none).',
    ),
    'DMARC1_QUAR': (
        'DMARC quarantine policy.',
        'DMARC с политикой quarantine.',
    ),
    'DMARC1_REJECT': (
        'DMARC permit policy (reject).',
        'DMARC с политикой reject.',
    ),
    'DMARC2_ALIGN_FAIL': (
        'Neither the SPF MAIL FROM domain nor DKIM d= matches the From domain the way DMARC requires.',
        'Ни домен SPF MAIL FROM, ни DKIM d= не совпадают с доменом From так, как требует DMARC.',
    ),
    'DMARC2_ALIGN_NA': (
        'DMARC alignment not evaluated.',
        'DMARC alignment не оценивался.',
    ),
    'DMARC2_ALIGN_PASS': (
        'SPF or DKIM aligns with From according to DMARC.',
        'SPF или DKIM совпадают с From так, как хочет DMARC.',
    ),
    'DMARC3_OPTS': (
        'DMARC alignment / scope options.',
        'Параметры alignment / scope DMARC.',
    ),
    'DMARC3_RUA': (
        'DMARC rua (aggregate reports) set.',
        'DMARC rua (агрегатные отчёты) задан.',
    ),
    'DMARC3_RUA_MISSING': (
        'DMARC rua not set.',
        'DMARC rua не задан.',
    ),
    'DMARC3_RUF': (
        'DMARC ruf (failure reports) set.',
        'DMARC ruf (отчёты о сбоях) задан.',
    ),
    'HELO1_EMPTY': (
        'Empty HELO/EHLO.',
        'Пустой HELO/EHLO.',
    ),
    'HELO1_HOST': (
        'HELO hostname present.',
        'HELO содержит hostname.',
    ),
    'HELO1_IP': (
        'HELO is a bare IP.',
        'HELO — голый IP.',
    ),
    'HELO1_IP_MATCH': (
        'Check result: hELO is the connecting IP.',
        'Результат проверки: hELO совпадает с IP соединения.',
    ),
    'HELO1_LOCAL': (
        'HELO looks local/non-public.',
        'HELO похож на локальный.',
    ),
    'HELO2_A': (
        'HELO hostname resolves in DNS.',
        'HELO hostname резолвится в DNS.',
    ),
    'HELO2_MATCH': (
        'Check result: hELO hostname resolves to connecting IP.',
        'Результат проверки: hELO hostname указывает на IP соединения.',
    ),
    'HELO2_MISMATCH': (
        'HELO hostname does not resolve to connecting IP.',
        'HELO hostname не совпадает с IP соединения.',
    ),
    'HELO2_NOA': (
        'HELO hostname has no A/AAAA record.',
        'У HELO hostname нет A/AAAA.',
    ),
    'LIST1_NA': (
        'No List-Unsubscribe.',
        'Нет List-Unsubscribe.',
    ),
    'LIST1_OK': (
        'Check result: list-Unsubscribe present.',
        'Результат проверки: есть List-Unsubscribe.',
    ),
    'MID1_MISSING': (
        'Missing Message-ID.',
        'Нет Message-ID.',
    ),
    'MID1_OK': (
        'Check result: message-ID present.',
        'Результат проверки: message-ID есть.',
    ),
    'MID2_DIFF': (
        'Message-ID domain differs from From.',
        'Домен Message-ID отличается от From.',
    ),
    'MID2_MATCH': (
        'Check result: message-ID domain matches From.',
        'Результат проверки: домен Message-ID совпадает с From.',
    ),
    'MIME1_HTML': (
        'HTML content-type without multipart.',
        'HTML без multipart.',
    ),
    'MIME1_KNOWN': (
        'Known content-type.',
        'Известный Content-Type.',
    ),
    'MIME1_UNUSUAL': (
        'Unusual content-type.',
        'Необычный Content-Type.',
    ),
    'MIME2_BOTH': (
        'Both text and HTML parts.',
        'Есть и текст, и HTML.',
    ),
    'MIME2_HTML_ONLY': (
        'HTML without text alternative.',
        'HTML без текстовой альтернативы.',
    ),
    'MIME2_OK': (
        'Check result: mIME structure acceptable.',
        'Результат проверки: mIME-структура приемлема.',
    ),
    'MIME2_TEXT_ONLY': (
        'No HTML alternative.',
        'Нет HTML-альтернативы.',
    ),
    'MX1_MISSING': (
        'No MX for From domain.',
        'Нет MX у домена From.',
    ),
    'MX1_OK': (
        'Check result: mX record was ok.',
        'Результат проверки: mX-запись в порядке.',
    ),
    'PARSE1': (
        'Could not parse message.',
        'Не удалось разобрать письмо.',
    ),
    'PTR1_MISSING': (
        'The sending IP has no reverse DNS (PTR) name — receivers see an unnamed address.',
        'У IP отправителя нет имени в обратном DNS (PTR) — получатели видят «безымянный» адрес.',
    ),
    'PTR1_OK': (
        'Check result: reverse DNS present.',
        'Результат проверки: обратный DNS (PTR) есть.',
    ),
    'PTR2_MATCH': (
        'Check result: PTR matches HELO.',
        'Результат проверки: PTR совпадает с HELO.',
    ),
    'PTR2_MISMATCH': (
        'The PTR name for the sending IP does not match the SMTP HELO/EHLO hostname.',
        'Имя PTR у IP отправителя не совпадает с hostname в SMTP HELO/EHLO.',
    ),
    'RCPT1_FEW': (
        'Few recipients.',
        'Несколько получателей.',
    ),
    'RCPT1_MANY': (
        'Many recipients in headers.',
        'Много получателей в заголовках.',
    ),
    'RCPT1_NONE': (
        'No parseable recipients in To/Cc.',
        'Не удалось разобрать To/Cc.',
    ),
    'RCPT1_ONE': (
        'One recipient.',
        'Один получатель.',
    ),
    'RCPT2_NO_DN': (
        'Recipients have no display names.',
        'У получателей нет display name.',
    ),
    'RCPT2_SOME_DN': (
        'Some recipients have display names.',
        'У части получателей есть display name.',
    ),
    'RCVD1_MANY': (
        'Many Received hops.',
        'Много hops Received.',
    ),
    'RCVD1_NONE': (
        'No Received headers.',
        'Нет заголовков Received.',
    ),
    'RCVD1_OK': (
        'Check result: received hop count looks normal.',
        'Результат проверки: число hops Received в норме.',
    ),
    'RCVD1_ONE': (
        'One Received header.',
        'Один заголовок Received.',
    ),
    'RCVD1_TWO': (
        'Two Received headers.',
        'Два заголовка Received.',
    ),
    'RCVD2_NO_TLS': (
        'Inbound SMTP to this tester without STARTTLS.',
        'Входящий SMTP на этот тестер без STARTTLS.',
    ),
    'RCVD2_TLS': (
        'Inbound SMTP to this tester used STARTTLS.',
        'Входящий SMTP на этот тестер шёл по STARTTLS.',
    ),
    'RCVD3_AUTH': (
        'Authenticated hand-off seen in Received.',
        'В Received видна SMTP AUTH.',
    ),
    'RCVD3_NO_AUTH': (
        'No SMTP AUTH marker in top Received.',
        'В верхнем Received нет SMTP AUTH.',
    ),
    'SPF1_MISSING': (
        'The From domain has no SPF TXT record in DNS.',
        'У домена From в DNS нет SPF-записи (TXT).',
    ),
    'SPF1_NO_DOMAIN': (
        'Cannot determine From domain for SPF.',
        'Не удалось определить домен From для SPF.',
    ),
    'SPF1_OK': (
        'The From domain has a published SPF TXT record.',
        'У домена From в DNS есть SPF-запись (TXT).',
    ),
    'SPF1_PLUSALL': (
        'The SPF record ends with +all — that allows anyone to send as this domain.',
        'В SPF стоит +all — так слать «от имени» домена может кто угодно.',
    ),
    'SPF1_MULTI': (
        'More than one SPF TXT (v=spf1) is published for the From domain.',
        'У домена From опубликовано больше одной SPF TXT (v=spf1).',
    ),
    'SPF2_FAIL': (
        'The sending IP is not authorized in SPF for this domain — the check returned fail, not softfail.',
        'IP отправителя не разрешён в SPF для этого домена — проверка вернула fail, а не softfail.',
    ),
    'SPF2_FAIL_FREEMAIL': (
        'SPF fail on freemail path (informational).',
        'SPF fail на пути freemail (информационно).',
    ),
    'SPF2_NEUTRAL': (
        'SPF neutral for sending IP (no policy assertion).',
        'SPF neutral для IP (политика не утверждает pass/fail).',
    ),
    'SPF2_NEUTRAL_FREEMAIL': (
        'SPF neutral on freemail path (informational).',
        'SPF neutral на пути freemail (информационно).',
    ),
    'SPF2_NONE': (
        'SPF evaluation skipped / none.',
        'SPF-оценка пропущена / none.',
    ),
    'SPF2_PASS': (
        'SPF checked the connecting IP against the domain policy and got pass — this host is allowed to send for the domain.',
        'SPF сверил IP соединения с политикой домена и получил pass — этот хост может слать от имени домена.',
    ),
    'SPF2_PERMERROR': (
        'SPF permanent error (bad record).',
        'Постоянная ошибка SPF (битая запись).',
    ),
    'SPF2_PERMERROR_FREEMAIL': (
        'SPF parse issue on freemail path (informational).',
        'Разбор SPF freemail неполный (информационно).',
    ),
    'SPF2_MULTI': (
        'SPF evaluation hit permerror because several v=spf1 TXT records exist.',
        'Оценка SPF дала permerror: в DNS несколько TXT с v=spf1.',
    ),
    'SPF2_MULTI_FREEMAIL': (
        'Multiple SPF TXT on freemail path (informational).',
        'Несколько SPF TXT на пути freemail (информационно).',
    ),
    'SPF2_SOFTFAIL': (
        'The domain’s SPF TXT does not list the outbound IP (or include) that sent this message — the check did not pass and ended in softfail.',
        'В SPF TXT домена нет исходящего IP (или include), с которого ушло письмо — проверка не дала pass и закончилась softfail.',
    ),
    'SPF2_SOFTFAIL_FREEMAIL': (
        'SPF softfail on freemail path (informational).',
        'SPF softfail на пути freemail (информационно).',
    ),
    'SPF2_TEMPERROR': (
        'SPF temporary DNS error.',
        'Временная DNS-ошибка SPF.',
    ),
    'STS1_MISSING': (
        'No MTA-STS DNS record.',
        'Нет DNS-записи MTA-STS.',
    ),
    'STS1_MULTI': (
        'More than one MTA-STS TXT (v=STSv1) is published.',
        'Опубликовано больше одной MTA-STS TXT (v=STSv1).',
    ),
    'STS1_OK': (
        'Check result: mTA-STS DNS record present.',
        'Результат проверки: dNS-запись MTA-STS есть.',
    ),
    'SUB1_EMPTY': (
        'Empty subject.',
        'Пустая тема.',
    ),
    'SUB2_CAPS': (
        'Subject mostly UPPERCASE.',
        'Тема почти полностью ЗАГЛАВНЫМИ.',
    ),
    'SUB2_OK': (
        'Check result: subject casing looks fine.',
        'Результат проверки: регистр темы в порядке.',
    ),
    'SUB3_MANY': (
        'Many punctuation marks in subject.',
        'Много знаков препинания в теме.',
    ),
    'SUB3_OK': (
        'Check result: subject punctuation looks fine.',
        'Результат проверки: знаки препинания в теме в порядке.',
    ),
    'SUB4_OK': (
        'Check result: no spam-like words in subject.',
        'Результат проверки: в теме нет явных спам-слов.',
    ),
    'SUB4_SPAM': (
        'Spam-like words in subject.',
        'Спам-слова в теме.',
    ),
    'TLSRPT1_MISSING': (
        'No TLS-RPT DNS record.',
        'Нет DNS-записи TLS-RPT.',
    ),
    'TLSRPT1_MULTI': (
        'More than one TLS-RPT TXT (v=TLSRPTv1) is published.',
        'Опубликовано больше одной TLS-RPT TXT (v=TLSRPTv1).',
    ),
    'TLSRPT1_OK': (
        'Check result: tLS-RPT DNS record present.',
        'Результат проверки: dNS-запись TLS-RPT есть.',
    ),
    'UA1_MISSING': (
        'No User-Agent / X-Mailer.',
        'Нет User-Agent / X-Mailer.',
    ),
    'UA1_NO_VERSION': (
        'Mailer string has no version.',
        'В строке почтовой программы нет версии.',
    ),
    'UA1_VERSION': (
        'Mailer string has a version.',
        'В строке почтовой программы есть версия.',
    ),
}
