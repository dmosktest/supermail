import type { Locale } from "./site-config";

export type NotFoundCopy = { title: string; message: string; home: string };

export const NOT_FOUND_COPY: Record<Locale, NotFoundCopy> = {
  ru: { title: "404 — страница не найдена · supermail", message: "Страница не найдена", home: "На главную" },
  en: { title: "404 — Page not found · supermail", message: "Page not found", home: "Home" },
  zh: { title: "404 — 页面未找到 · supermail", message: "页面未找到", home: "首页" },
  es: { title: "404 — Página no encontrada · supermail", message: "Página no encontrada", home: "Inicio" },
  hi: { title: "404 — पृष्ठ नहीं मिला · supermail", message: "पृष्ठ नहीं मिला", home: "मुख्य पृष्ठ" },
  ar: { title: "404 — الصفحة غير موجودة · supermail", message: "الصفحة غير موجودة", home: "الرئيسية" },
  bn: { title: "404 — পৃষ্ঠা পাওয়া যায়নি · supermail", message: "পৃষ্ঠা পাওয়া যায়নি", home: "হোম" },
  pt: { title: "404 — Página não encontrada · supermail", message: "Página não encontrada", home: "Início" },
  fr: { title: "404 — Page introuvable · supermail", message: "Page introuvable", home: "Accueil" },
  de: { title: "404 — Seite nicht gefunden · supermail", message: "Seite nicht gefunden", home: "Start" },
  ja: { title: "404 — ページが見つかりません · supermail", message: "ページが見つかりません", home: "ホーム" },
  id: { title: "404 — Halaman tidak ditemukan · supermail", message: "Halaman tidak ditemukan", home: "Beranda" },
  pa: { title: "404 — ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ · supermail", message: "ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ", home: "ਘਰ" },
  jv: { title: "404 — Kaca ora ketemu · supermail", message: "Kaca ora ketemu", home: "Ngarep" },
  te: { title: "404 — పేజీ కనుగొనబడలేదు · supermail", message: "పేజీ కనుగొనబడలేదు", home: "హోమ్" },
  tr: { title: "404 — Sayfa bulunamadı · supermail", message: "Sayfa bulunamadı", home: "Ana sayfa" },
  ko: { title: "404 — 페이지를 찾을 수 없음 · supermail", message: "페이지를 찾을 수 없습니다", home: "홈" },
  mr: { title: "404 — पृष्ठ सापडले नाही · supermail", message: "पृष्ठ सापडले नाही", home: "मुख्य" },
  vi: { title: "404 — Không tìm thấy trang · supermail", message: "Không tìm thấy trang", home: "Trang chủ" },
  ta: { title: "404 — பக்கம் இல்லை · supermail", message: "பக்கம் இல்லை", home: "முகப்பு" },
  it: { title: "404 — Pagina non trovata · supermail", message: "Pagina non trovata", home: "Home" },
  fa: { title: "404 — صفحه پیدا نشد · supermail", message: "صفحه پیدا نشد", home: "خانه" },
  tlh: { title: "404 — pagina tu'lu'be' · supermail", message: "pagina tu'lu'be'", home: "juH" },
};
