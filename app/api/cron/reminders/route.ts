import { createHash, timingSafeEqual } from "node:crypto";
import { purgeExpired, sendDueReminders } from "@/lib/booking/service";

// Appointment reminders (about 6 hours ahead, quiet 22:00–08:00 Tehran) plus the
// daily data clean-up. Call every 15 minutes with `Authorization: Bearer
// $CRON_SECRET` from the server's crontab (docs/DEPLOY.md). The Vercel test
// deploy only runs it once a day (vercel.json; Hobby allows no more).
// Each appointment is reminded once, so extra or overlapping calls are harmless.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const digest = (v: string) => createHash("sha256").update(v).digest();
  const given = req.headers.get("authorization") ?? "";
  if (!secret || !timingSafeEqual(digest(given), digest(`Bearer ${secret}`))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const sent = await sendDueReminders();
  const purged = await purgeExpired();
  return Response.json({ sent, purged });
}
