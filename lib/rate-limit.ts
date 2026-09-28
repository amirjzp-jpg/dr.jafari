import { query, type Db } from "./db";

/**
 * Sliding-window limiter stored in Postgres (no extra infrastructure).
 * Records a hit and returns whether it is within `limit` hits per `windowSeconds`.
 */
export async function hit(key: string, limit: number, windowSeconds: number, db?: Db): Promise<boolean> {
  const { rows } = await query<{ n: string }>(
    `WITH ins AS (INSERT INTO rate_events (key) VALUES ($1))
     SELECT count(*) AS n FROM rate_events
     WHERE key = $1 AND created_at > now() - make_interval(secs => $2)`,
    [key, windowSeconds],
    db,
  );
  // The CTE's insert is not visible to the count in the same statement, so add 1.
  const count = Number(rows[0].n) + 1;
  if (Math.random() < 0.01) {
    void query("DELETE FROM rate_events WHERE created_at < now() - interval '2 days'", [], db).catch(() => {});
  }
  return count <= limit;
}

export const LIMITS = {
  holdsPerIpPerHour: 10,
  otpSendsPerIpPerHour: 10,
  otpVerifiesPerIpPerHour: 30,
  /** Live holds one IP may have at once, so a few clients can't lock the calendar. Not lower: mobile carriers share one IP across many phones. */
  liveHoldsPerIp: 5,
  /** Ceiling on patient OTP texts across the whole site: caps the cost of SMS-pumping abuse. */
  bookingOtpSendsPerHour: 60,
} as const;
