import type { MetadataRoute } from "next";
import { articles } from "@/content/journal";
import { services } from "@/content/services";
import { abs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about", "/services", "/journal", "/booking", "/privacy", "/booking-policy"];
  return [
    ...pages.map((p) => ({ url: abs(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...services.map((s) => ({ url: abs(s.href), changeFrequency: "monthly" as const, priority: s.featured ? 0.9 : 0.6 })),
    ...articles.map((a) => ({ url: abs(`/journal/${a.slug}`), lastModified: a.published, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
