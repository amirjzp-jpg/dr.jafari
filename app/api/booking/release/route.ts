import { releaseHolds } from "@/lib/booking/service";
import { bookingSessionId } from "@/lib/auth/session";

// Called with navigator.sendBeacon when the patient leaves the booking flow.
// Best effort only: an abandoned hold also frees itself when it expires.
export async function POST() {
  const sessionId = await bookingSessionId(false);
  if (sessionId) await releaseHolds(sessionId);
  return new Response(null, { status: 204 });
}
