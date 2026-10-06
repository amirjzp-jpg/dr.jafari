# SEO / GEO / AEO ranking plan (draft for approval)

Status: **C, D and E applied on 2026-10-06** (hasMap in the clinic markup; «خدمات دندانپزشکی در شیراز» as the services H1; links to the Maaliabad page from home, services and about). Articles A and B and the rest are still proposals. B stays factors-only because real prices are not available; Google Business Profile is not claimed yet, so no profile URL or rating markup. Written 2026-10-06 after the site went live and began indexing.

## 1. Skills
No SEO, GEO or AEO skills are installed on this account (searched 2026-10-06). This plan comes from reading the code, `docs/decisions.md` and the earlier keyword drafts. It is not backed by search-volume or ranking data: none was available.

## 2. Target keywords and where each one lives

Google treats spacing and half-space variants («دندان پزشک», «دندانپزشک», «دندان‌پزشک») as the same word, and ignores most typos. So the spelling variants in the brief are covered by one page each, not by repeating each spelling.

| Keyword | Intent | Page that should win it | State today |
|---|---|---|---|
| دندانپزشک / دندانپزشکی شیراز | general, very competitive, mostly the map pack | Home | Home title: «دندانپزشک زیبایی در شیراز، معالی‌آباد». Covered, but the general (non-cosmetic) phrase is weak |
| دندانپزشکی معالی‌آباد | local, map pack | `/dentist-maaliabad-shiraz` | Page exists, in title and H1 |
| لمینت دندان شیراز | service | `/veneers` («لمینت سرامیکی دندان در شیراز») | Covered |
| کامپوزیت دندان شیراز | service | `/composite` («کامپوزیت دندان در شیراز») | Covered |
| دندانپزشکی زیبایی | generic, national | Home + `/services` | Home covers it; no page targets the generic national phrase beyond that |
| dndan pezeshki shiraz (Latin spelling) | rare, transliterated | none | Not worth a page or hidden text. Google maps it to the Persian page; the `/en` pages cover «dentist Shiraz» |
| «بهترین …» | superlative | none | **Not used.** Banned by CLAUDE.md and by Iranian medical-advertising rules. See section 4 |

## 3. What matters most (ranked by expected effect)

1. **Google Business Profile.** For «دندانپزشکی شیراز» and «دندانپزشکی معالی‌آباد» the map pack sits above the organic results. Claim and verify the profile, use the exact name, address and hours from `lib/site.ts`, pick the category «Cosmetic dentist», add photos, services, the booking link and the website. Then Neshan, Balad and Apple Maps. This is off-site work the clinic must do; I can write the checklist and the exact text. The site already has `Dentist` markup to match it.
2. **Real reviews.** The «best» query is won by review count and rating, not by the word. Ask patients (with consent) to review on Google. Only real reviews may ever go into `Review` or `AggregateRating` markup. Never write ones we cannot show.
3. **Search Console.** Submit `/sitemap.xml`, confirm all `/ar` and `/en` hreflang pages are read, and check the Queries report after 4 to 6 weeks. The plan should be revised with that data; today it has none.
4. **Directories and citations** with the same name, address and phone: Paziresh24, Nobat.ir, Doctoreto and similar Persian doctor listings, plus the Instagram bio and link. Consistent NAP is a local ranking signal.
5. **On-site content gaps** (section 5).

## 4. About «بهترین»
CLAUDE.md forbids «بهترین» and «متخصص». I have not used them and do not recommend it: it is an unverifiable claim and a legal risk in Iran. The safe way to meet that search intent is evidence: real before-and-after photos (already in `/gallery`), real reviews, the council number (already shown), and pages that answer «how do I choose a cosmetic dentist in Shiraz?» without ranking ourselves. That last page is proposed below.

## 5. Proposed on-site changes (each needs your approval)

| # | Change | Why | Risk |
|---|---|---|---|
| A | New article «چطور یک دندانپزشک زیبایی در شیراز انتخاب کنیم؟» (what to check: licence, case photos, a written plan, follow-up), question-style H2s with a direct first-paragraph answer | AEO and GEO: it is the kind of question AI assistants quote, and it takes the «best» intent without the word | Needs doctor review; no invented claims |
| B | New article «هزینه لمینت و کامپوزیت دندان در شیراز به چه چیزی بستگی دارد؟» explaining the cost factors, with **no prices** unless you give them | «هزینه / قیمت» queries are the most common in this niche. Without real prices the page only explains factors | Prices must come from you; put `[؟]` and list in `TODO-content.md` |
| C | Add `hasMap`, `sameAs` (Instagram, Google Business Profile, Neshan) and `aggregateRating` (only when real reviews exist) to the `Dentist` markup | Ties the site to the map listings | None, once the profile URLs exist |
| D | A short «خدمات دندانپزشکی در شیراز» intro on `/services` with the general phrase once, naturally | Picks up the non-cosmetic «دندانپزشکی شیراز» phrase | Low; copy only |
| E | Internal links: home and article pages to `/dentist-maaliabad-shiraz`, with the anchor «دندانپزشکی در معالی‌آباد» | Passes weight to the local page | None |
| F | After 4 to 6 weeks: use Search Console queries to rewrite titles of pages with impressions but low click-through | Real data instead of guesses | None |

## 6. What is already done well (no change needed)
- One title, canonical, Open Graph and Twitter tag set per page (`buildMetadata`).
- `Dentist`, `Person`, `FAQPage`, `BreadcrumbList`, `MedicalWebPage`, `Article`, `WebSite` and `ReserveAction` markup, with one-question-one-page FAQ markup.
- `/llms.txt` generated from the same facts, and a `robots.txt` that welcomes the AI crawlers on public pages.
- hreflang in pages and sitemap for Persian, Arabic and English.
- Indexing only on the real domain.

## 7. Open questions for you
1. May I start with C, D and E (small, no new claims)?
2. Do you want articles A and B drafted? For B, can you give real price ranges, or should it stay factors only?
3. Is the Google Business Profile claimed? If yes, send its URL so it can go into `sameAs`.
