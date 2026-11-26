import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { botInfo, recordHit } from "@/lib/traffic";

// Maintenance mode: MAINTENANCE=1 in /etc/dr-jafari.env (deploy/maintenance.sh on|off).
// Every request, admin and API included, gets a 503 "under maintenance" page. 503 with
// Retry-After tells search engines the outage is temporary, so rankings are kept.
// Only the internal reminder job stays open, so booked patients still get their SMS.
const MAINTENANCE_PAGE = `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>در حال تعمیر و نگهداری</title>
<style>html,body{height:100%;margin:0}body{display:flex;align-items:center;justify-content:center;background:#F8F7F3;color:#1C2733;font-family:Vazirmatn,Tahoma,system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
h1{font-size:28px;font-weight:600;margin:0 0 12px}p{margin:4px 0;color:#5B6573;font-size:15px}</style></head>
<body><main><h1>در حال تعمیر و نگهداری</h1><p dir="rtl" lang="ar">قيد الصيانة</p><p dir="ltr" lang="en">Under maintenance</p></main></body></html>`;

// Pages only (not assets, API or admin) are logged for the traffic tab.
const PAGE = /^\/(?!_next\/|api\/|admin)(?!.*\.(?:png|jpe?g|webp|avif|svg|ico|css|js|woff2?|map|mp4|json|txt|xml)$)/;

export function proxy(req: NextRequest, event: NextFetchEvent) {
  const path = req.nextUrl.pathname;
  if (process.env.MAINTENANCE === "1" && !path.startsWith("/api/cron/")) {
    return new NextResponse(MAINTENANCE_PAGE, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8", "Retry-After": "3600", "Cache-Control": "no-store" },
    });
  }
  if (!PAGE.test(path)) return NextResponse.next();
  // Crawlers don't run JavaScript, so the beacon never sees them. Log search and AI crawler visits here (for the traffic tab).
  const ua = req.headers.get("user-agent") ?? "";
  const bot = ua ? botInfo(ua) : null;
  if (bot && bot.kind !== "other") {
    event.waitUntil(recordHit({ kind: "bot", path, ua, bot }).catch(() => {}));
  }
  return NextResponse.next();
}

// Everything except Next's own build assets passes through, so maintenance mode covers the whole site.
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
