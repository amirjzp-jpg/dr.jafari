import { NextResponse, type NextRequest } from "next/server";
import { clientIp } from "@/lib/auth/session";
import { botInfo, recordHit, visitorId } from "@/lib/traffic";

// Cookieless page-view beacon. Humans only (crawlers are logged by proxy.ts). No IP is stored.
const seen = new Map<string, { n: number; t: number }>();

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (botInfo(ua)) return new NextResponse(null, { status: 204 });
  const ip = await clientIp();
  const now = Date.now();
  const s = seen.get(ip);
  if (!s || now - s.t > 60_000) seen.set(ip, { n: 1, t: now });
  else if (++s.n > 120) return new NextResponse(null, { status: 429 });
  if (seen.size > 5000) seen.clear();

  let body: { p?: unknown; r?: unknown; u?: unknown } = {};
  try {
    body = JSON.parse(await req.text());
  } catch {}
  const path = typeof body.p === "string" ? body.p.split(/[?#]/)[0] : "";
  if (!path.startsWith("/") || path.length > 200 || path.startsWith("/admin") || path.startsWith("/api")) return new NextResponse(null, { status: 204 });
  let refHost: string | null = null;
  if (typeof body.r === "string" && body.r) {
    try {
      const u = new URL(body.r);
      if (u.hostname !== req.nextUrl.hostname) refHost = u.hostname.replace(/^www\./, "").slice(0, 100);
    } catch {}
  }
  const utm = typeof body.u === "string" && body.u ? body.u : null;
  await recordHit({ kind: "view", path, refHost, utmSource: utm, ua, sid: visitorId(ip, ua) }).catch(() => {});
  return new NextResponse(null, { status: 204 });
}
