# Deploying

## Test deploy: Vercel + Neon

1. **Import the repo** at vercel.com → Add New → Project → `dr.jafari`. `vercel.json` sets the framework, runs database migrations and then builds, and schedules the reminder job.
2. **Add a database:** in the Vercel project, Storage → Create → **Neon** (Postgres) → connect it to the project. This sets `DATABASE_URL` automatically.
3. **Environment variables** (Settings → Environment Variables), for Production and Preview:

   | Name | Value |
   |---|---|
   | `OTP_SECRET` | a random string of 32+ characters, e.g. from `openssl rand -hex 32`. Add it as **Sensitive** (Production + Preview) |
   | `ADMIN_PHONES` | staff mobile numbers, comma-separated, e.g. `09121234567` |
   | `CRON_SECRET` | another random string, also **Sensitive** (Vercel sends it to the reminder job; without it reminders never run) |
   | `NEXT_PUBLIC_SITE_URL` | the site's address, e.g. `https://dr-jafari.vercel.app` (later the real domain) |

4. **Redeploy** (Deployments → ⋯ → Redeploy). The build log should show `[migrate] applied 001_init.sql`.

### SMS on the test site
Until the sms.ir variables are set, no SMS is sent: every message (including login and booking codes) is written to the server log. To log in to `/admin` on the test site, request a code, then open Vercel → the deployment → **Logs** and look for `[sms:mock] … template=otp params={"CODE":"12345"}`.

### Turning on real SMS (sms.ir)
1. Register and get approved the five templates in the sms.ir panel (texts in `BUILD-SPEC.md` section 7), with parameter names `CODE`, `NAME`, `DATE`, `TIME`.
2. Set `SMSIR_API_KEY` and `SMSIR_TEMPLATE_OTP`, `SMSIR_TEMPLATE_CONFIRMED`, `SMSIR_TEMPLATE_REMINDER`, `SMSIR_TEMPLATE_CANCELLED`, `SMSIR_TEMPLATE_MOVED` (the numeric template IDs), then redeploy.
3. Send yourself a booking and check each message.

## Production: Iranian host (Liara, ArvanCloud, etc.)

The app is a standard Node.js server with plain Postgres, so it runs anywhere:

```bash
npm ci
npm run db:migrate   # needs DATABASE_URL
npm run build
npm start            # serves on $PORT (default 3000)
```

- Postgres 14+ (the exclusion constraint uses a GiST index on a time range; no extensions needed).
- Set the same environment variables as above.
- **Reminder job:** schedule a daily call at 18:00 Tehran time:
  `curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/reminders`
- **Client IP:** the reverse proxy must append the client IP to `X-Forwarded-For` (nginx: `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`); see `docs/SECURITY.md`.
- Force HTTPS at the host (the app already sends HSTS).
- Analytics (optional): run Umami on the same host and set `NEXT_PUBLIC_UMAMI_SRC` (script URL) and `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.

## Checks before launch
- `npm test` needs a local Postgres (`TEST_DATABASE_URL`, default `postgres://dev:dev@localhost/drjafari_test`).
- Every item in `TODO-content.md` is resolved and no `[؟]` remains on the site.
- Every content file has `reviewed: true` (this also removes the «پیش‌نویس» notice).
