import { createHash, timingSafeEqual } from "node:crypto";
import { purgeExpired, sendReminders } from "@/lib/booking/service";
import { addDays, dayKeyOf, tehranToUtc } from "@/lib/time";

// Day-before reminder SMS. Vercel Cron calls this daily at 14:30 UTC (18:00
// Tehran) with `Authorization: Bearer $CRON_SECRET`. On another host, call it
// from a cron job the same way. Each appointment is reminded at most once.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const digest = (v: string) => createHash("sha256").update(v).digest();
  const given = req.headers.get("authorization") ?? "";
  if (!secret || !timingSafeEqual(digest(given), digest(`Bearer ${secret}`))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const tomorrow = addDays(dayKeyOf(new Date()), 1);
  const sent = await sendReminders(tehranToUtc(tomorrow, "00:00"), tehranToUtc(addDays(tomorrow, 1), "00:00"));
  const purged = await purgeExpired();
  return Response.json({ day: tomorrow, sent, purged });
}
