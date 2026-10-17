// On-demand SEO / AEO / GEO self-audit: fetches the site's own sitemap pages and checks them.
export type PageAudit = {
  path: string; status: number; ms: number; title: string; titleLen: number; descLen: number; h1: number;
  canonical: boolean; hreflang: number; xdefault: boolean; ld: string[]; noindex: boolean; issues: string[];
};
export type AuditResult = { base: string; pages: PageAudit[]; sitemapUrls: number; robotsOk: boolean; aiBlocked: string[]; llmsTxt: boolean; sitemapRef: boolean };

const AI_UAS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot", "OAI-SearchBot"];

async function get(url: string): Promise<{ status: number; text: string; ms: number }> {
  const t = Date.now();
  try {
    const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "user-agent": "site-self-audit" } });
    return { status: r.status, text: await r.text(), ms: Date.now() - t };
  } catch {
    return { status: 0, text: "", ms: Date.now() - t };
  }
}

function auditHtml(path: string, r: { status: number; text: string; ms: number }): PageAudit {
  const h = r.text;
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(h)?.[1].trim() ?? "";
  const desc = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i.exec(h)?.[1] ?? "";
  const h1 = (h.match(/<h1[\s>]/gi) ?? []).length;
  const hreflang = (h.match(/<link[^>]+hrefLang=/gi) ?? []).length || (h.match(/<link[^>]+hreflang=/gi) ?? []).length;
  const ld = [...h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => {
    try {
      const j = JSON.parse(m[1]);
      return (Array.isArray(j) ? j : j["@graph"] ?? [j]).map((x: { "@type"?: string }) => String(x["@type"] ?? "?"));
    } catch {
      return ["invalid"];
    }
  });
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(h);
  const issues: string[] = [];
  if (r.status !== 200) issues.push(`HTTP ${r.status}`);
  if (!title) issues.push("no title"); else if (title.length > 65) issues.push("title > 65");
  if (!desc) issues.push("no description"); else if (desc.length > 165) issues.push("description > 165");
  if (h1 !== 1) issues.push(`${h1} × H1`);
  if (!/rel=["']canonical["']/i.test(h)) issues.push("no canonical");
  if (noindex) issues.push("noindex");
  if (ld.includes("invalid")) issues.push("invalid JSON-LD");
  if (r.ms > 1500) issues.push("slow (> 1.5 s)");
  return { path, status: r.status, ms: r.ms, title, titleLen: title.length, descLen: desc.length, h1, canonical: /rel=["']canonical["']/i.test(h), hreflang, xdefault: /hreflang=["']x-default/i.test(h) || /hrefLang=["']x-default/i.test(h), ld, noindex, issues };
}

export async function runAudit(): Promise<AuditResult> {
  const base = process.env.AUDIT_BASE ?? `http://127.0.0.1:${process.env.PORT ?? 3000}`;
  const sm = await get(`${base}/sitemap.xml`);
  const paths = [...new Set([...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))].slice(0, 120);
  const pages: PageAudit[] = [];
  for (let i = 0; i < paths.length; i += 6) {
    pages.push(...(await Promise.all(paths.slice(i, i + 6).map(async (p) => auditHtml(p, await get(base + p))))));
  }
  const robots = await get(`${base}/robots.txt`);
  const llms = await get(`${base}/llms.txt`);
  const aiBlocked = AI_UAS.filter((ua) => new RegExp(`user-agent:\\s*${ua}[\\s\\S]*?disallow:\\s*/\\s*(\\n|$)`, "i").test(robots.text));
  return { base, pages, sitemapUrls: paths.length, robotsOk: robots.status === 200, aiBlocked, llmsTxt: llms.status === 200 && llms.text.length > 50, sitemapRef: /sitemap:/i.test(robots.text) };
}
