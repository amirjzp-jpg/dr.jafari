import type { MetadataRoute } from "next";
import { articles } from "@/content/journal";
import { COPY_APPROVED, services } from "@/content/services";
import { isTranslated, localePath, locales } from "@/lib/i18n";
import { abs } from "@/lib/seo";

// Only pages with a real content date carry lastModified. A build-time stamp
// would claim every page changed on every deploy, so the rest omit it.
// changefreq and priority are ignored by Google and left out.
const pages = ["/", "/booking", "/about", "/dentist-maaliabad-shiraz", "/services", "/gallery", "/journal", "/privacy", "/booking-policy"];

// A page that exists in more than one language is listed once per language, each entry
// pointing at all of its versions (Google's hreflang-in-sitemap format).
function pageEntries(path: string): MetadataRoute.Sitemap {
  if (!isTranslated(path)) return [{ url: abs(path) }];
  const languages = Object.fromEntries(locales.map((l) => [l, abs(localePath(l, path))]));
  return locales.map((l) => ({ url: abs(localePath(l, path)), alternates: { languages } }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.flatMap(pageEntries),
    ...services.map((s) => ({ url: abs(s.href), lastModified: new Date(s.updatedAt ?? s.reviewedAt ?? COPY_APPROVED) })),
    ...articles.map((a) => ({ url: abs(`/journal/${a.slug}`), lastModified: new Date(a.updated ?? a.published) })),
  ];
}
