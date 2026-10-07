# Deploying

## Test deploy: Vercel + Neon

1. **Import the repo** at vercel.com → Add New → Project → `dr.jafari`. `vercel.json` sets the framework, runs database migrations and then builds, and schedules the reminder job once a day at 08:00 Tehran. That is the most the Hobby plan allows, so on the Vercel test deploy only visits before 14:00 get a reminder; the real host runs it every 15 minutes (see the crontab line below).
2. **Add a database:** in the Vercel project, Storage → Create → **Neon** (Postgres) → connect it to the project. This sets `DATABASE_URL` automatically.
3. **Environment variables** (Settings → Environment Variables), for Production and Preview:

   | Name | Value |
   |---|---|
   | `OTP_SECRET` | a random string of 32+ characters, e.g. from `openssl rand -hex 32`. Add it as **Sensitive** (Production + Preview) |
   | `ADMIN_PHONES` | staff mobile numbers, comma-separated, e.g. `09121234567` |
   | `CRON_SECRET` | another random string, also **Sensitive** (Vercel sends it to the reminder job; without it reminders never run) |
   | `NEXT_PUBLIC_SITE_URL` | the site's address, e.g. `https://dr-jafari.vercel.app` (later the real domain, `https://dandanpezeshkishiraz.ir`) |
   | `SITE_INDEXABLE` | `true` **only on the real domain, and it must be set when the site is built** (the page tags are fixed at build time). Left unset (Vercel test, previews), every page sends `noindex` in the HTML and in the `X-Robots-Tag` header, so the test site can't compete with the real one in search |

4. **Redeploy** (Deployments → ⋯ → Redeploy). The build log should show `[migrate] applied 001_init.sql`.

### SMS on the test site
Until the sms.ir variables are set, no SMS is sent: every message (including login and booking codes) is written to the server log. To log in to `/admin` on the test site, request a code, then open Vercel → the deployment → **Logs** and look for `[sms:mock] … template=otp params={"CODE":"12345"}`.

### Turning on real SMS (sms.ir)
1. Register and get approved the three templates in the sms.ir panel (final texts in `docs/sms-templates.md`), with parameter names `CODE`, `NAME`, `DATE`, `TIME`.
2. Set `SMSIR_API_KEY` (Sensitive) and `SMSIR_TEMPLATE_OTP`, `SMSIR_TEMPLATE_CONFIRMED`, `SMSIR_TEMPLATE_REMINDER` (the numeric template IDs; `_CANCELLED` and `_MOVED` are optional), then redeploy. Each message type goes live on its own as soon as the key and its template ID are both set; until then it is written to the server log (`[sms:mock]`), so the key can be added before every template is approved.
3. Send yourself a booking and check each message.

## Production: Iranian VPS (HostIran, Ubuntu 24.04, `dandanpezeshkishiraz.ir`)

The app is a standard Node.js server with plain Postgres. Three scripts in `deploy/` do the work (as root on the server):

1. **Setup (once):**
   ```bash
   apt-get update && apt-get install -y git
   git clone https://github.com/amirjzp-jpg/dr.jafari.git /opt/dr-jafari
   bash /opt/dr-jafari/deploy/setup-server.sh
   ```
   Installs Node 22, PostgreSQL and nginx; creates the database and `/etc/dr-jafari.env` (random `OTP_SECRET` and `CRON_SECRET`, asks for `ADMIN_PHONES`); adds 3 GB swap so the build fits in 1 GB RAM; builds the site and runs it as the `dr-jafari` systemd service behind nginx; sets up the firewall (ssh, 80, 443), fail2ban, automatic security updates, a nightly database dump (`/var/backups/dr-jafari`, 14 days) and the reminder job every 15 minutes. Safe to run again.
2. **HTTPS (once the domain points at the server):** in HostIran's DNS add an `A` record for `dandanpezeshkishiraz.ir` and one for `www`, both to the server's IP, then `bash /opt/dr-jafari/deploy/enable-https.sh` (free Let's Encrypt certificate, renews itself, redirects HTTP to HTTPS).
3. **Update:** `bash /opt/dr-jafari/deploy/update.sh` pulls `main`, migrates, rebuilds and restarts (a few minutes of downtime: the site is stopped so the build has the memory).

- **sms.ir and admin numbers:** run `ADMIN_PHONES=09120000000,09130000000 bash /opt/dr-jafari/deploy/set-env.sh` as root. It asks for the API key (hidden), the three template IDs and sets the admin numbers in `/etc/dr-jafari.env`, then restarts the site. Secrets are typed on the server only and are never committed (the repository is public). Or edit `/etc/dr-jafari.env` by hand (`nano`) and run `systemctl restart dr-jafari`. Until then messages go to the log: `journalctl -u dr-jafari | grep sms:mock`.
- **Logs:** `journalctl -u dr-jafari -n 100 --no-pager`. **Restart:** `systemctl restart dr-jafari`.
- **Backups** live on the same disk: copy `/var/backups/dr-jafari` off the server now and then, and ask HostIran about server snapshots.
- **Client IP:** nginx appends the client address to `X-Forwarded-For`, as `docs/SECURITY.md` requires.
- Analytics (optional): run Umami on the same host and add `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID` to the env file, then run `update.sh` (they are read at build time).
- Rebuild after changing `NEXT_PUBLIC_SITE_URL` or `SITE_INDEXABLE` (`update.sh`): the page tags are fixed at build time.

## Checks before launch
- `npm test` needs a local Postgres (`TEST_DATABASE_URL`, default `postgres://dev:dev@localhost/drjafari_test`).
- Every item in `TODO-content.md` is resolved and no `[؟]` remains on the site.
- Every content file has `reviewed: true` (this also removes the «پیش‌نویس» notice).
