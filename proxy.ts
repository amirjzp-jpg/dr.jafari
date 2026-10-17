import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { botInfo, recordHit } from "@/lib/traffic";

// Crawlers don't run JavaScript, so the beacon never sees them. Log search and AI crawler visits here (for the traffic tab).
export function proxy(req: NextRequest, event: NextFetchEvent) {
  const ua = req.headers.get("user-agent") ?? "";
  const bot = ua ? botInfo(ua) : null;
  if (bot && bot.kind !== "other") {
    event.waitUntil(recordHit({ kind: "bot", path: req.nextUrl.pathname, ua, bot }).catch(() => {}));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|admin|.*\\.(?:png|jpe?g|webp|avif|svg|ico|css|js|woff2?|map|mp4|json)$).*)"],
};
