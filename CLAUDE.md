# CLAUDE.md

Website for Dr. Nada Jafari's cosmetic dental clinic in Shiraz, Iran. It's Persian and RTL-first, and its main goal is online booking with SMS verification.

## Read first
- `BUILD-SPEC.md` is the source of truth for behavior, rules and decisions.
- `design/*.dc.html` are the approved visual designs. They use a design-tool template syntax; treat them as reference only, not code to copy.
- `docs/master-plan.md` is the original brand and SEO brief. Background only; where it conflicts with BUILD-SPEC.md, BUILD-SPEC.md wins.

## Non-negotiables
- RTL-first. Use logical CSS properties; never mirror an LTR layout.
- Double-booking is prevented by a database constraint, not by the UI timer.
- OTP and the sms.ir key are server-only. Never expose them.
- All fonts and scripts are self-hosted, so the site must work with Google services blocked.
- Never invent clinical facts, credentials or claims. Use `[؟]` placeholders and list them in `TODO-content.md`.
- Never use «متخصص» or «بهترین» in copy.

## Working style
- Build in the order in BUILD-SPEC.md section 13. Stop after each step and show the result.
- When the spec and the designs disagree, ask rather than guess.
- UI copy is Persian; code, comments and commits are English.

## Project decisions
`docs/decisions.md` records decisions made with the client after the handoff. Where it differs from BUILD-SPEC.md, the decisions file wins.

## Next.js
@AGENTS.md
