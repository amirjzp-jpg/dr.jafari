# Dr. Nada Jafari: clinic website

Persian (RTL-first) website for a cosmetic dental clinic in Shiraz, with online booking and SMS verification.

- `BUILD-SPEC.md`: behavior and rules. `docs/decisions.md`: later client decisions (these win).
- `design/`: approved visual designs (reference only).
- `TODO-content.md`: content still missing before launch.

- `docs/DEPLOY.md`: Vercel test deploy, sms.ir, and the move to an Iranian host.

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
- `app/(site)/`: public pages. `app/booking/`: the booking flow. `app/admin/`: the staff panel.
- `lib/booking/`: schedule rules (`schedule.ts`) and all booking writes (`service.ts`).
- `db/migrations/`: schema, including the no-overlap constraint.
- `content/`: service pages, journal articles, before/after cases.
