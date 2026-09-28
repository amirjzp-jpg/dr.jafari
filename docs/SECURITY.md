# Security model

How the site protects patient data and the booking system, and what a new host must keep.

## Data access

- The database is reachable only from the server, with credentials held in an env var (`DATABASE_URL`). No browser code talks to the database, and there is no public API key. Postgres Row Level Security therefore adds nothing here: RLS matters when clients query the database directly (as with Supabase's anon key). Access control lives in server code instead:
  - every admin page **and** every admin server action calls `requireAdmin()`;
  - patient actions only touch the hold owned by their own session cookie;
  - all SQL is parameterized (`$1`, `$2`, …); no string-built queries.
- Connections use TLS with certificate verification (`sslmode=verify-full`, see `lib/database-url.mjs`).
- Recommended hardening at the database: a separate runtime role with only `SELECT/INSERT/UPDATE/DELETE` on the app tables, keeping the owner role for migrations only. Not set up yet; see "Before launch".

## Authentication

- **Patients:** SMS one-time code. 5 digits, stored as an HMAC-SHA256 (with `OTP_SECRET`), valid 2 minutes, 5 attempts per code (row-locked, so parallel guesses can't exceed it), resend after 2 minutes, at most 3 codes per phone per 30 minutes. A verified phone can skip the code on that device for 30 days.
- **Staff:** the same SMS code, only for numbers in `ADMIN_PHONES`. The login screen answers identically for listed and unlisted numbers (no staff-number enumeration). Removing a number from `ADMIN_PHONES` ends its access on the next request.
- **Sessions:** 256-bit random tokens; only their SHA-256 is stored. Cookies are `HttpOnly`, `SameSite=Lax`, `Secure` and `__Host-` prefixed in production. Staff sessions last 12 hours; logout deletes the session server-side.
- The OTP and the sms.ir key never appear in any HTTP response or in the database.

## Abuse limits (Postgres-backed, `lib/rate-limit.ts`)

| Limit | Value |
|---|---|
| Holds per IP per hour | 10 |
| Slots one IP can hold at the same time | 5 (not lower: Iranian mobile carriers share one IP across many phones) |
| Code requests per IP per hour | 10 |
| Code checks per IP per hour | 30 |
| Patient code texts, whole site, per hour | 60 (caps SMS-pumping cost; staff login is exempt) |

**Client IP:** taken from the right-most `X-Forwarded-For` entry, which the platform's own proxy adds. Vercel does this. **On the Iranian host, the reverse proxy must append the client address** (nginx: `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`), or per-IP limits can be bypassed with a forged header.

## Booking integrity

- Double booking is impossible at the database: an exclusion constraint on the time range of active rows. Writers for the same slot queue on an advisory lock.
- Confirming is a conditional update that succeeds only while the hold is live. One upcoming appointment per phone is enforced under a per-phone lock.

## Browser protections (`next.config.ts`)

Content-Security-Policy (same-origin only; no third-party scripts, fonts or frames; `frame-ancestors 'none'`; `form-action 'self'`), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. Server actions carry Next.js's built-in same-origin check. `script-src` allows inline scripts because Next.js streams page data inline; a nonce would force every page to render per request.

## Data minimisation

The daily cron (`/api/cron/reminders`, `Authorization: Bearer $CRON_SECRET`, compared in constant time) also deletes: codes older than a day, expired device and staff sessions, rate-limit events older than two days, and abandoned holds older than a week. Appointment records and the staff audit log are kept.

## Before launch

- [ ] Connect sms.ir. Until then the mock provider writes codes to the server log (visible to anyone with access to the hosting logs).
- [x] `OTP_SECRET` and `CRON_SECRET` stored as Sensitive variables in Vercel (Production + Preview). On a new host, keep them out of the repo and readable only by the app.
- [ ] Create a least-privilege database role for the app (runtime) and keep the owner role for migrations.
- [ ] On the Iranian host: HTTPS only, the proxy header above, and nightly database backups.
