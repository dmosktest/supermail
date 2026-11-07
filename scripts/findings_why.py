# -*- coding: utf-8 -*-
"""Human 'why this matters for spam' copy (en/ru). Other locales fall back to English in the generator."""
from __future__ import annotations

# code -> (why_en, why_ru)
WHY: dict[str, tuple[str, str]] = {
    "PARSE1": (
        "If the message cannot be parsed, filters treat it as malformed junk and often reject or quarantine it.",
        "Если письмо нельзя разобрать, фильтры считают его битым мусором и часто отклоняют или кладут в карантин.",
    ),
    "SUB1_EMPTY": (
        "Empty subjects are rare in normal mail and common in bulk/botnet blasts, so filters raise the spam score.",
        "Пустая тема редко бывает у нормальной почты и часто у массовых рассылок — фильтры поднимают спам-балл.",
    ),
    "SUB2_CAPS": (
        "ALL-CAPS subjects look like shouty ads; spam engines have long weighted this pattern.",
        "Тема ЗАГЛАВНЫМИ выглядит как крикливая реклама — спам-фильтры давно учитывают этот паттерн.",
    ),
    "SUB2_OK": (
        "Normal capitalization looks like a real person wrote the subject, which lowers suspicion.",
        "Обычный регистр темы похож на письмо от человека и снижает подозрение.",
    ),
    "SUB3_MANY": (
        "Lots of !!! / ??? in the subject is a classic hard-sell spam signal.",
        "Много !!! / ??? в теме — классический сигнал агрессивной рекламы.",
    ),
    "SUB3_OK": (
        "Moderate punctuation does not trigger the “shouty promo” heuristics.",
        "Умеренные знаки препинания не срабатывают как «крикливая реклама».",
    ),
    "SUB4_SPAM": (
        "Words like “free”, “winner”, “act now” appear far more often in spam than in legitimate mail.",
        "Слова вроде «бесплатно», «выигрыш», «срочно» в теме гораздо чаще у спама, чем у нормальной почты.",
    ),
    "SUB4_OK": (
        "The subject avoids well-known spam vocabulary that filters score heavily.",
        "В теме нет известной спам-лексики, за которую фильтры сильно штрафуют.",
    ),
    "CNT1_IMAGE": (
        "Image-only HTML hides text from scanners and is a frequent phishing/spam layout.",
        "Письмо почти из картинки прячет текст от сканеров — типичная вёрстка спама и фишинга.",
    ),
    "CNT1_TEXT": (
        "A real text body lets filters and clients read the message; spam often ships HTML-only or image-only.",
        "Текстовое тело читают и фильтры, и клиенты; у спама часто только HTML или картинка.",
    ),
    "CNT1_HTML": (
        "Missing text/plain looks automated and blocks some accessibility/filter paths.",
        "Без text/plain письмо выглядит автоматизированным и хуже проходит часть фильтров.",
    ),
    "CNT2_SPAM": (
        "Repeated spam vocabulary in the body is one of the oldest content-based spam signals.",
        "Повтор спам-слов в теле — один из самых старых контентных сигналов спама.",
    ),
    "CNT2_OK": (
        "Body wording does not match common spam lexicons used by filters.",
        "Текст тела не совпадает с типичными спам-словарями фильтров.",
    ),
    "CNT3_SHORT": (
        "Public shorteners (bit.ly and friends) hide the real URL and are heavily abused in spam.",
        "Публичные короткие ссылки (bit.ly и т.п.) прячут URL и массово используются в спаме.",
    ),
    "CNT3_OK": (
        "No known shortener domains means less “hidden link” risk for filters.",
        "Нет известных shortener-доменов — меньше риска «скрытой ссылки» для фильтров.",
    ),
    "CNT4_SCRIPT": (
        "script/iframe/embed in mail HTML is almost never needed and is treated as hostile content.",
        "script/iframe/embed в HTML письма почти никогда не нужны и считаются враждебным контентом.",
    ),
    "CNT4_CLEAN": (
        "Clean HTML without active embeds looks safer to content filters.",
        "Чистый HTML без активных вставок выглядит безопаснее для контент-фильтров.",
    ),
    "CNT4_NOHTML": (
        "No HTML part means there is nothing risky to scan in markup.",
        "Нет HTML — нечего сканировать на опасную разметку.",
    ),
    "CNT5_EMPTY": (
        "An empty body is unusual for real correspondence and common in probe/spam traffic.",
        "Пустое тело редко у настоящей переписки и часто у пробного/спам-трафика.",
    ),
    "CNT5_OK": (
        "Non-empty body is the baseline expectation for deliverable mail.",
        "Непустое тело — базовое ожидание для нормальной доставки.",
    ),
    "CNT6_NOIMG": (
        "No images simply avoids image-based spam tricks.",
        "Без картинок нет и типичных image-спам приёмов.",
    ),
    "CNT6_NOALT": (
        "Images without ALT are a spam/phish pattern and also hurt accessibility scoring.",
        "Картинки без ALT — паттерн спама/фишинга и минус за доступность.",
    ),
    "CNT6_ALT": (
        "ALT text shows the message was composed carefully, not as a pure image blast.",
        "ALT показывает, что письмо собрали аккуратно, а не как чистый image-спам.",
    ),
    "MIME1_KNOWN": (
        "A familiar Content-Type is what MUAs and filters expect.",
        "Привычный Content-Type — то, что ждут почтовые клиенты и фильтры.",
    ),
    "MIME1_HTML": (
        "Declaring HTML without a proper multipart structure can look odd to strict filters.",
        "HTML без нормальной multipart-структуры может выглядеть странно для строгих фильтров.",
    ),
    "MIME1_UNUSUAL": (
        "Exotic Content-Type values are rare in legit mail and raise automated suspicion.",
        "Экзотический Content-Type редко у нормальной почты и повышает автоподозрение.",
    ),
    "MIME2_BOTH": (
        "text + HTML alternatives is the standard for trustworthy marketing/transactional mail.",
        "text + HTML — стандарт для нормальной рассылки и транзакционных писем.",
    ),
    "MIME2_HTML_ONLY": (
        "HTML without text/plain is a common bulk-mail shortcut that filters dislike.",
        "HTML без text/plain — частый «хак» массовых рассылок, который фильтры не любят.",
    ),
    "MIME2_TEXT_ONLY": (
        "Text-only is fine for humans; some campaigns still prefer a matching HTML part.",
        "Только текст нормален для людей; части рассылок всё же ждут парный HTML.",
    ),
    "MIME2_OK": (
        "MIME layout is within what receivers commonly accept.",
        "MIME-структура в пределах того, что обычно принимают получатели.",
    ),
    "ADDR1_FREEMAIL": (
        "Personal freemail (Mail.ru, Gmail…) is normal and usually fine. This is only a note for company or bulk mail: filters trust your own domain more for that.",
        "Личный freemail (Mail.ru, Gmail…) — норма и обычно не проблема. Это лишь заметка для корпоративной или массовой почты: для неё фильтры больше доверяют своему домену.",
    ),
    "ADDR1_OK": (
        "Sending From your own domain is what reputation systems expect for business mail.",
        "From со своего домена — то, что ждут системы репутации у деловой почты.",
    ),
    "ADDR2_FREEMAIL": (
        "Envelope on freemail matches how personal webmail works. For branded or bulk sending, use your domain’s MAIL FROM instead.",
        "Envelope на freemail — обычная схема личного вебмейла. Для брендовой или массовой отправки лучше MAIL FROM своего домена.",
    ),
    "ADDR2_OK": (
        "Envelope domain looks like a proper sending domain, not a free webmail box.",
        "Домен envelope похож на нормальный отправитель, а не на бесплатный ящик.",
    ),
    "ADDR2_EMPTY": (
        "Empty MAIL FROM is used for bounces; for ordinary mail it can look like spoofing or a broken MTA.",
        "Пустой MAIL FROM бывает у bounce; у обычного письма это похоже на спуфинг или сломанный MTA.",
    ),
    "ADDR3_MATCH": (
        "Matching From and MAIL FROM make spoofing harder and help DMARC.",
        "Совпадение From и MAIL FROM усложняет спуфинг и помогает DMARC.",
    ),
    "ADDR3_DIFF": (
        "Header From ≠ envelope is a classic spoof/forward pattern that spam and phish abuse.",
        "From ≠ envelope — классика спуфинга/форварда, которой пользуются спам и фишинг.",
    ),
    "ADDR4_DN": (
        "A display name is normal; filters still check it is not impersonating a brand.",
        "Display name — норма; фильтры всё равно смотрят, не маскируется ли под бренд.",
    ),
    "ADDR4_NO_DN": (
        "Missing display name is not fatal, just slightly less “human” looking.",
        "Нет display name — не катастрофа, просто чуть менее «человеческий» вид.",
    ),
    "ADDR5_NUMS": (
        "Names like 123dima… are extremely common on freemail and do not mean you are spam. Fresh throwaway bots often look similar, so we only flag it as a soft note.",
        "Имена вроде 123dima… на freemail очень обычны и сами по себе не делают письмо спамом. Похожий вид бывает у одноразовых ботов, поэтому это лишь мягкая заметка.",
    ),
    "ADDR5_OK": (
        "Local-part does not look like a generated spam mailbox name.",
        "Local-part не похож на сгенерированное спам-имя ящика.",
    ),
    "ADDR6_DIGIT": (
        "A trailing digit in a freemail login is everyday practice. Abuse datasets also have many such names, but for a long-lived personal mailbox this is not a red flag.",
        "Цифра в конце freemail-логина — повседневная практика. В abuse-выборках таких имён тоже много, но для давно существующего личного ящика это не красный флаг.",
    ),
    "ADDR6_OK": (
        "Envelope username does not match the “digits tacked on” freemail abuse pattern.",
        "Имя в envelope не похоже на freemail-паттерн «с цифрой на конце».",
    ),
    "RCPT1_ONE": (
        "One visible recipient is normal for personal and most transactional mail.",
        "Один получатель — норма для личной и большей части транзакционной почты.",
    ),
    "RCPT1_FEW": (
        "A small To/Cc list is usually fine for human correspondence.",
        "Небольшой To/Cc обычно нормален для переписки людей.",
    ),
    "RCPT1_NONE": (
        "No To/Cc can mean BCC-only bulk mail, which filters watch closely.",
        "Нет To/Cc часто значит рассылку через BCC — фильтры это внимательно смотрят.",
    ),
    "RCPT1_MANY": (
        "Long To/Cc lists look like scraped address-book spam.",
        "Длинный To/Cc похож на спам по чужой адресной книге.",
    ),
    "RCPT2_NO_DN": (
        "Recipients without display names is neutral for spam scoring.",
        "Получатели без display name для спам-балла нейтральны.",
    ),
    "RCPT2_SOME_DN": (
        "Some recipient display names is ordinary and not a spam red flag.",
        "Часть получателей с display name — обычно и не красный флаг спама.",
    ),
    "MID1_MISSING": (
        "Missing Message-ID breaks threading and is common in poorly written spam bots.",
        "Без Message-ID ломается переписка; так часто шлют кривые спам-боты.",
    ),
    "MID1_OK": (
        "Message-ID present is what RFC-compliant MTAs always add.",
        "Message-ID есть — так делают нормальные MTA по RFC.",
    ),
    "MID2_MATCH": (
        "Message-ID domain matching From supports a coherent sender identity.",
        "Домен Message-ID = From поддерживает цельную личность отправителя.",
    ),
    "MID2_DIFF": (
        "Message-ID from another domain can mean forwarding or a sloppy/spammy generator.",
        "Message-ID с другого домена бывает при форварде или у неаккуратного/спам-генератора.",
    ),
    "DATE1_MISSING": (
        "No Date header violates basic mail norms and looks automated.",
        "Нет Date — нарушение базовых норм почты, выглядит автоматизацией.",
    ),
    "DATE1_BAD": (
        "Unparseable Date confuses clients and scoring engines alike.",
        "Неразбираемый Date путает и клиенты, и скоринговые движки.",
    ),
    "DATE1_FUTURE": (
        "Future dates are a known spam trick to stick messages at the top of the inbox.",
        "Дата из будущего — известный трюк спама, чтобы письмо было «сверху» во входящих.",
    ),
    "DATE1_OLD": (
        "Very old Date values look replayed or forged.",
        "Очень старая Date похожа на повтор или подделку.",
    ),
    "DATE1_OK": (
        "A sensible Date is expected by every modern mail path.",
        "Разумная Date — ожидание любого современного почтового пути.",
    ),
    "UA1_MISSING": (
        "No User-Agent/X-Mailer is common for raw SMTP scripts used in spam.",
        "Нет User-Agent/X-Mailer часто у сырых SMTP-скриптов спамеров.",
    ),
    "UA1_VERSION": (
        "A mailer string with a version looks like a real client or ESP.",
        "Строка клиента с версией похожа на настоящий клиент или ESP.",
    ),
    "UA1_NO_VERSION": (
        "A real client like Thunderbird is fine even without a version digit in the short string. This is only a soft note, not a spam verdict.",
        "Настоящий клиент вроде Thunderbird нормален, даже если в короткой строке нет цифры версии. Это лишь мягкая заметка, не приговор спаму.",
    ),
    "RCVD1_NONE": (
        "Internet mail almost always has Received hops; none looks forged or local-only junk.",
        "У интернет-почты почти всегда есть Received; их нет — похоже на подделку или локальный мусор.",
    ),
    "RCVD1_ONE": (
        "One Received hop is normal for a short path into this test inbox.",
        "Один Received — нормально для короткого пути до тестового ящика.",
    ),
    "RCVD1_TWO": (
        "Two hops is a common, healthy relay path.",
        "Два хопа — обычный здоровый путь через реле.",
    ),
    "RCVD1_OK": (
        "Received hop count is in a believable range.",
        "Число Received в правдоподобном диапазоне.",
    ),
    "RCVD1_MANY": (
        "Very many Received lines can mean open relays or spam laundering paths.",
        "Очень много Received может значить open relay или «стирку» спама.",
    ),
    "RCVD2_TLS": (
        "We saw a real STARTTLS session on delivery into this test inbox — stronger than guessing from Received text alone.",
        "Мы видели реальный STARTTLS при доставке в этот тестовый ящик — надёжнее, чем гадать по тексту Received.",
    ),
    "RCVD2_NO_TLS": (
        "Cleartext into this tester often means the provider skipped STARTTLS to our self-signed cert — not that Mail.ru/Gmail never use TLS on the internet.",
        "Cleartext до этого тестера часто значит, что провайдер пропустил STARTTLS из‑за нашего самоподписанного сертификата — а не что Mail.ru/Gmail «никогда не шлют по TLS».",
    ),
    "RCVD3_AUTH": (
        "Authenticated submission in Received shows the message entered via a controlled account.",
        "Authenticated в Received показывает, что письмо вошло через контролируемый аккаунт.",
    ),
    "RCVD3_NO_AUTH": (
        "No auth mark is not always bad, but auth helps prove a legitimate submission path.",
        "Нет метки auth не всегда плохо, но auth помогает доказать легитимный вход.",
    ),
    "ARC1_OK": (
        "ARC helps surviving forwards so authentication results stay trustworthy.",
        "ARC помогает при пересылках сохранить доверие к результатам аутентификации.",
    ),
    "ARC1_NA": (
        "No ARC is normal for direct delivery; it matters more after mailing-list forwards.",
        "Без ARC при прямой доставке нормально; важнее после форвардов через списки.",
    ),
    "LIST1_OK": (
        "List-Unsubscribe is required-ish for bulk mail and reduces “spam complaint” risk.",
        "List-Unsubscribe почти обязателен для массовой почты и снижает риск жалоб на спам.",
    ),
    "LIST1_NA": (
        "No List-Unsubscribe is fine for one-to-one mail; for newsletters filters expect it.",
        "Без List-Unsubscribe ок для личной почты; у рассылок фильтры его ждут.",
    ),
    "AUTH1_NA": (
        "Without Authentication-Results we only see DNS records, not what the receiver verified.",
        "Без Authentication-Results видны только DNS-записи, но не то, что проверил получатель.",
    ),
    "AUTH1_SPF_PASS": (
        "SPF pass means the sending IP was authorized for the envelope domain — a core anti-spoof check.",
        "SPF pass значит: IP отправителя разрешён для домена envelope — базовая защита от спуфинга.",
    ),
    "AUTH1_SPF_FAIL": (
        "SPF fail means the connecting IP was not allowed for that domain — a real auth miss, not a soft ~all quirk.",
        "SPF fail значит: IP не был разрешён для этого домена — реальный провал auth, не нюанс ~all.",
    ),
    "AUTH2_DKIM_PASS": (
        "DKIM pass proves the body/headers were signed by a key published for the domain.",
        "DKIM pass доказывает: тело/заголовки подписаны ключом, опубликованным для домена.",
    ),
    "AUTH2_DKIM_FAIL": (
        "Broken DKIM looks like tampering or a misconfigured signer — filters punish both.",
        "Сломанный DKIM похож на подмену или кривой сайнер — фильтры штрафуют оба случая.",
    ),
    "AUTH3_DMARC_PASS": (
        "DMARC pass means SPF/DKIM domains match From — the main brand-protection signal.",
        "DMARC pass значит домены SPF/DKIM совпадают с From — главный сигнал защиты бренда.",
    ),
    "AUTH3_DMARC_FAIL": (
        "DMARC fail tells receivers From was not confirmed by SPF/DKIM — often spam or spoof.",
        "DMARC fail говорит получателю: домен From не подтверждён SPF/DKIM — часто спам или спуф.",
    ),
    "SPF1_NO_DOMAIN": (
        "Without a domain we cannot publish SPF, so receivers cannot authorize your IPs.",
        "Без домена нельзя опубликовать SPF — получатели не смогут авторизовать ваши IP.",
    ),
    "SPF1_MISSING": (
        "Without SPF receivers cannot tell which hosts may send as your domain — publish a record and aim for pass from your outbound IP.",
        "Без SPF получатели не видят, каким хостам можно слать от вашего домена — опубликуйте запись и добейтесь pass с исходящего IP.",
    ),
    "SPF1_PLUSALL": (
        "+all authorizes the whole internet — filters treat that as “SPF is useless / suspicious”.",
        "+all разрешает весь интернет — для фильтров это «SPF бесполезен / подозрителен».",
    ),
    "SPF1_OK": (
        "An SPF record lets receivers check whether the connecting IP may use your domain.",
        "SPF-запись позволяет проверить, имеет ли IP право слать от вашего домена.",
    ),
    "DMARC1_MISSING": (
        "No DMARC means receivers have no policy for spoofed From on your domain.",
        "Без DMARC у получателей нет политики на поддельный From вашего домена.",
    ),
    "DMARC1_REJECT": (
        "p=reject tells receivers to drop spoofed mail — strong positive for domain trust.",
        "p=reject велит отбрасывать спуф — сильный плюс к доверию домена.",
    ),
    "DMARC1_QUAR": (
        "p=quarantine is a solid middle step while you monitor spoofing reports.",
        "p=quarantine — нормальный средний шаг, пока смотрите отчёты о спуфинге.",
    ),
    "DMARC1_NONE": (
        "p=none only monitors; it does not stop spoofed mail from reaching inboxes.",
        "p=none только мониторит и не мешает спуфу доходить до ящиков.",
    ),
    "DKIM1_MISSING": (
        "No DKIM is common and milder than a broken signature — mail still delivers; add DKIM when you can, but do not invent a bad one.",
        "Без DKIM почта часто ходит нормально; это мягче, чем сломанная подпись. Имеет смысл добавить DKIM, но кривую подпись лучше не публиковать.",
    ),
    "DKIM1_OK": (
        "A DKIM-Signature header is the starting point for body integrity checks.",
        "Заголовок DKIM-Signature — старт проверки целостности письма.",
    ),
    "DKIM2_TRACE": (
        "Selector/domain in the signature show which DNS key should validate the mail.",
        "Selector/домен в подписи показывают, какой DNS-ключ должен проверить письмо.",
    ),
    "DKIM3_DNS_OK": (
        "Published DKIM key in DNS is required for receivers to verify the signature.",
        "Ключ DKIM в DNS нужен, чтобы получатели могли проверить подпись.",
    ),
    "DKIM3_DNS_MISSING": (
        "Signature without a DNS key is worthless — filters see broken authentication.",
        "Подпись без ключа в DNS бесполезна — фильтры видят сломанную аутентификацию.",
    ),
    "DKIM4_PASS": (
        "Crypto-verified DKIM proves the signed parts were not altered in transit.",
        "Криптопроверка DKIM доказывает, что подписанные части не меняли в пути.",
    ),
    "DKIM4_FAIL": (
        "A broken DKIM signature looks like tampering or a misconfigured signer.",
        "Сломанная DKIM-подпись выглядит как подмена или кривой сайнер.",
    ),
    "DKIM4_ERROR": (
        "Verifier could not finish the crypto check — treat as inconclusive, not a green light.",
        "Верификатор не закончил криптопроверку — это не зелёный свет.",
    ),
    "SPF2_PASS": (
        "We evaluated the SPF policy against the connecting IP — pass means this host may send for the domain.",
        "Мы проверили SPF по IP соединения — pass значит, хост может слать за домен.",
    ),
    "SPF2_FAIL": (
        "SPF fail means the sending IP is not authorized for the domain — a real auth problem, stronger than softfail.",
        "SPF fail значит: IP не авторизован для домена — реальная проблема auth, сильнее softfail.",
    ),
    "SPF2_SOFTFAIL": (
        "Until the outbound IP is in the SPF TXT, the domain does not vouch for this server. Softfail is milder than fail, but it is still not a pass — filters trust the message less.",
        "Пока исходящего IP нет в SPF TXT, домен не подтверждает этот сервер. Softfail слабее fail, но это всё равно не pass — фильтры доверяют письму меньше.",
    ),
    "SPF2_SOFTFAIL_FREEMAIL": (
        "On freemail this usually reflects the provider’s SPF tree, not a mistake in your Thunderbird settings.",
        "На freemail это обычно дерево SPF провайдера, а не ошибка в настройках Thunderbird.",
    ),
    "SPF2_NEUTRAL": (
        "SPF neutral is “no assertion” for this IP — not the same as fail, and we do not treat it as a hard spam signal.",
        "SPF neutral — «нет утверждения» для этого IP, это не fail; жёстким спам-сигналом мы это не считаем.",
    ),
    "SPF2_NEUTRAL_FREEMAIL": (
        "Mail.ru/Gmail SPF is huge and often yields neutral on a test hop — that is their infrastructure, not your bug.",
        "SPF Mail.ru/Gmail огромный и на тестовом хопе часто даёт neutral — это их инфраструктура, не ваш баг.",
    ),
    "SPF2_FAIL_FREEMAIL": (
        "A local SPF fail against freemail often means incomplete eval of the provider’s record, not that you misconfigured outbound mail.",
        "Локальный SPF fail на freemail часто значит неполный разбор записи провайдера, а не кривую исходящую настройку у вас.",
    ),
    "SPF2_NONE": (
        "Without an evaluable SPF result we cannot confirm the sending IP is authorized.",
        "Без оцениваемого SPF нельзя подтвердить, что IP уполномочен.",
    ),
    "SPF2_TEMPERROR": (
        "Temporary DNS issues during SPF lookup can delay or soft-reject delivery.",
        "Временные DNS-сбои при SPF могут задержать или мягко отклонить доставку.",
    ),
    "SPF2_PERMERROR": (
        "A permanently broken SPF record is treated as authentication failure by careful receivers.",
        "Битый SPF осторожные получатели считают провалом аутентификации.",
    ),
    "SPF2_PERMERROR_FREEMAIL": (
        "We could not fully parse the freemail provider’s SPF — informational only for personal mail.",
        "Не удалось полностью разобрать SPF freemail-провайдера — для личной почты только информация.",
    ),
    "DMARC2_ALIGN_PASS": (
        "DMARC checks that SPF or DKIM covers the same domain as the visible From — the key anti-spoof check.",
        "DMARC проверяет, что SPF или DKIM относятся к тому же домену, что и видимый From — главный антиспуф-сигнал.",
    ),
    "DMARC2_ALIGN_FAIL": (
        "Neither SPF nor DKIM confirms the From domain — with p=quarantine/reject receivers may quarantine or reject. Fix domain match on MAIL FROM or DKIM d=; missing DKIM alone does not zero the grade.",
        "Ни SPF, ни DKIM не подтверждают домен From — при p=quarantine/reject получатель может карантинировать или отклонять. Сделайте совпадение домена в MAIL FROM или в DKIM d=; отсутствие DKIM само по себе не обнуляет оценку.",
    ),
    "DMARC2_ALIGN_NA": (
        "Not enough SPF/DKIM data to judge whether From is confirmed for this message.",
        "Недостаточно данных SPF/DKIM, чтобы понять, подтверждён ли домен From для этого письма.",
    ),
    "DMARC3_RUA": (
        "Aggregate rua reports show who is sending as your domain — essential before enforce.",
        "Агрегатные rua-отчёты показывают, кто шлёт от вашего домена — нужны до enforce.",
    ),
    "DMARC3_RUA_MISSING": (
        "Without rua you fly blind when moving DMARC to quarantine/reject.",
        "Без rua вы слепы при переходе DMARC на quarantine/reject.",
    ),
    "DMARC3_RUF": (
        "Failure reports (ruf) are optional forensic detail for hard fails.",
        "Отчёты о сбоях (ruf) — опциональная детализация жёстких fail.",
    ),
    "DMARC3_OPTS": (
        "aspf/adkim/sp/pct control how strict domain matching and subdomain policy are.",
        "aspf/adkim/sp/pct задают, насколько строго домены должны совпадать, и политику поддоменов.",
    ),
    "STS1_OK": (
        "MTA-STS helps receiving MTAs insist on TLS for your domain.",
        "MTA-STS помогает принимающим MTA требовать TLS для вашего домена.",
    ),
    "STS1_MISSING": (
        "Without MTA-STS some paths may still downgrade to cleartext SMTP.",
        "Без MTA-STS часть путей всё ещё может уйти в SMTP без TLS.",
    ),
    "TLSRPT1_OK": (
        "TLS-RPT gives you reports when others fail TLS to your MX.",
        "TLS-RPT даёт отчёты, когда у других ломается TLS до вашего MX.",
    ),
    "TLSRPT1_MISSING": (
        "No TLS-RPT means you will not see aggregate TLS failure reports.",
        "Без TLS-RPT вы не увидите агрегатные отчёты о сбоях TLS.",
    ),
    "BIMI1_OK": (
        "BIMI can show a brand mark in supporting clients when DMARC is enforced.",
        "BIMI может показать бренд в поддерживающих клиентах при жёстком DMARC.",
    ),
    "BIMI1_MISSING": (
        "BIMI is optional cosmetics — not required for deliverability, but useful for brand trust.",
        "BIMI — опциональный бренд-знак, не обязателен для доставки, но полезен для доверия.",
    ),
    "MX1_MISSING": (
        "A sending domain without MX looks incomplete; some checkers note it, but missing MX alone rarely decides spam vs inbox.",
        "Домен шлёт почту без MX — выглядит незавершённым; часть чекеров это отмечают, но само по себе почти не решает спам vs inbox.",
    ),
    "MX1_OK": (
        "MX present means the From domain can also receive mail — normal for real domains.",
        "MX есть — домен From может и принимать почту, как у нормальных доменов.",
    ),
    "HELO1_EMPTY": (
        "Empty HELO/EHLO violates SMTP norms and is common in crude spam scripts.",
        "Пустой HELO/EHLO нарушает SMTP и типичен для грубых спам-скриптов.",
    ),
    "HELO1_IP_MATCH": (
        "HELO equal to the client IP is acceptable for some MTAs, though a hostname is nicer.",
        "HELO = IP клиента для части MTA приемлем, но hostname предпочтительнее.",
    ),
    "HELO1_IP": (
        "HELO as a bare IP that is not the client often looks forged.",
        "HELO голым IP, который не клиент, часто выглядит подделкой.",
    ),
    "HELO1_LOCAL": (
        "localhost/localdomain HELO is a classic misconfigured or spammy sender fingerprint.",
        "HELO localhost/localdomain — классика кривой настройки или спам-отпечаток.",
    ),
    "HELO1_HOST": (
        "A real HELO hostname is what receivers expect from a proper MTA.",
        "Настоящий hostname в HELO — ожидание нормального MTA.",
    ),
    "HELO2_NOA": (
        "HELO that does not resolve cannot be tied to infrastructure — spam bots do this a lot.",
        "HELO без DNS нельзя привязать к инфраструктуре — так часто делают спам-боты.",
    ),
    "HELO2_A": (
        "Resolvable HELO shows the SMTP name exists in DNS.",
        "Резолвящийся HELO показывает, что SMTP-имя существует в DNS.",
    ),
    "HELO2_MATCH": (
        "HELO resolving to the connecting IP is a strong “this server is who it claims” signal.",
        "HELO резолвится в IP соединения — сильный сигнал «сервер тот, за кого себя выдаёт».",
    ),
    "HELO2_MISMATCH": (
        "HELO pointing elsewhere than the client IP looks like open proxy or identity mismatch.",
        "HELO указывает не на IP клиента — похоже на open proxy или рассинхрон личности.",
    ),
    "BL1_LISTED": (
        "Inbox providers often reject or junk mail from listed IPs. Fix the cause, then delist on each list — links are in the report.",
        "Провайдеры часто режут или кладут в спам письма с такого IP. Уберите причину и снимите IP с каждого списка — ссылки в отчёте.",
    ),
    "BL1_CLEAN": (
        "Not listed on major DNSBLs is a baseline requirement for good delivery.",
        "Нет в основных DNSBL — базовое требование для нормальной доставки.",
    ),
    "PTR1_OK": (
        "Reverse DNS proves the IP has an operator-assigned name — spam zombies often lack PTR.",
        "PTR показывает, что у IP есть имя от оператора; у спам-зомби PTR часто нет.",
    ),
    "PTR1_MISSING": (
        "No PTR is one of the strongest “don’t trust this SMTP client” signals.",
        "Нет PTR — один из самых сильных сигналов «этому SMTP-клиенту нельзя доверять».",
    ),
    "PTR2_MATCH": (
        "PTR matching HELO is the classic “consistent SMTP identity” check used by big receivers.",
        "PTR = HELO — классическая проверка «цельной SMTP-личности» у крупных получателей.",
    ),
    "PTR2_MISMATCH": (
        "PTR≠HELO looks like a rented/compromised host or lazy reverse DNS — spam score goes up.",
        "PTR≠HELO похоже на чужой/взломанный хост или ленивый rDNS — спам-балл растёт.",
    ),
}
