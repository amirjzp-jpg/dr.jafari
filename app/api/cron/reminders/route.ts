import { sendReminders } from "@/lib/booking/service";
import { addDays, dayKeyOf, tehranToUtc } from "@/lib/time";

// Day-before reminder SMS. Vercel Cron calls this daily at 14:30 UTC (18:00
// Tehran) with `Authorization: Bearer $CRON_SECRET`. On another host, call it
// from a cron job the same way. Each appointment is reminded at most once.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const tomorrow = addDays(dayKeyOf(new Date()), 1);
  const sent = await sendReminders(tehranToUtc(tomorrow, "00:00"), tehranToUtc(addDays(tomorrow, 1), "00:00"));
  return Response.json({ day: tomorrow, sent });
}
