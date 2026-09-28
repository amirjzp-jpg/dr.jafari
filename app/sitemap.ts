import type { MetadataRoute } from "next";
import { articles } from "@/content/journal";
import { services } from "@/content/services";
import { abs } from "@/lib/seo";

// Pages without a content date use the build time as lastModified.
const buildTime = new Date();

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/booking", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.6, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/booking-policy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({
      url: abs(p.path),
      lastModified: buildTime,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...services.map((s) => ({
      url: abs(s.href),
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: s.featured ? 0.9 : 0.7,
    })),
    ...articles.map((a) => ({
      url: abs(`/journal/${a.slug}`),
      lastModified: new Date(a.published),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
