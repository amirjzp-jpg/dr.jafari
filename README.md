# Dr. Nada Jafari: clinic website

Persian (RTL-first) website for a cosmetic dental clinic in Shiraz, with online booking and SMS verification.

- `BUILD-SPEC.md`: behavior and rules. `docs/decisions.md`: later client decisions (these win).
- `design/`: approved visual designs (reference only).
- `TODO-content.md`: content still missing before launch.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4. Fonts are self-hosted via `@fontsource` packages; nothing loads from Google.
