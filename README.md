# Dr. Nada Jafari: clinic website

Persian (RTL-first) website for a cosmetic dental clinic in Shiraz, with online booking and SMS verification.

- `BUILD-SPEC.md`: behavior and rules. `docs/decisions.md`: later client decisions (these win).
- `design/`: approved visual designs (reference only).
- `TODO-content.md`: content still missing before launch.

- `docs/DEPLOY.md`: Vercel test deploy, sms.ir, and the move to an Iranian host.
- `docs/SECURITY.md`: security model, abuse limits, and what a new host must keep.

## Development

```bash
npm install
cp .env.example .env.local   # set DATABASE_URL at least
npm run db:migrate
npm run dev     # http://localhost:3000
npm run lint
npm test        # needs Postgres; see vitest.config.mts
npm run build
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4, PostgreSQL (`pg`). Fonts are self-hosted via `@fontsource` packages; nothing loads from Google.

## Where things are
- `app/(site)/`: public pages (home, services, about, journal, policies). `app/booking/`: the 5-step booking flow and its server actions.
- `app/admin/`: staff panel. `login/` is public; everything under `(panel)/` requires a staff session. Server actions in `app/admin/actions.ts`.
- `app/api/`: `booking/release` (frees a hold when the patient leaves) and `cron/reminders` (day-before SMS).
- `components/`: `layout/` (header, footer, mobile bar), `home/`, `content/` (page building blocks), `admin/`, `ui/`, `icons/`.
- `lib/booking/`: schedule rules (`schedule.ts`, pure) and every booking write (`service.ts`, guarded by the database constraint).
- `lib/`: `db.ts` + `database-url.mjs` (connection), `otp.ts`, `sms/`, `auth/session.ts`, `rate-limit.ts`, `audit.ts`, `settings.ts`, `config.ts` (env), `time.ts` (Tehran/Jalali), `phone.ts`, `digits.ts`, `seo.ts`, `site.ts` (clinic facts).
- `db/migrations/`: schema, including the no-overlap constraint. Run by `scripts/migrate.mjs` before each Vercel build.
- `content/`: service pages, journal articles, before/after cases. `public/images/`: optimized images (originals in `assets/source/`).
- `tests/`: Vitest against a real Postgres (booking concurrency, OTP, schedule, Jalali dates, database URL handling).
