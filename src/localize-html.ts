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

function langOptionHtml(loc: Locale, current: Locale): string {
  const active = loc === current ? " active" : "";
  const aria =
    loc === current ? ' aria-current="page"' : ' aria-current="false"';
  return `<a href="${localePath(loc)}" class="lang-option${active}" id="lang-${loc}" data-locale="${loc}" hreflang="${loc}" lang="${loc}"${aria}>${localeFlagHtml(loc)}<span class="lang-name">${LOCALE_NATIVE_NAME[loc]}</span></a>`;
}

function langSwitcherHtml(current: Locale, ariaLabel: string): string {
  const options = LOCALES.map((loc) => langOptionHtml(loc, current)).join(
    "\n            ",
  );
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
  out = replaceTagContent(out, "h2", "blacklist-title", t(locale, "blacklistTitle"));
  out = replaceTagContent(out, "h2", "dns-hints-title", t(locale, "dnsHintsTitle"));
  out = replaceTagContent(out, "button", "export-json-btn", t(locale, "exportJson"));
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

export function renderPrivacyHtml(locale: Locale): string {
  const copy = PRIVACY_COPY[locale];
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  const pageUrl = `${localeUrl(locale)}privacy/`;
  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${ROBOTS_META}" />
    <title>${copy.title}</title>
    <meta name="description" content="${copy.lead}" />
    <link rel="canonical" href="${pageUrl}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <style>
      body{margin:0;font-family:system-ui,sans-serif;background:#17110c;color:#f3ebe3;line-height:1.55}
      .wrap{max-width:42rem;margin:0 auto;padding:1.5rem 1rem 3rem}
      a{color:#f0852a} h1{font-size:1.6rem} .lead{color:#cbb8a6}
      ul{padding-left:1.2rem} li{margin:.4rem 0}
    </style>
  </head>
  <body>
    <main class="wrap">
      <p class="brand"><a href="https://dmosk.net/">dmosk</a> / supermail</p>
      <h1>${copy.heading}</h1>
      <p class="lead">${copy.lead}</p>
      ${copy.bodyHtml}
      <p><a href="${localePath(locale)}">${copy.home}</a></p>
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
