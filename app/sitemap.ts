import type { MetadataRoute } from "next";
import { articles } from "@/content/journal";
import { COPY_APPROVED, services } from "@/content/services";
import { INTL_UPDATED } from "@/content/i18n/services";
import { intlLocales, intlOnlyPaths, isTranslated, localePath, locales } from "@/lib/i18n";
import { abs } from "@/lib/seo";

// Only pages with a real content date carry lastModified. A build-time stamp
// would claim every page changed on every deploy, so the rest omit it.
// changefreq and priority are ignored by Google and left out.
const pages = ["/", "/booking", "/about", "/dentist-maaliabad-shiraz", "/visit-from-nearby-cities", "/services", "/gallery", "/journal", "/privacy", "/booking-policy"];

// A page that exists in more than one language is listed once per language, each entry
// pointing at all of its versions (Google's hreflang-in-sitemap format). `modified` is the
// Persian page's content date; the Arabic and English versions carry INTL_UPDATED.
function pageEntries(path: string, modified?: Date, intlModified: Date = new Date(INTL_UPDATED)): MetadataRoute.Sitemap {
  if (!isTranslated(path)) return [{ url: abs(path), ...(modified ? { lastModified: modified } : {}) }];
  const languages = { ...Object.fromEntries(locales.map((l) => [l, abs(localePath(l, path))])), "x-default": abs(localePath("fa", path)) };
  return locales.map((l) => ({
    url: abs(localePath(l, path)),
    alternates: { languages },
    ...(modified ? { lastModified: l === "fa" ? modified : intlModified } : {}),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.flatMap((path) => pageEntries(path)),
    ...services.flatMap((s) => pageEntries(s.href, new Date(s.updatedAt ?? s.reviewedAt ?? COPY_APPROVED))),
    ...intlOnlyPaths.flatMap((path) => {
      const languages = { ...Object.fromEntries(intlLocales.map((l) => [l, abs(localePath(l, path))])), "x-default": abs(localePath("en", path)) };
      return intlLocales.map((l) => ({ url: abs(localePath(l, path)), alternates: { languages }, lastModified: new Date(INTL_UPDATED) }));
    }),
    ...articles.flatMap((a) => {
      const own = new Date(a.updated ?? a.published);
      return pageEntries(`/journal/${a.slug}`, own, own > new Date(INTL_UPDATED) ? own : new Date(INTL_UPDATED));
    }),
  ];
}
