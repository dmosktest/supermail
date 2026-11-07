import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "src");
const LOCALES = ["ru","en","zh","es","hi","ar","bn","pt","fr","de","ja","id","pa","jv","te","tr","ko","mr","vi","ta","it","fa","tlh"];

const ui = {
  langSwitch: { en:"Site language", ru:"Язык сайта", zh:"网站语言", es:"Idioma del sitio", hi:"साइट की भाषा", ar:"لغة الموقع", bn:"সাইটের ভাষা", pt:"Idioma do site", fr:"Langue du site", de:"Website-Sprache", ja:"サイトの言語", id:"Bahasa situs", pa:"ਸਾਈਟ ਦੀ ਭਾਸ਼ਾ", jv:"Basa situs", te:"సైట్ భాష", tr:"Site dili", ko:"사이트 언어", mr:"साइटची भाषा", vi:"Ngôn ngữ trang", ta:"தள மொழி", it:"Lingua del sito", fa:"زبان سایت", tlh:"jan Hol" },
  noscript: { en:"Enable JavaScript to create a test inbox and run the spam test. The guide and FAQ below work without JavaScript.", ru:"Включите JavaScript, чтобы создать тестовый ящик и запустить спам-тест. Гайд и FAQ ниже читаются и без JavaScript.", zh:"请启用 JavaScript 以创建测试收件箱并运行垃圾邮件测试。下方指南与 FAQ 无需 JS 即可阅读。", es:"Active JavaScript para crear el buzón de prueba. La guía y el FAQ de abajo funcionan sin JavaScript.", pt:"Ative o JavaScript para criar a caixa de teste. O guia e o FAQ abaixo funcionam sem JavaScript.", fr:"Activez JavaScript pour créer la boîte de test. Le guide et la FAQ ci-dessous fonctionnent sans JavaScript.", de:"Aktivieren Sie JavaScript für das Testpostfach. Leitfaden und FAQ darunter funktionieren ohne JavaScript.", ja:"テスト用受信箱とスパムテストには JavaScript が必要です。下のガイドと FAQ は JS なしで読めます。" },
  inboxLead: { en:"Send any email here. You get an A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, headers and content — plus Print/PDF and AI/admin briefs.", ru:"Отправьте любое письмо сюда. Оценка A–F: крипто-DKIM, SPF по IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, заголовки и контент — плюс Печать/PDF и ТЗ для ИИ и админа почты.", zh:"向此地址发送任意邮件。A–F：加密 DKIM、按 IP 的 SPF、DMARC alignment、MTA-STS/TLS-RPT/BIMI、DNSBL、标头与内容，另有打印/PDF 与 AI/管理员任务书。", es:"Envíe cualquier correo aquí. Nota A–F: DKIM crypto, SPF por IP, alineación DMARC, MTA-STS/TLS-RPT/BIMI, DNSBL, cabeceras y contenido — más Imprimir/PDF y briefs IA/admin.", pt:"Envie qualquer e-mail aqui. Nota A–F: DKIM crypto, SPF por IP, alinhamento DMARC, MTA-STS/TLS-RPT/BIMI, DNSBL, cabeçalhos e conteúdo — mais Imprimir/PDF e briefs IA/admin.", fr:"Envoyez un e-mail ici. Note A–F : DKIM crypto, SPF par IP, alignement DMARC, MTA-STS/TLS-RPT/BIMI, DNSBL, en-têtes et contenu — plus Imprimer/PDF et briefs IA/admin.", de:"Senden Sie hier eine E-Mail. Note A–F: DKIM-Crypto, SPF nach IP, DMARC-Alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, Header und Inhalt — plus Drucken/PDF und KI-/Admin-Briefs.", ja:"ここにメールを送ると A–F：暗号 DKIM、IP ベース SPF、DMARC alignment、MTA-STS/TLS-RPT/BIMI、DNSBL、ヘッダーと本文。印刷/PDF と AI／管理者ブリーフ付き。" },
  yourAddress: { en:"Your test address — send a message to it from the mail server you want to check", ru:"Ваш тестовый адрес — отправьте на него письмо с сервера, который нужно проверить", zh:"您的测试地址 — 请从待测邮件服务器向此地址发信", es:"Su dirección de prueba — envíe un correo desde el servidor que quiera comprobar", hi:"आपका परीक्षण पता — जिस मेल सर्वर की जाँच करनी है, वहाँ से यहाँ पत्र भेजें", ar:"عنوان الاختبار — أرسل إليه رسالة من الخادم الذي تريد فحصه", bn:"আপনার পরীক্ষার ঠিকানা — যে মেইল সার্ভার পরীক্ষা করবেন, সেখান থেকে এখানে চিঠি পাঠান", pt:"Seu endereço de teste — envie um e-mail do servidor que deseja verificar", fr:"Votre adresse de test — envoyez-y un message depuis le serveur à contrôler", de:"Ihre Testadresse — senden Sie eine Mail vom zu prüfenden Server hierher", ja:"テスト用アドレス — 確認したいメールサーバーからここに送信してください", id:"Alamat tes Anda — kirim email dari server yang ingin diperiksa", pa:"ਤੁਹਾਡਾ ਟੈਸਟ ਪਤਾ — ਜਿਸ ਮੇਲ ਸਰਵਰ ਦੀ ਜਾਂਚ ਕਰਨੀ ਹੈ, ਉੱਥੋਂ ਇੱਥੇ ਪੱਤਰ ਭੇਜੋ", jv:"Alamat tes sampeyan — kirim email saka server sing arep dicek", te:"మీ పరీక్ష చిరునామా — పరిశీలించాల్సిన మెయిల్ సర్వర్ నుండి ఇక్కడకు పంపండి", tr:"Test adresiniz — kontrol etmek istediğiniz sunucudan buraya bir e-posta gönderin", ko:"테스트 주소 — 점검할 메일 서버에서 이곳으로 메일을 보내세요", mr:"तुमचा चाचणी पत्ता — तपासायच्या मेल सर्व्हरवरून येथे पत्र पाठवा", vi:"Địa chỉ kiểm tra — gửi thư từ máy chủ cần kiểm tra tới đây", ta:"உங்கள் சோதனை முகவரி — சோதிக்க வேண்டிய அஞ்சல் சேவையகத்திலிருந்து இங்கே அனுப்புங்கள்", it:"Il tuo indirizzo di test — invia un messaggio dal server di posta da verificare", fa:"نشانی آزمایشی شما — از سروری که می‌خواهید بررسی کنید به اینجا نامه بفرستید", tlh:"chov ID — QIn yIngeH" },
  copy: { en:"Copy", ru:"Копировать", zh:"复制", es:"Copiar", hi:"कॉपी", ar:"نسخ", bn:"কপি", pt:"Copiar", fr:"Copier", de:"Kopieren", ja:"コピー", id:"Salin", pa:"ਕਾਪੀ", jv:"Salin", te:"కాపీ", tr:"Kopyala", ko:"복사", mr:"कॉपी", vi:"Sao chép", ta:"நகல்", it:"Copia", fa:"کپی", tlh:"yIlan" },
  copied: { en:"Copied", ru:"Скопировано", zh:"已复制", es:"Copiado", hi:"कॉपी हो गया", ar:"تم النسخ", bn:"কপি হয়েছে", pt:"Copiado", fr:"Copié", de:"Kopiert", ja:"コピーしました", id:"Disalin", pa:"ਕਾਪੀ ਹੋ ਗਿਆ", jv:"Disalin", te:"కాపీ అయింది", tr:"Kopyalandı", ko:"복사됨", mr:"कॉपी झाले", vi:"Đã sao chép", ta:"நகலெடுக்கப்பட்டது", it:"Copiato", fa:"کپی شد", tlh:"lanlu'" },
  copyError: { en:"Could not copy", ru:"Не удалось скопировать", zh:"无法复制", es:"No se pudo copiar", hi:"कॉपी नहीं हो सका", ar:"تعذر النسخ", bn:"কপি করা যায়নি", pt:"Não foi possível copiar", fr:"Impossible de copier", de:"Kopieren fehlgeschlagen", ja:"コピーできませんでした", id:"Tidak bisa menyalin", pa:"ਕਾਪੀ ਨਹੀਂ ਹੋ ਸਕੀ", jv:"Ora bisa nyalin", te:"కాపీ కాలేదు", tr:"Kopyalanamadı", ko:"복사 실패", mr:"कॉपी झाले नाही", vi:"Không sao chép được", ta:"நகலெடுக்க முடியவில்லை", it:"Copia non riuscita", fa:"کپی نشد", tlh:"lanlaHbe'" },
  waiting: { en:"Waiting for your email…", ru:"Ждём ваше письмо…", zh:"正在等待您的邮件…", es:"Esperando su correo…", hi:"आपके ईमेल की प्रतीक्षा…", ar:"بانتظار رسالتك…", bn:"আপনার ইমেইলের অপেক্ষা…", pt:"Aguardando seu e-mail…", fr:"En attente de votre e-mail…", de:"Warten auf Ihre E-Mail…", ja:"メールを待っています…", id:"Menunggu email Anda…", pa:"ਤੁਹਾਡੀ ਈਮੇਲ ਦੀ ਉਡੀਕ…", jv:"Ngenteni email sampeyan…", te:"మీ ఇమెయిల్ కోసం వేచి…", tr:"E-postanız bekleniyor…", ko:"메일 대기 중…", mr:"तुमच्या ईमेलची वाट…", vi:"Đang chờ email của bạn…", ta:"உங்கள் மின்னஞ்சலுக்காக காத்திருக்கிறது…", it:"In attesa della tua email…", fa:"در انتظار ایمیل شما…", tlh:"QIn wIloS…" },
  waitingHint: { en:"Usually 10–60 seconds after you hit Send. Keep this tab open.", ru:"Обычно 10–60 секунд после отправки. Не закрывайте вкладку.", zh:"发送后通常需 10–60 秒。请保持此标签页打开。", es:"Suele tardar 10–60 s tras enviar. Mantenga esta pestaña abierta.", hi:"भेजने के बाद आमतौर पर 10–60 सेकंड। टैब खुला रखें।", ar:"عادةً 10–60 ثانية بعد الإرسال. أبقِ هذه العلامة مفتوحة.", bn:"পাঠানোর পর সাধারণত ১০–৬০ সেকেন্ড। ট্যাব খোলা রাখুন।", pt:"Costuma levar 10–60 s após enviar. Mantenha esta aba aberta.", fr:"En général 10–60 s après l’envoi. Gardez cet onglet ouvert.", de:"Meist 10–60 s nach dem Senden. Tab offen lassen.", ja:"送信後だいたい 10～60 秒。このタブを開いたままに。", id:"Biasanya 10–60 detik setelah kirim. Biarkan tab ini terbuka.", pa:"ਭੇਜਣ ਤੋਂ ਬਾਅਦ ਆਮ ਤੌਰ 'ਤੇ 10–60 ਸਕਿੰਟ। ਟੈਬ ਖੁੱਲੀ ਰੱਖੋ।", jv:"Biasane 10–60 detik sawise kirim. Tab iki tetep mbukak.", te:"పంపిన తర్వాత సాధారణంగా 10–60 సెకన్లు. ట్యాబ్ తెరిచి ఉంచండి.", tr:"Gönderdikten sonra genelde 10–60 sn. Sekmeyi açık tutun.", ko:"보낸 뒤 보통 10–60초. 이 탭을 열어 두세요.", mr:"पाठवल्यानंतर सहसा १०–६० सेकंद. टॅब उघडे ठेवा.", vi:"Thường 10–60 giây sau khi gửi. Giữ tab này mở.", ta:"அனுப்பிய பின் பொதுவாக 10–60 வினாடிகள். தாவலைத் திறந்து வைக்கவும்.", it:"Di solito 10–60 s dopo l’invio. Lascia aperta questa scheda.", fa:"معمولاً ۱۰–۶۰ ثانیه پس از ارسال. این زبانه را باز نگه دارید.", tlh:"poH loS. qawHaq yIchum." },
  newAddress: { en:"New address", ru:"Новый адрес", zh:"新地址", es:"Nueva dirección", hi:"नया पता", ar:"عنوان جديد", bn:"নতুন ঠিকানা", pt:"Novo endereço", fr:"Nouvelle adresse", de:"Neue Adresse", ja:"新しい宛先", id:"Alamat baru", pa:"ਨਵਾਂ ਪਤਾ", jv:"Alamat anyar", te:"కొత్త చిరునామా", tr:"Yeni adres", ko:"새 주소", mr:"नवीन पत्ता", vi:"Địa chỉ mới", ta:"புதிய முகவரி", it:"Nuovo indirizzo", fa:"نشانی تازه", tlh:"ID chu'" },
  retest: { en:"Retest this email", ru:"Перепроверить это письмо", zh:"重新检测此邮件", es:"Volver a probar este correo", pt:"Retestar este e-mail", fr:"Retester cet e-mail", de:"Diese E-Mail erneut prüfen", ja:"このメールを再テスト", hi:"इस ईमेल की फिर जाँच करें", ar:"أعد فحص هذه الرسالة", bn:"এই ইমেইল আবার পরীক্ষা", id:"Uji ulang email ini", pa:"ਇਸ ਈਮੇਲ ਨੂੰ ਮੁੜ ਟੈਸਟ ਕਰੋ", jv:"Tes maneh email iki", te:"ఈ ఇమెయిల్‌ను మళ్లీ పరీక్షించు", tr:"Bu e-postayı yeniden test et", ko:"이 메일 다시 검사", mr:"हे ईमेल पुन्हा तपासा", vi:"Kiểm tra lại thư này", ta:"இந்த மின்னஞ்சலை மீண்டும் சோதி", it:"Ritesa questa email", fa:"این نامه را دوباره بررسی کن", tlh:"QInvam yIchovqa'" },
  retesting: { en:"Retesting…", ru:"Перепроверяю…", zh:"重新检测中…", es:"Volviendo a probar…", pt:"Retestando…", fr:"Nouveau test…", de:"Wird erneut geprüft…", ja:"再テスト中…", hi:"फिर जाँच हो रही है…", ar:"جارٍ إعادة الفحص…", bn:"আবার পরীক্ষা হচ্ছে…", id:"Menguji ulang…", pa:"ਮੁੜ ਟੈਸਟ ਹੋ ਰਿਹਾ…", jv:"Ngetes maneh…", te:"మళ్లీ పరీక్షిస్తోంది…", tr:"Yeniden test ediliyor…", ko:"다시 검사 중…", mr:"पुन्हा तपासत आहे…", vi:"Đang kiểm tra lại…", ta:"மீண்டும் சோதிக்கிறது…", it:"Riteso in corso…", fa:"در حال بررسی دوباره…", tlh:"chovqa'taH…" },
  retestUnavailable: { en:"Cannot retest this report (no stored message). Send a new email to a fresh address.", ru:"Это отчёт нельзя перепроверить (письмо не сохранено). Отправьте новое письмо на свежий адрес.", zh:"无法重测此报告（未保存邮件）。请向新地址再发一封。", es:"No se puede reprobar (no hay mensaje guardado). Envíe un correo a una dirección nueva.", pt:"Não é possível retestar (mensagem não guardada). Envie um e-mail a um endereço novo.", fr:"Impossible de retester (message non conservé). Envoyez un e-mail à une nouvelle adresse.", de:"Erneute Prüfung nicht möglich (keine gespeicherte Mail). Senden Sie an eine neue Adresse.", ja:"再テスト不可（メール未保存）。新しい宛先に送り直してください。" },
  expired: { en:"This inbox expired. Create a new address.", ru:"Срок ящика истёк. Создайте новый адрес.", zh:"收件箱已过期。请创建新地址。", es:"Esta bandeja caducó. Cree una nueva dirección.", hi:"यह इनबॉक्स समाप्त हो गया। नया पता बनाएँ।", ar:"انتهت صلاحية الصندوق. أنشئ عنواناً جديداً.", bn:"ইনবক্সের মেয়াদ শেষ। নতুন ঠিকানা তৈরি করুন।", pt:"Esta caixa expirou. Crie um novo endereço.", fr:"Cette boîte a expiré. Créez une nouvelle adresse.", de:"Dieses Postfach ist abgelaufen. Neue Adresse erstellen.", ja:"この受信箱は期限切れです。新しい宛先を作成してください。", id:"Kotak ini kedaluwarsa. Buat alamat baru.", pa:"ਇਹ ਇਨਬਾਕਸ ਖਤਮ ਹੋ ਗਿਆ। ਨਵਾਂ ਪਤਾ ਬਣਾਓ।", jv:"Kothak iki kadaluwarsa. Gawe alamat anyar.", te:"ఈ ఇన్‌బాక్స్ గడువు ముగిసింది. కొత్త చిరునామా సృష్టించండి.", tr:"Bu gelen kutusu süresi doldu. Yeni adres oluşturun.", ko:"이 받은편지함이 만료되었습니다. 새 주소를 만드세요.", mr:"ही इनबॉक्स कालबाह्य झाली. नवीन पत्ता तयार करा.", vi:"Hộp thư đã hết hạn. Tạo địa chỉ mới.", ta:"இந்த இன்பாக்ஸ் காலாவதியானது. புதிய முகவரி உருவாக்கவும்.", it:"Questa casella è scaduta. Crea un nuovo indirizzo.", fa:"مهلت این صندوق تمام شد. نشانی تازه بسازید.", tlh:"poH van. ID chu' yIchermon." },
  errorNetwork: { en:"Network error", ru:"Ошибка сети", zh:"网络错误", es:"Error de red", hi:"नेटवर्क त्रुटि", ar:"خطأ في الشبكة", bn:"নেটওয়ার্ক ত্রুটি", pt:"Erro de rede", fr:"Erreur réseau", de:"Netzwerkfehler", ja:"ネットワークエラー", id:"Kesalahan jaringan", pa:"ਨੈੱਟਵਰਕ ਗਲਤੀ", jv:"Kasalahan jaringan", te:"నెట్‌వర్క్ లోపం", tr:"Ağ hatası", ko:"네트워크 오류", mr:"नेटवर्क त्रुटी", vi:"Lỗi mạng", ta:"பிணைய பிழை", it:"Errore di rete", fa:"خطای شبکه", tlh:"HurDaq Qagh" },
  errorServer: { en:"Server error", ru:"Ошибка сервера", zh:"服务器错误", es:"Error del servidor", hi:"सर्वर त्रुटि", ar:"خطأ في الخادم", bn:"সার্ভার ত্রুটি", pt:"Erro do servidor", fr:"Erreur serveur", de:"Serverfehler", ja:"サーバーエラー", id:"Kesalahan server", pa:"ਸਰਵਰ ਗਲਤੀ", jv:"Kasalahan server", te:"సర్వర్ లోపం", tr:"Sunucu hatası", ko:"서버 오류", mr:"सर्व्हर त्रुटी", vi:"Lỗi máy chủ", ta:"சேவையக பிழை", it:"Errore del server", fa:"خطای سرور", tlh:"De'wI' Qagh" },
  gradeLabel: { en:"Grade", ru:"Оценка", zh:"评级", es:"Nota", hi:"ग्रेड", ar:"الدرجة", bn:"গ্রেড", pt:"Nota", fr:"Note", de:"Note", ja:"評価", id:"Nilai", pa:"ਗ੍ਰੇਡ", jv:"Nilai", te:"గ్రేడ్", tr:"Not", ko:"등급", mr:"ग्रेड", vi:"Điểm", ta:"தரம்", it:"Voto", fa:"نمره", tlh:"Doch" },
  reportShareLabel: { en:"Share this report", ru:"Ссылка на отчёт", zh:"分享报告", es:"Enlace al informe", fr:"Lien du rapport", de:"Link zum Bericht", ja:"レポートのリンク", pt:"Link do relatório" },
  reportRuleLabel: { en:"Summary", ru:"Итог", zh:"摘要", es:"Resumen", fr:"Synthèse", de:"Überblick", ja:"概要", pt:"Resumo" },
  reportPillarsTitle: { en:"Core auth signals", ru:"Ключевые сигналы аутентификации", zh:"核心认证信号", es:"Señales de autenticación", fr:"Signaux d’authentification", de:"Kernsignale der Authentifizierung", ja:"認証の主要シグナル", pt:"Sinais de autenticação" },
  pillarPass: { en:"Pass", ru:"Пройдено", zh:"通过", es:"Correcto", fr:"OK", de:"Bestanden", ja:"成功", pt:"OK" },
  pillarFail: { en:"Fail", ru:"Провал", zh:"失败", es:"Fallo", fr:"Échec", de:"Fehlgeschlagen", ja:"失敗", pt:"Falha" },
  pillarWarn: { en:"Weak", ru:"Слабо", zh:"较弱", es:"Débil", fr:"Faible", de:"Schwach", ja:"弱い", pt:"Fraco" },
  pillarUnknown: { en:"n/a", ru:"нет данных", zh:"无数据", es:"n/d", fr:"n/d", de:"k. A.", ja:"なし", pt:"n/d" },
  verdictExcellent: { en:"Excellent", ru:"Отлично", zh:"优秀", es:"Excelente", fr:"Excellent", de:"Ausgezeichnet", ja:"優秀", pt:"Excelente" },
  verdictGood: { en:"Solid", ru:"Хорошо", zh:"良好", es:"Sólido", fr:"Solide", de:"Solid", ja:"良好", pt:"Sólido" },
  verdictFair: { en:"Mixed", ru:"Средне", zh:"一般", es:"Regular", fr:"Mitigé", de:"Gemischt", ja:"普通", pt:"Misto" },
  verdictPoor: { en:"Risky", ru:"Рискованно", zh:"有风险", es:"Arriesgado", fr:"Risqué", de:"Riskant", ja:"リスクあり", pt:"Arriscado" },
  verdictBad: { en:"Broken", ru:"Сломано", zh:"严重", es:"Roto", fr:"Cassé", de:"Kaputt", ja:"破綻", pt:"Quebrado" },
  scorePoints: { en:"{score} / 100", ru:"{score} / 100", zh:"{score} / 100", es:"{score} / 100", fr:"{score} / 100", de:"{score} / 100", ja:"{score} / 100", pt:"{score} / 100" },
  findingsTitle: { en:"Findings", ru:"Разбор", zh:"发现项", es:"Hallazgos", hi:"निष्कर्ष", ar:"النتائج", bn:"ফলাফল", pt:"Achados", fr:"Résultats", de:"Befunde", ja:"結果", id:"Temuan", pa:"ਨਤੀਜੇ", jv:"Temuan", te:"ఫలితాలు", tr:"Bulgular", ko:"결과", mr:"निष्कर्ष", vi:"Phát hiện", ta:"முடிவுகள்", it:"Risultati", fa:"یافته‌ها", tlh:"chovwI'" },
  filterAll: { en:"All", ru:"Все", zh:"全部", es:"Todas", hi:"सभी", ar:"الكل", bn:"সব", pt:"Todas", fr:"Toutes", de:"Alle", ja:"すべて", id:"Semua", pa:"ਸਾਰੇ", jv:"Kabeh", te:"అన్నీ", tr:"Tümü", ko:"전체", mr:"सर्व", vi:"Tất cả", ta:"அனைத்தும்", it:"Tutte", fa:"همه", tlh:"Hoch" },
  filterFail: { en:"Errors", ru:"Ошибки", zh:"错误", es:"Errores", hi:"त्रुटियाँ", ar:"أخطاء", bn:"ত্রুটি", pt:"Erros", fr:"Erreurs", de:"Fehler", ja:"エラー", id:"Kesalahan", pa:"ਗਲਤੀਆਂ", jv:"Kasalahan", te:"లోపాలు", tr:"Hatalar", ko:"오류", mr:"त्रुटी", vi:"Lỗi", ta:"பிழைகள்", it:"Errori", fa:"خطاها", tlh:"Qagh" },
  filterPass: { en:"Passed", ru:"Пройдено", zh:"通过", es:"Correctas", hi:"पास", ar:"ناجح", bn:"পাস", pt:"OK", fr:"Réussies", de:"Bestanden", ja:"合格", id:"Lulus", pa:"ਪਾਸ", jv:"Lulus", te:"పాస్", tr:"Geçti", ko:"통과", mr:"पास", vi:"Đạt", ta:"தேர்ச்சி", it:"OK", fa:"قبول", tlh:"Qap" },
  filterAria: { en:"Filter findings", ru:"Фильтр результатов", zh:"筛选结果", es:"Filtrar hallazgos", hi:"निष्कर्ष फ़िल्टर करें", ar:"تصفية النتائج", bn:"ফলাফল ফিল্টার", pt:"Filtrar achados", fr:"Filtrer les résultats", de:"Befunde filtern", ja:"結果を絞り込み", id:"Filter temuan", pa:"ਨਤੀਜੇ ਫਿਲਟਰ", jv:"Filter temuan", te:"ఫలితాలను ఫిల్టర్ చేయండి", tr:"Bulguları filtrele", ko:"결과 필터", mr:"निष्कर्ष फिल्टर", vi:"Lọc phát hiện", ta:"முடிவுகளை வடிகட்டு", it:"Filtra risultati", fa:"فیلتر یافته‌ها", tlh:"chovwI' wIwiv" },
  emptyFilter: { en:"Nothing in this filter.", ru:"В этом фильтре пусто.", zh:"此筛选下无结果。", es:"Nada en este filtro.", hi:"इस फ़िल्टर में कुछ नहीं।", ar:"لا شيء في هذا التصفية.", bn:"এই ফিল্টারে কিছু নেই।", pt:"Nada neste filtro.", fr:"Rien dans ce filtre.", de:"Nichts in diesem Filter.", ja:"この絞り込みでは何もありません。", id:"Tidak ada di filter ini.", pa:"ਇਸ ਫਿਲਟਰ ਵਿੱਚ ਕੁਝ ਨਹੀਂ।", jv:"Ora ana ing filter iki.", te:"ఈ ఫిల్టర్‌లో ఏమీ లేదు.", tr:"Bu filtrede bir şey yok.", ko:"이 필터에 항목이 없습니다.", mr:"या फिल्टरमध्ये काही नाही.", vi:"Không có mục trong bộ lọc này.", ta:"இந்த வடிகட்டியில் எதுவும் இல்லை.", it:"Niente in questo filtro.", fa:"در این فیلتر چیزی نیست.", tlh:"pagh." },
  downloadAiBrief: { en:"Download AI brief", ru:"ТЗ для ИИ", zh:"下载 AI 任务书", es:"Descargar brief para IA", hi:"AI ब्रीफ डाउनलोड करें", ar:"تنزيل موجز للذكاء الاصطناعي", bn:"AI ব্রিফ ডাউনলোড", pt:"Baixar brief para IA", fr:"Télécharger le brief IA", de:"KI-Brief herunterladen", ja:"AI向けブリーフをダウンロード", id:"Unduh brief AI", pa:"AI ਬ੍ਰੀਫ ਡਾਊਨਲੋਡ", jv:"Undhuh brief AI", te:"AI బ్రీఫ్ డౌన్‌లోడ్", tr:"YZ brief indir", ko:"AI 브리프 다운로드", mr:"AI ब्रीफ डाउनलोड", vi:"Tải brief AI", ta:"AI சுருக்கத்தைப் பதிவிறக்கு", it:"Scarica brief per IA", fa:"دانلود بریف هوش مصنوعی", tlh:"AI De' yIje'" },
  downloadAdminBrief: { en:"Mail admin checklist", ru:"ТЗ для админа почты", zh:"邮件管理员清单", es:"Lista para admin de correo", hi:"मेल एडमिन चेकलिस्ट", ar:"قائمة لمسؤول البريد", bn:"মেইল অ্যাডমিন চেকলিস্ট", pt:"Lista para admin de e-mail", fr:"Checklist admin mail", de:"Checkliste für Mail-Admin", ja:"メール管理者チェックリスト", id:"Checklist admin mail", pa:"ਮੇਲ ਐਡਮਿਨ ਚੈਕਲਿਸਟ", jv:"Checklist admin mail", te:"మెయిల్ అడ్మిన్ చెక్‌లిస్ట్", tr:"Posta admin kontrol listesi", ko:"메일 관리자 체크리스트", mr:"मेल अॅडмин चेकलिस्ट", vi:"Checklist quản trị thư", ta:"அஞ்சல் நிர்வாகி சரிபார்ப்புப்பட்டியல்", it:"Checklist admin posta", fa:"چک‌لیست مدیر پست", tlh:"QIn admin tetlh" },
  exportPdf: { en:"Print / PDF", ru:"Печать / PDF", zh:"打印 / PDF", es:"Imprimir / PDF", pt:"Imprimir / PDF", fr:"Imprimer / PDF", de:"Drucken / PDF", ja:"印刷 / PDF" },
  privacyLink: { en:"Privacy", ru:"Конфиденциальность", zh:"隐私", es:"Privacidad", pt:"Privacidade", fr:"Confidentialité", de:"Datenschutz", ja:"プライバシー" },
  reportRetentionHint: { en:"Report link stays available about 7 days after the message arrives.", ru:"Ссылка на отчёт живёт около 7 дней после прихода письма.", zh:"报告链接在邮件到达后约保留 7 天。", es:"El enlace al informe dura unos 7 días tras llegar el correo.", pt:"O link do relatório fica ~7 dias após a chegada.", fr:"Le lien du rapport reste ~7 jours après réception.", de:"Der Berichtslink bleibt ca. 7 Tage nach dem Empfang.", ja:"レポートリンクは受信後およそ7日間有効です。" },
  testsSummary: { en:"{total} checks · {pass} passed · {fail} with issues", ru:"{total} проверок · {pass} пройдено · {fail} с замечаниями", zh:"{total} 项 · {pass} 通过 · {fail} 有问题", es:"{total} pruebas · {pass} OK · {fail} con problemas", fr:"{total} contrôles · {pass} OK · {fail} avec remarques", de:"{total} Checks · {pass} bestanden · {fail} mit Hinweisen", ja:"{total} 件 · 合格 {pass} · 指摘 {fail}", pt:"{total} testes · {pass} OK · {fail} com problemas" },
  scoreExplain: { en:"Grade {score}/100: start at 100, minus {lost} by severity (critical −25, high −12, medium −6, low −3). Heuristic spam score {spam} = issues {spamFail} + bonuses {spamPass} — not the same as the grade.", ru:"Оценка {score}/100: старт 100, снято {lost} по серьёзности (critical −25, high −12, medium −6, low −3). Спам-балл эвристик {spam} = замечания {spamFail} + бонусы за пройденные {spamPass} — это не оценка из 100.", zh:"评分 {score}/100：从 100 起按严重度扣 {lost}（critical −25, high −12, medium −6, low −3）。启发式垃圾分 {spam} = 问题 {spamFail} + 加分 {spamPass}，与百分制评分不是一回事。", es:"Nota {score}/100: parte de 100, −{lost} por gravedad (critical −25, high −12, medium −6, low −3). Score spam {spam} = problemas {spamFail} + bonus {spamPass} — no es la nota /100.", fr:"Note {score}/100 : départ 100, −{lost} selon la sévérité (critical −25, high −12, medium −6, low −3). Score spam {spam} = écarts {spamFail} + bonus {spamPass} — ce n’est pas la note /100.", de:"Note {score}/100: Start 100, −{lost} nach Schwere (critical −25, high −12, medium −6, low −3). Spam-Score {spam} = Probleme {spamFail} + Boni {spamPass} — nicht die Note /100.", ja:"評価 {score}/100：100 から重大度で {lost} 減点（critical −25, high −12, medium −6, low −3）。スパム点 {spam} = 指摘 {spamFail} + ボーナス {spamPass}（百分とは別）。", pt:"Nota {score}/100: parte de 100, −{lost} por gravidade (critical −25, high −12, medium −6, low −3). Score spam {spam} = problemas {spamFail} + bônus {spamPass} — não é a nota /100." },
  spamScoreLabel: { en:"Spam weight: {score}", ru:"Вклад в спам-балл: {score}", zh:"垃圾分贡献：{score}", es:"Peso spam: {score}", fr:"Poids spam : {score}", de:"Spam-Gewicht: {score}", ja:"スパム寄与: {score}", pt:"Peso spam: {score}" },
  gradeDeltaLabel: { en:"Grade impact: {delta}", ru:"Влияние на оценку: {delta}", zh:"对评分影响：{delta}", es:"Impacto en la nota: {delta}", fr:"Impact sur la note : {delta}", de:"Einfluss auf die Note: {delta}", ja:"評価への影響: {delta}", pt:"Impacto na nota: {delta}" },
  emptyFindings: { en:"No findings.", ru:"Нет замечаний.", zh:"无发现。", es:"Sin hallazgos.", hi:"कोई निष्कर्ष नहीं।", ar:"لا نتائج.", bn:"কোনো ফলাফল নেই।", pt:"Sem achados.", fr:"Aucun résultat.", de:"Keine Befunde.", ja:"指摘なし。", id:"Tidak ada temuan.", pa:"ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ।", jv:"Ora ana temuan.", te:"ఫలితాలు లేవు.", tr:"Bulgu yok.", ko:"결과 없음.", mr:"निष्कर्ष नाहीत.", vi:"Không có phát hiện.", ta:"முடிவுகள் இல்லை.", it:"Nessun risultato.", fa:"یافته‌ای نیست.", tlh:"pagh." },
  fixLabel: { en:"How to fix", ru:"Как исправить", zh:"如何修复", es:"Cómo corregirlo", pt:"Como corrigir", fr:"Comment corriger", de:"So beheben", ja:"直し方" },
  whyLabel: { en:"Why this can look like spam", ru:"Почему письмо могут счесть спамом", zh:"为何可能像垃圾邮件", es:"Por qué puede parecer spam", pt:"Por que pode parecer spam", fr:"Pourquoi ça peut passer pour du spam", de:"Warum das nach Spam aussehen kann", ja:"スパムに見えやすい理由" },
  problemLabel: { en:"What's wrong", ru:"В чём проблема", zh:"问题是什么", es:"En qué consiste el problema", pt:"Qual é o problema", fr:"Quel est le problème", de:"Was ist das Problem", ja:"何が問題か" },
  evidenceLabel: { en:"What we saw", ru:"Что увидели", zh:"我们看到了什么", es:"Qué vimos", pt:"O que vimos", fr:"Ce que nous avons vu", de:"Was wir gesehen haben", ja:"何を見たのか" },
  mailMetaTitle: { en:"Message", ru:"Письмо", zh:"邮件", es:"Mensaje", hi:"संदेश", ar:"الرسالة", bn:"বার্তা", pt:"Mensagem", fr:"Message", de:"Nachricht", ja:"メッセージ", id:"Pesan", pa:"ਸੁਨੇਹਾ", jv:"Pesen", te:"సందేశం", tr:"Mesaj", ko:"메시지", mr:"संदेश", vi:"Thư", ta:"செய்தி", it:"Messaggio", fa:"پیام", tlh:"QIn" },
  headersTitle: { en:"Headers", ru:"Заголовки", zh:"邮件头", es:"Cabeceras", hi:"हेडर", ar:"الترويسات", bn:"হেডার", pt:"Cabeçalhos", fr:"En-têtes", de:"Header", ja:"ヘッダー", id:"Header", pa:"ਹੈਡਰ", jv:"Header", te:"హెడర్లు", tr:"Başlıklar", ko:"헤더", mr:"हेडर", vi:"Header", ta:"தலைப்புகள்", it:"Intestazioni", fa:"سرآیندها", tlh:"De' qach" },
  headersEmpty: { en:"No headers in this message.", ru:"В письме нет заголовков.", zh:"此邮件没有标头。", es:"Este mensaje no tiene cabeceras.", hi:"इस संदेश में हेडर नहीं हैं।", ar:"لا ترويسات في هذه الرسالة.", bn:"এই বার্তায় হেডার নেই।", pt:"Não há cabeçalhos nesta mensagem.", fr:"Pas d’en-têtes dans ce message.", de:"Keine Header in dieser Nachricht.", ja:"このメッセージにヘッダーがありません。", id:"Tidak ada header di pesan ini.", pa:"ਇਸ ਸੁਨੇਹੇ ਵਿੱਚ ਹੈਡਰ ਨਹੀਂ ਹਨ।", jv:"Ora ana header ing pesen iki.", te:"ఈ సందేశంలో హెడర్లు లేవు.", tr:"Bu iletide başlık yok.", ko:"이 메시지에 헤더가 없습니다.", mr:"या संदेशात हेडर नाहीत.", vi:"Thư này không có header.", ta:"இந்த செய்தியில் தலைப்புகள் இல்லை.", it:"Nessuna intestazione in questo messaggio.", fa:"در این پیام سرآیندی نیست.", tlh:"De' qach Hut." },
  fromLabel: { en:"From", ru:"От", zh:"发件人", es:"De", hi:"प्रेषक", ar:"من", bn:"প্রেরক", pt:"De", fr:"De", de:"Von", ja:"差出人", id:"Dari", pa:"ਵੱਲੋਂ", jv:"Saka", te:"నుండి", tr:"Kimden", ko:"보낸 사람", mr:"कडून", vi:"Từ", ta:"அனுப்புநர்", it:"Da", fa:"از", tlh:"vo'" },
  subjectLabel: { en:"Subject", ru:"Тема", zh:"主题", es:"Asunto", hi:"विषय", ar:"الموضوع", bn:"বিষয়", pt:"Assunto", fr:"Objet", de:"Betreff", ja:"件名", id:"Subjek", pa:"ਵਿਸ਼ਾ", jv:"Subyek", te:"విషయం", tr:"Konu", ko:"제목", mr:"विषय", vi:"Tiêu đề", ta:"பொருள்", it:"Oggetto", fa:"موضوع", tlh:"Subject" },
  ipLabel: { en:"Sending IP", ru:"IP отправителя", zh:"发送 IP", es:"IP de envío", hi:"भेजने वाला IP", ar:"IP المرسل", bn:"প্রেরকের IP", pt:"IP de envio", fr:"IP d’envoi", de:"Absender-IP", ja:"送信元 IP", id:"IP pengirim", pa:"ਭੇਜਣ ਵਾਲਾ IP", jv:"IP pangirim", te:"పంపే IP", tr:"Gönderen IP", ko:"발신 IP", mr:"पाठवणारा IP", vi:"IP gửi", ta:"அனுப்பும் IP", it:"IP mittente", fa:"IP فرستنده", tlh:"IP" },
  sevOk: { en:"OK", ru:"OK", zh:"正常", es:"OK", hi:"ठीक", ar:"حسن", bn:"ঠিক", pt:"OK", fr:"OK", de:"OK", ja:"OK", id:"OK", pa:"ਠੀਕ", jv:"OK", te:"సరే", tr:"Tamam", ko:"정상", mr:"ठीक", vi:"OK", ta:"சரி", it:"OK", fa:"خوب", tlh:"maj" },
  sevInfo: { en:"Info", ru:"Инфо", zh:"信息", es:"Info", hi:"जानकारी", ar:"معلومة", bn:"তথ্য", pt:"Info", fr:"Info", de:"Info", ja:"情報", id:"Info", pa:"ਜਾਣਕਾਰੀ", jv:"Info", te:"సమాచారం", tr:"Bilgi", ko:"정보", mr:"माहिती", vi:"Thông tin", ta:"தகவல்", it:"Info", fa:"اطلاع", tlh:"De'" },
  sevLow: { en:"Low", ru:"Низкий", zh:"低", es:"Bajo", hi:"कम", ar:"منخفض", bn:"কম", pt:"Baixo", fr:"Faible", de:"Niedrig", ja:"低", id:"Rendah", pa:"ਘੱਟ", jv:"Endhek", te:"తక్కువ", tr:"Düşük", ko:"낮음", mr:"कमी", vi:"Thấp", ta:"குறைவு", it:"Basso", fa:"کم", tlh:"mach" },
  sevMedium: { en:"Medium", ru:"Средний", zh:"中", es:"Medio", hi:"मध्यम", ar:"متوسط", bn:"মাঝারি", pt:"Médio", fr:"Moyen", de:"Mittel", ja:"中", id:"Sedang", pa:"ਮੱਧਮ", jv:"Sedheng", te:"మధ్యస్థం", tr:"Orta", ko:"중간", mr:"मध्यम", vi:"Trung bình", ta:"நடுத்தரம்", it:"Medio", fa:"متوسط", tlh:"motlh" },
  sevHigh: { en:"High", ru:"Высокий", zh:"高", es:"Alto", hi:"उच्च", ar:"مرتفع", bn:"উচ্চ", pt:"Alto", fr:"Élevé", de:"Hoch", ja:"高", id:"Tinggi", pa:"ਉੱਚ", jv:"Dhuwur", te:"ఎక్కువ", tr:"Yüksek", ko:"높음", mr:"उच्च", vi:"Cao", ta:"உயர்", it:"Alto", fa:"زیاد", tlh:"tIn" },
  sevCritical: { en:"Critical", ru:"Критичный", zh:"严重", es:"Crítico", hi:"गंभीर", ar:"حرج", bn:"সংকটজনক", pt:"Crítico", fr:"Critique", de:"Kritisch", ja:"重大", id:"Kritis", pa:"ਗੰਭੀਰ", jv:"Kritis", te:"క్లిష్టమైన", tr:"Kritik", ko:"치명적", mr:"गंभीर", vi:"Nghiêm trọng", ta:"முக்கியமான", it:"Critico", fa:"بحرانی", tlh:"motlhbe'" },
};

function fill(row) {
  const out = {};
  for (const loc of LOCALES) out[loc] = row[loc] ?? row.en;
  return out;
}

function genUi() {
  let body = `import type { MessageKey } from "./i18n-keys";\nimport { localeNames, type Locale } from "./site-config";\n\nfunction pack(\n  rows: Record<MessageKey, Partial<Record<Locale, string>> & { en: string }>,\n): Record<Locale, Record<MessageKey, string>> {\n  const keys = Object.keys(rows) as MessageKey[];\n  const out = {} as Record<Locale, Record<MessageKey, string>>;\n  for (const key of keys) {\n    const byLocale = localeNames(rows[key]);\n    for (const locale of Object.keys(byLocale) as Locale[]) {\n      if (!out[locale]) out[locale] = {} as Record<MessageKey, string>;\n      out[locale][key] = byLocale[locale];\n    }\n  }\n  return out;\n}\n\nexport const UI_MESSAGES = pack({\n`;
  for (const key of Object.keys(ui)) {
    const row = fill(ui[key]);
    body += `  ${key}: {\n`;
    for (const loc of LOCALES) body += `    ${loc}: ${JSON.stringify(row[loc])},\n`;
    body += `  },\n`;
  }
  body += `});\n`;
  fs.writeFileSync(path.join(srcDir, "i18n-messages.ts"), body);
}

function seoFor(isRu) {
  return {
    title: isRu
      ? "supermail — спам-тест письма: DKIM, SPF по IP, DMARC"
      : "supermail — email spam test: DKIM crypto, SPF-by-IP, DMARC",
    description: isRu
      ? "Одноразовый ящик и реальное письмо с вашего SMTP. Оценка A–F: крипто-DKIM, SPF по IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, Печать/PDF, ТЗ для ИИ. Бесплатно."
      : "One-time inbox and a real message from your SMTP. A–F grade: crypto DKIM, SPF-by-IP, DMARC alignment, MTA-STS/TLS-RPT/BIMI, DNSBL, Print/PDF, AI briefs. Free.",
    heading: isRu ? "Спам-тест вашего исходящего письма" : "Spam-test your outbound email",
    leadHtml: isRu
      ? "Выдаём уникальный адрес @supermail.dmosk.net. Вы шлёте письмо со своего SMTP — получаете оценку A–F, криптопроверку DKIM, SPF по IP соединения, DMARC alignment, Печать/PDF, исходные заголовки и два Markdown-ТЗ: для ИИ и для админа почты. Ссылка на отчёт живёт около 7 дней."
      : "We give a unique @supermail.dmosk.net address. Send from your SMTP — get an A–F grade, crypto DKIM verify, SPF against the connecting IP, DMARC alignment, Print/PDF, raw headers, and two Markdown briefs for AI and your mail admin. The report link lasts about 7 days.",
    benefitsTitle: isRu ? "Что умеет supermail" : "What supermail covers",
    benefits: isRu
      ? [
          "Реальное письмо по SMTP, не «форма только DNS»",
          "Криптопроверка DKIM и публикация ключа в DNS",
          "SPF-запись и оценка SPF по IP отправителя",
          "DMARC: политика, rua/ruf, alignment со From",
          "MTA-STS, TLS-RPT и BIMI в DNS (по желанию домена)",
          "DNSBL, PTR↔HELO, A у HELO, контент и MIME",
          "Печать/PDF и ТЗ для ИИ и админа",
          "Фильтр разбора (Все / Ошибки / Пройдено), 23 языка UI",
        ]
      : [
          "A real SMTP message, not a DNS-only form",
          "Cryptographic DKIM verify plus DNS key publication",
          "SPF record and SPF evaluation against the sending IP",
          "DMARC policy, rua/ruf, and alignment with From",
          "MTA-STS, TLS-RPT and BIMI DNS checks (optional)",
          "DNSBL, PTR↔HELO, HELO A, content and MIME",
          "Print/PDF plus AI and mail-admin briefs",
          "Findings filter (All / Errors / Passed), 23 UI languages",
        ],
    howTitle: isRu ? "Как пользоваться" : "How to use",
    howSteps: isRu
      ? [
          "Скопируйте тестовый адрес (ссылку с ?i=… можно сохранить или переслать)",
          "Отправьте письмо со своего сервера, ESP или обычного ящика",
          "Подождите 10–60 секунд — вкладку не закрывайте",
          "Смотрите оценку, фильтр разбора и заголовки",
          "Распечатайте в PDF или возьмите ТЗ для ИИ / админа",
        ]
      : [
          "Copy the test address (you can keep or share the ?i=… link)",
          "Send a message from your server, ESP or normal mailbox",
          "Wait 10–60 seconds — keep the tab open",
          "Read the grade, findings filter and headers",
          "Print to PDF or take the AI / admin brief",
        ],
    strongTitle: isRu ? "Советы по доставке" : "Deliverability tips",
    strongLead: isRu
      ? "Фильтры смотрят на DNS, имя сервера и текст. Закройте auth (SPF/DKIM/DMARC alignment) и контент вместе — одной TXT-записи мало."
      : "Filters look at DNS, the server name and the wording. Fix auth (SPF/DKIM/DMARC alignment) and content together — one TXT record is not enough.",
    tipsLabel: isRu ? "Практика" : "Practice",
    strongTips: isRu
      ? [
          "DKIM тем же доменом, что в From; подпись должна проходить криптопроверку",
          "В SPF не ставьте +all; IP отправки должен попадать в pass",
          "DMARC: p=none + rua, затем quarantine → reject; следите за alignment",
          "PTR IP должен совпадать с HELO/EHLO, у HELO — рабочий A",
          "По желанию: MTA-STS и TLS-RPT; BIMI — после жёсткого DMARC",
        ]
      : [
          "Sign DKIM with the same domain as From; the signature must crypto-verify",
          "Never use +all in SPF; the sending IP should evaluate to pass",
          "DMARC: p=none + rua, then quarantine → reject; watch alignment",
          "IP PTR should match HELO/EHLO; HELO needs a working A record",
          "Optional: MTA-STS and TLS-RPT; BIMI after enforce DMARC",
        ],
    usesTitle: isRu ? "Когда это нужно" : "When you need it",
    uses: isRu
      ? [
          "Перед массовой рассылкой или запуском транзакционных писем",
          "После смены ESP, Postfix/Exim или IP отправки",
          "Когда Gmail, Mail.ru или Outlook кладут письма в спам",
          "Проверка SPF/DKIM/DMARC alignment и репутации IP (DNSBL)",
          "Отдать админу или ИИ готовое ТЗ по замечаниям отчёта",
        ]
      : [
          "Before a bulk campaign or transactional mail launch",
          "After changing ESP, Postfix/Exim or the sending IP",
          "When Gmail, Mail.ru or Outlook file mail as spam",
          "Checking SPF/DKIM/DMARC alignment and IP reputation (DNSBL)",
          "Hand an admin or AI a ready brief from the report findings",
        ],
    faqTitle: isRu ? "Вопросы и ответы" : "FAQ",
    faq: isRu
      ? [
          {
            q: "Куда слать письмо?",
            a: "На уникальный адрес …@supermail.dmosk.net на странице. Можно отправить с вашего SMTP, ESP или обычного ящика.",
          },
          {
            q: "Что именно проверяете?",
            a: "Криптопроверку DKIM, SPF-запись и SPF по IP соединения, DMARC (политика, rua/ruf, alignment с From), DNS-ключ DKIM, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO и A у HELO, контент и MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC и др. В отчёте — оценка A–F, спам-балл, заголовки и Печать/PDF.",
          },
          {
            q: "Как считается оценка?",
            a: "Оценка из 100 и спам-балл — разные шкалы. Оценка: старт 100, за замечание снимаем по серьёзности (critical −25, high −12, medium −6, low −3). Нет DKIM — мягкий минус; сломанный DKIM жёстче. Спам-балл эвристик — сумма мелких вкладов; он не обязан совпадать с «сколько сняли из 100».",
          },
          {
            q: "Проверяете ли криптографию DKIM и SPF по IP?",
            a: "Да. Подпись DKIM проверяем криптографически; SPF оцениваем по IP соединения и домену MAIL FROM / From. Плюс смотрим публикацию ключа DKIM и alignment DMARC.",
          },
          {
            q: "Как сохранить отчёт?",
            a: "Кнопка «Печать / PDF» в отчёте. Также два Markdown-ТЗ: для ИИ-агента (без повторных сетевых сканов) и понятный чеклист для админа почты.",
          },
          {
            q: "Сколько живёт ящик и ссылка на отчёт?",
            a: "Ожидание письма — около 30 минут. Готовый отчёт по ссылке с ?i=… доступен около 7 дней, затем удаляется. Подробности — на странице «Конфиденциальность».",
          },
          {
            q: "Есть публичный API?",
            a: "Да: POST /api/v1/inbox и GET /api/v1/inbox/{id}. Контракт описан в README на GitHub и в документации сервиса.",
          },
          {
            q: "На каких языках интерфейс?",
            a: "23 локали. Тексты проверок переводятся по коду; Markdown-ТЗ — на русском или английском в зависимости от языка страницы.",
          },
          {
            q: "Это клон mail-tester?",
            a: "Сценарий тот же: ящик → письмо → отчёт. Набор проверок, формулировки, экспорт и два ТЗ — наши; полного SpamAssassin внутри нет.",
          },
          {
            q: "Платно?",
            a: "Нет, сервис бесплатный.",
          },
        ]
      : [
          {
            q: "Where do I send mail?",
            a: "To the unique …@supermail.dmosk.net address on the page — from your SMTP, ESP or a normal mailbox.",
          },
          {
            q: "What exactly do you check?",
            a: "Crypto DKIM verify, SPF record and SPF against the connecting IP, DMARC (policy, rua/ruf, alignment with From), DKIM DNS key, MX, MTA-STS / TLS-RPT / BIMI, DNSBL, PTR↔HELO and HELO A, content and MIME, Authentication-Results, Received/TLS, List-Unsubscribe, ARC and more. The report includes an A–F grade, spam score, headers and Print/PDF.",
          },
          {
            q: "How is the grade calculated?",
            a: "The /100 grade and the heuristic spam score are different scales. Grade: start at 100, subtract by severity (critical −25, high −12, medium −6, low −3). Missing DKIM is a mild cut; a broken DKIM signature is harsher. Spam score sums small per-check weights; it does not have to match points taken from 100.",
          },
          {
            q: "Do you verify DKIM crypto and SPF against the IP?",
            a: "Yes. We cryptographically verify DKIM and evaluate SPF for the connecting IP and MAIL FROM / From domain, plus DKIM key publication and DMARC alignment.",
          },
          {
            q: "How do I save the report?",
            a: "Use Print / PDF on the report. There are also two Markdown briefs: an AI agent task (no live rescans) and a plain mail-admin checklist.",
          },
          {
            q: "How long do the inbox and report link live?",
            a: "Waiting for mail lasts about 30 minutes. A ready report via ?i=… stays available about 7 days, then is removed. See the Privacy page for details.",
          },
          {
            q: "Is there a public API?",
            a: "Yes: POST /api/v1/inbox and GET /api/v1/inbox/{id}. The contract is in the GitHub README and service docs.",
          },
          {
            q: "Which languages are supported?",
            a: "23 UI locales. Finding copy is localized by check code; Markdown briefs are Russian or English depending on the page language.",
          },
          {
            q: "Is this a mail-tester clone?",
            a: "Same flow: inbox → message → report. The checks, wording, export and two briefs are ours; we do not ship full SpamAssassin.",
          },
          {
            q: "Is it free?",
            a: "Yes.",
          },
        ],
    appName: "supermail",
  };
}

function genSeo() {
  let body = `import type { Locale } from "./site-config";\n\nexport type SeoCopy = {\n  title: string;\n  description: string;\n  heading: string;\n  leadHtml: string;\n  benefitsTitle: string;\n  benefits: string[];\n  howTitle: string;\n  howSteps: string[];\n  strongTitle: string;\n  strongLead: string;\n  tipsLabel: string;\n  strongTips: string[];\n  usesTitle: string;\n  uses: string[];\n  faqTitle: string;\n  faq: { q: string; a: string }[];\n  appName: string;\n};\n\nexport const SEO_COPY: Record<Locale, SeoCopy> = {\n`;
  for (const loc of LOCALES) {
    const c = seoFor(loc === "ru");
    body += `  ${loc}: ${JSON.stringify(c, null, 2).replace(/\n/g, "\n  ")},\n`;
  }
  body += `};\n`;
  fs.writeFileSync(path.join(srcDir, "seo-messages.ts"), body);
}

function genKeys() {
  const keys = Object.keys(ui);
  const body =
    `export const MESSAGE_KEYS = [\n` +
    keys.map((k) => `  "${k}",\n`).join("") +
    `] as const;\n\nexport type MessageKey = (typeof MESSAGE_KEYS)[number];\n`;
  fs.writeFileSync(path.join(srcDir, "i18n-keys.ts"), body);
}

genKeys();
genUi();
genSeo();
console.log("ok");
