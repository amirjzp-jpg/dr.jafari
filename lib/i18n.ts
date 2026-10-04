// Languages. Persian is the default and stays at the root; Arabic and English live
// under /ar and /en (BUILD-SPEC.md and docs/decisions.md, "Languages").

export const locales = ["fa", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const intlLocales = ["ar", "en"] as const;
export type IntlLocale = (typeof intlLocales)[number];

export const isIntl = (v: string): v is IntlLocale => (intlLocales as readonly string[]).includes(v);

export const dirOf = (lang: Locale): "rtl" | "ltr" => (lang === "en" ? "ltr" : "rtl");
export const ogLocale: Record<Locale, string> = { fa: "fa_IR", ar: "ar_AR", en: "en_US" };

/**
 * Persian paths that also exist in Arabic and English. A page is added here only
 * when its translation ships, so the language switcher, hreflang tags, sitemap and
 * menus never point at a page that does not exist.
 */
export const translatedPaths: readonly string[] = ["/"];

export const isTranslated = (path: string) => translatedPaths.includes(path);

/** "/about" in language `lang`: Persian keeps the bare path, the others get a prefix. */
export function localePath(lang: Locale, path: string): string {
  if (lang === "fa") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** The localized path when this page has a translation, else null. */
export function localeHref(lang: Locale, path: string): string | null {
  return lang === "fa" || isTranslated(path) ? localePath(lang, path) : null;
}

/** Split a pathname into its language and the Persian-style path ("/ar/about" → ar, "/about"). */
export function splitLocale(pathname: string): { lang: Locale; path: string } {
  const m = /^\/(ar|en)(\/.*)?$/.exec(pathname);
  if (!m) return { lang: "fa", path: pathname || "/" };
  return { lang: m[1] as IntlLocale, path: m[2] || "/" };
}

/** Where the language switcher sends a visitor: the same page, or that language's home page. */
export function switchTarget(pathname: string, to: Locale): string {
  const { path } = splitLocale(pathname);
  return localePath(to, to === "fa" || isTranslated(path) ? path : "/");
}

export const languageNames: Record<Locale, string> = { fa: "فارسی", ar: "العربية", en: "English" };
