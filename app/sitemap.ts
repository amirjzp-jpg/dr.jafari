import type { MetadataRoute } from "next";
import { articles } from "@/content/journal";
import { COPY_APPROVED, services } from "@/content/services";
import { abs } from "@/lib/seo";

// Only pages with a real content date carry lastModified. A build-time stamp
// would claim every page changed on every deploy, so the rest omit it.
// changefreq and priority are ignored by Google and left out.
const pages = ["/", "/booking", "/about", "/dentist-maaliabad-shiraz", "/services", "/gallery", "/journal", "/privacy", "/booking-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({ url: abs(path) })),
    ...services.map((s) => ({ url: abs(s.href), lastModified: new Date(s.updatedAt ?? s.reviewedAt ?? COPY_APPROVED) })),
    ...articles.map((a) => ({ url: abs(`/journal/${a.slug}`), lastModified: new Date(a.updated ?? a.published) })),
  ];
}
