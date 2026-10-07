import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const privatePaths = ["/admin", "/api/"];

// AI search and answer engines: explicitly welcome on public pages so the
// clinic can be cited in AI answers. Private paths stay blocked for them too.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      { userAgent: aiCrawlers, allow: "/", disallow: privatePaths },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
