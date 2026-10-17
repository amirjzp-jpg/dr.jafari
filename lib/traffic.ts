import { createHash } from "node:crypto";
import { query } from "./db";

/** Phones allowed to open the traffic tab (TRAFFIC_PHONES, comma-separated). Not committed: set it in the env file. */
export function trafficPhones(): Set<string> {
  return new Set((process.env.TRAFFIC_PHONES ?? "").split(",").map((s) => s.trim()).filter(Boolean));
}

// ---------------------------------------------------------------- user agents

const AI_BOTS = /(GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|Bytespider|CCBot|Amazonbot|Applebot-Extended|Meta-ExternalAgent|meta-externalfetcher|cohere-ai|YouBot|DuckAssistBot|MistralAI-User|Google-CloudVertexBot|Google-Extended)/i;
const SEARCH_BOTS = /(Googlebot|Google-InspectionTool|AdsBot-Google|bingbot|BingPreview|YandexBot|DuckDuckBot|Baiduspider|Applebot|Slurp|Neevabot)/i;
const OTHER_BOTS = /(bot|crawler|spider|crawl|slurp|headless|lighthouse|curl|wget|python-requests|axios|go-http-client)/i;

export function botInfo(ua: string): { name: string; kind: "ai" | "search" | "other" } | null {
  const ai = ua.match(AI_BOTS);
  if (ai) return { name: ai[1], kind: "ai" };
  const se = ua.match(SEARCH_BOTS);
  if (se) return { name: se[1], kind: "search" };
  const ot = ua.match(OTHER_BOTS);
  return ot ? { name: ot[1].toLowerCase(), kind: "other" } : null;
}

export function parseUa(ua: string): { device: string; browser: string; os: string } {
  const device = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua) ? "tablet" : /Mobi|iPhone|Android/i.test(ua) ? "mobile" : "desktop";
  const browser = /Instagram/i.test(ua) ? "Instagram (in-app)" : /FBAN|FBAV/i.test(ua) ? "Facebook (in-app)" : /Telegram/i.test(ua) ? "Telegram (in-app)"
    : /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /SamsungBrowser/.test(ua) ? "Samsung Internet"
    : /Firefox|FxiOS/.test(ua) ? "Firefox" : /Chrome|CriOS/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Other";
  const os = /Windows/.test(ua) ? "Windows" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android"
    : /Mac OS X|Macintosh/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
  return { device, browser, os };
}

// ---------------------------------------------------------------- referrers

const AI_REF = /(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|poe\.com|phind\.com|kagi\.com)$/;
const SEARCH_REF = /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yandex\.[a-z]+|yahoo\.com|ecosia\.org|baidu\.com)$/;
const SOCIAL_REF = /(^|\.)(instagram\.com|facebook\.com|t\.me|telegram\.org|whatsapp\.com|wa\.me|x\.com|twitter\.com|linkedin\.com|youtube\.com|pinterest\.com|aparat\.com|eitaa\.com|rubika\.ir)$/;

export function classifyRef(host: string | null): "direct" | "search" | "ai" | "social" | "other" {
  if (!host) return "direct";
  if (AI_REF.test(host)) return "ai";
  if (SEARCH_REF.test(host)) return "search";
  if (SOCIAL_REF.test(host)) return "social";
  return "other";
}

export const langOfPath = (p: string) => (/^\/(ar|en)(\/|$)/.exec(p)?.[1] ?? "fa");

/** Daily-rotating visitor hash: counts unique visitors per day without storing an IP or setting a cookie. */
export function visitorId(ip: string, ua: string, now = new Date()): string {
  const day = now.toISOString().slice(0, 10);
  return createHash("sha256").update(`${day}|${ip}|${ua}|${process.env.OTP_SECRET ?? ""}`).digest("hex").slice(0, 16);
}

export type HitInput = {
  kind: "view" | "bot";
  path: string;
  refHost?: string | null;
  utmSource?: string | null;
  ua: string;
  sid?: string | null;
  bot?: { name: string; kind: string } | null;
};

export async function recordHit(h: HitInput): Promise<void> {
  const { device, browser, os } = h.kind === "view" ? parseUa(h.ua) : { device: null, browser: null, os: null };
  await query(
    `INSERT INTO analytics_hits (kind, path, lang, ref_host, ref_kind, utm_source, device, browser, os, bot_name, bot_kind, sid)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [h.kind, h.path.slice(0, 200), langOfPath(h.path), h.refHost ?? null, h.kind === "view" ? classifyRef(h.refHost ?? null) : null,
     h.utmSource?.slice(0, 60) ?? null, device, browser, os, h.bot?.name ?? null, h.bot?.kind ?? null, h.sid ?? null],
  );
  if (Math.random() < 0.002) void query("DELETE FROM analytics_hits WHERE at < now() - interval '400 days'").catch(() => {});
}
