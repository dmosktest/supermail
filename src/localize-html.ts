import { t } from "./i18n";
import { NOT_FOUND_COPY } from "./notfound-messages";
import { PRIVACY_COPY } from "./privacy-messages";
import {
  buildAppJsonLd,
  buildFaqJsonLd,
  getSeoCopy,
  renderSeoHtml,
} from "./seo-content";
import {
  ALLOW_INDEX,
  LOCALES,
  localeFlagHtml,
  LOCALE_NATIVE_NAME,
  ROBOTS_META,
  SITE_ORIGIN,
  X_DEFAULT_LOCALE,
  type Locale,
  isRtlLocale,
  localePath,
  localeUrl,
  ogLocale,
  ogLocaleAlternates,
} from "./site-config";

function replaceTagContent(
  html: string,
  tag: string,
  id: string | null,
  content: string,
): string {
  const idAttr = id ? `[^>]*\\bid=["']${id}["'][^>]*` : "";
  const re = new RegExp(`(<${tag}${idAttr}>)([\\s\\S]*?)(</${tag}>)`, "i");
  return html.replace(re, `$1${content}$3`);
}

function replaceMetaByName(html: string, name: string, content: string): string {
  const re = new RegExp(
    `(<meta\\s+[^>]*name=["']${name}["'][^>]*content=)(["'])(.*?)\\2`,
    "i",
  );
  if (re.test(html)) return html.replace(re, `$1$2${content}$2`);
  const re2 = new RegExp(
    `(<meta\\s+[^>]*content=)(["'])(.*?)\\2([^>]*name=["']${name}["'])`,
    "i",
  );
  return html.replace(re2, `$1$2${content}$2$4`);
}

function replaceMetaByProperty(
  html: string,
  property: string,
  content: string,
): string {
  const re = new RegExp(
    `(<meta\\s+[^>]*property=["']${property}["'][^>]*content=)(["'])(.*?)\\2`,
    "i",
  );
  if (re.test(html)) return html.replace(re, `$1$2${content}$2`);
  const re2 = new RegExp(
    `(<meta\\s+[^>]*content=)(["'])(.*?)\\2([^>]*property=["']${property}["'])`,
    "i",
  );
  return html.replace(re2, `$1$2${content}$2$4`);
}

function hreflangBlock(): string {
  const links = LOCALES.map(
    (loc) =>
      `    <link rel="alternate" hreflang="${loc}" href="${localeUrl(loc)}" />`,
  );
  links.push(
    `    <link rel="alternate" hreflang="x-default" href="${localeUrl(X_DEFAULT_LOCALE)}" />`,
  );
  return links.join("\n");
}

function langOptionHtml(
  loc: Locale,
  current: Locale,
  pathSuffix = "",
): string {
  const active = loc === current ? " active" : "";
  const aria =
    loc === current ? ' aria-current="page"' : ' aria-current="false"';
  return `<a href="${localePath(loc)}${pathSuffix}" class="lang-option${active}" id="lang-${loc}" data-locale="${loc}" hreflang="${loc}" lang="${loc}"${aria}>${localeFlagHtml(loc)}<span class="lang-name">${LOCALE_NATIVE_NAME[loc]}</span></a>`;
}

function langSwitcherHtml(
  current: Locale,
  ariaLabel: string,
  pathSuffix = "",
): string {
  const options = LOCALES.map((loc) =>
    langOptionHtml(loc, current, pathSuffix),
  ).join("\n            ");
  return `<details class="lang">
          <summary class="lang-summary" aria-label="${ariaLabel}">
            ${localeFlagHtml(current)}
            <span class="lang-current-name">${LOCALE_NATIVE_NAME[current]}</span>
          </summary>
          <div class="lang-menu" role="list">
            ${options}
          </div>
        </details>`;
}

function escapeAttr(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function topbarActionsHtml(locale: Locale, pathSuffix = ""): string {
  return `<div class="topbar-actions">
          <a
            class="github-link"
            href="https://github.com/dmosktest/supermail"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg class="github-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
          <a
            class="telegram-link"
            href="https://t.me/dmosk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            title="Telegram"
          >
            <svg class="telegram-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
              />
            </svg>
          </a>
          ${langSwitcherHtml(locale, t(locale, "langSwitch"), pathSuffix)}
        </div>`;
}

function privacyHreflangBlock(): string {
  const links = LOCALES.map(
    (loc) =>
      `    <link rel="alternate" hreflang="${loc}" href="${localeUrl(loc)}privacy/" />`,
  );
  links.push(
    `    <link rel="alternate" hreflang="x-default" href="${localeUrl(X_DEFAULT_LOCALE)}privacy/" />`,
  );
  return links.join("\n");
}

function applyHtmlLangDir(html: string, locale: Locale): string {
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  if (/<html\b[^>]*>/i.test(html)) {
    return html.replace(/<html\b[^>]*>/i, `<html lang="${locale}" dir="${dir}">`);
  }
  return html;
}

export function localizeIndexHtml(html: string, locale: Locale): string {
  const copy = getSeoCopy(locale);
  const pageUrl = localeUrl(locale);
  let out = applyHtmlLangDir(html, locale);

  out = replaceTagContent(out, "title", null, copy.title);
  out = out.replace(
    /<link\s+rel=["']manifest["'][^>]*>/i,
    `<link rel="manifest" href="${localePath(locale)}manifest.webmanifest" />`,
  );
  out = replaceMetaByName(out, "robots", ROBOTS_META);
  out = replaceMetaByName(out, "description", copy.description);
  out = out.replace(/\s*<meta\s+[^>]*name=["']keywords["'][^>]*>/i, "");
  out = out.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${pageUrl}" />`,
  );
  out = out.replace(
    /(?:\s*<link\s+rel=["']alternate["']\s+hreflang=["'][^"']+["'][^>]*>)+/i,
    `\n${hreflangBlock()}`,
  );
  out = replaceMetaByProperty(out, "og:url", pageUrl);
  out = replaceMetaByProperty(out, "og:title", copy.title);
  out = replaceMetaByProperty(out, "og:description", copy.description);
  out = replaceMetaByProperty(out, "og:locale", ogLocale(locale));
  out = out.replace(
    /(?:\s*<meta\s+property=["']og:locale:alternate["'][^>]*>)+/i,
    ogLocaleAlternates(locale)
      .map(
        (alt) =>
          `\n    <meta property="og:locale:alternate" content="${alt}" />`,
      )
      .join(""),
  );

  out = replaceTagContent(out, "h1", "heading", copy.heading);
  out = replaceTagContent(out, "p", "lead", copy.leadHtml);
  out = out.replace(
    /(<p class=["']noscript["'][^>]*>)([\s\S]*?)(<\/p>)/i,
    `$1${t(locale, "noscript")}$3`,
  );
  out = replaceTagContent(out, "article", "seo-root", renderSeoHtml(locale));
  out = replaceTagContent(out, "p", "inbox-lead", t(locale, "inboxLead"));
  out = replaceTagContent(out, "p", "your-address-label", t(locale, "yourAddress"));
  out = replaceTagContent(out, "button", "copy-btn", t(locale, "copy"));
  out = replaceTagContent(out, "button", "new-btn", t(locale, "newAddress"));
  out = replaceTagContent(out, "span", "grade-label", t(locale, "gradeLabel"));
  out = replaceTagContent(out, "p", "report-share-label", t(locale, "reportShareLabel"));
  out = replaceTagContent(out, "span", "report-rule-label", t(locale, "reportRuleLabel"));
  out = replaceTagContent(out, "p", "report-pillars-title", t(locale, "reportPillarsTitle"));
  out = replaceTagContent(out, "button", "report-share-copy", t(locale, "copy"));
  out = replaceTagContent(out, "button", "retest-btn", t(locale, "retest"));
  out = replaceTagContent(out, "h2", "findings-title", t(locale, "findingsTitle"));
  out = out.replace(
    /<div class=["']filters["'] id=["']findings-filters["'][^>]*>/i,
    `<div class="filters" id="findings-filters" role="tablist" aria-label="${t(locale, "filterAria")}">`,
  );
  out = out.replace(
    /(<button[^>]*data-filter=["']all["'][^>]*>)([\s\S]*?)(<\/button>)/i,
    `$1${t(locale, "filterAll")}$3`,
  );
  out = out.replace(
    /(<button[^>]*data-filter=["']fail["'][^>]*>)([\s\S]*?)(<\/button>)/i,
    `$1${t(locale, "filterFail")}$3`,
  );
  out = out.replace(
    /(<button[^>]*data-filter=["']pass["'][^>]*>)([\s\S]*?)(<\/button>)/i,
    `$1${t(locale, "filterPass")}$3`,
  );
  out = replaceTagContent(out, "span", "ai-brief-btn-text", t(locale, "downloadAiBrief"));
  out = replaceTagContent(out, "span", "admin-brief-btn-text", t(locale, "downloadAdminBrief"));
  out = replaceTagContent(out, "h2", "mail-meta-title", t(locale, "mailMetaTitle"));
  out = replaceTagContent(out, "h2", "headers-title", t(locale, "headersTitle"));
  out = replaceTagContent(out, "button", "headers-copy", t(locale, "copy"));
  out = replaceTagContent(out, "p", "headers-empty", t(locale, "headersEmpty"));
  out = replaceTagContent(out, "button", "export-pdf-btn", t(locale, "exportPdf"));
  out = out.replace(
    /(<a[^>]*id=["']privacy-link["'][^>]*href=["'])[^"']*(["'][^>]*>)([\s\S]*?)(<\/a>)/i,
    `$1${localePath(locale)}privacy/$2${t(locale, "privacyLink")}$4`,
  );

  out = out.replace(
    /<(?:div|details)[^>]*class=["'][^"']*\blang\b[^"']*["'][^>]*>[\s\S]*?<\/(?:div|details)>/i,
    langSwitcherHtml(locale, t(locale, "langSwitch")),
  );

  out = out.replace(
    /<script type=["']application\/ld\+json["'] id=["']ld-app["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="ld-app">${JSON.stringify(buildAppJsonLd(locale))}</script>`,
  );
  out = out.replace(
    /<script type=["']application\/ld\+json["'] id=["']ld-faq["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="ld-faq">${JSON.stringify(buildFaqJsonLd(locale))}</script>`,
  );

  return out;
}

export function renderNotFoundHtml(locale: Locale): string {
  const copy = NOT_FOUND_COPY[locale] ?? NOT_FOUND_COPY.en;
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>${copy.title}</title>
    <meta name="robots" content="noindex, nofollow" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: "Segoe UI", sans-serif;
        background: #17110c;
        color: #f6eee6;
      }
      main { text-align: center; padding: 2rem; }
      a { color: #f0852a; }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>${copy.message}</p>
      <p><a href="${localePath(locale)}">${copy.home}</a></p>
    </main>
  </body>
</html>
`;
}

export function renderPrivacyHtml(
  locale: Locale,
  opts: { cssHref?: string } = {},
): string {
  const copy = PRIVACY_COPY[locale] ?? PRIVACY_COPY.en;
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  const pageUrl = `${localeUrl(locale)}privacy/`;
  const cssLink = opts.cssHref
    ? `    <link rel="stylesheet" href="${escapeAttr(opts.cssHref)}" />\n`
    : "";
  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${ROBOTS_META}" />
    <meta name="theme-color" content="#17110c" />
    <title>${escapeAttr(copy.title)}</title>
    <meta name="description" content="${escapeAttr(copy.lead)}" />
    <link rel="canonical" href="${pageUrl}" />
${privacyHreflangBlock()}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;600&display=optional"
      rel="stylesheet"
    />
${cssLink}  </head>
  <body>
    <main class="wrap privacy-page">
      <div class="topbar">
        <p class="brand"><a href="https://dmosk.net/">dmosk</a> / <a href="${localePath(locale)}">supermail</a></p>
        ${topbarActionsHtml(locale, "privacy/")}
      </div>

      <h1>${copy.heading}</h1>
      <p class="lead">${copy.lead}</p>

      <section class="panel privacy-panel">
        <div class="privacy-body">
          ${copy.bodyHtml}
        </div>
      </section>

      <p class="site-links"><a href="${localePath(locale)}">${copy.home}</a></p>
    </main>
  </body>
</html>
`;
}

export function renderSitemapXml(): string {
  const pageAlts = (pathSuffix: string) =>
    [
      ...LOCALES.map(
        (loc) =>
          `    <xhtml:link rel="alternate" hreflang="${loc}" href="${localeUrl(loc)}${pathSuffix}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl(X_DEFAULT_LOCALE)}${pathSuffix}"/>`,
    ].join("\n");
  const urls = [
    ...LOCALES.map(
      (loc) => `  <url>
    <loc>${localeUrl(loc)}</loc>
${pageAlts("")}
  </url>`,
    ),
    ...LOCALES.map(
      (loc) => `  <url>
    <loc>${localeUrl(loc)}privacy/</loc>
${pageAlts("privacy/")}
  </url>`,
    ),
  ].join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export function renderRobotsTxt(): string {
  const disallow = ALLOW_INDEX ? "" : "Disallow: /";
  return `User-agent: *
${disallow}
Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}
