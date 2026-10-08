# SEO fixes that need the doctor's approval

Drafted 2026-10-07 from the live-site audit. Nothing here is published. Per `CLAUDE.md`, every line marked «✓ تأیید شود» must be confirmed by the doctor first. No copy uses «بهترین» or «متخصص». Every answer below only repeats facts already approved on the site.

## 1. Maaliabad page: FAQ block (`/dentist-maaliabad-shiraz`)

Add a «پرسش‌های رایج» section and a matching `FAQPage` schema (`faqSchema` already exists in `lib/seo.ts`). The page has no FAQ today.

| # | Question | Answer |
|---|---|---|
| 1 | کلینیک دکتر فاطمه جعفری کجای معالی‌آباد است؟ ✓ تأیید شود | شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌چهار. |
| 2 | ساعت کاری کلینیک چیست؟ ✓ تأیید شود | شنبه تا چهارشنبه، ۱۰ تا ۱۳ و ۱۴ تا ۱۹؛ پنجشنبه و جمعه تعطیل. |
| 3 | چطور نوبت بگیرم؟ ✓ تأیید شود | از صفحه‌ی رزرو نوبت، روز و ساعت دلخواه را انتخاب کنید و شماره‌ی موبایل خود را با کد پیامکی تأیید کنید. می‌توانید تماس هم بگیرید. |
| 4 | اولین جلسه چقدر طول می‌کشد؟ ✓ تأیید شود | اولین مراجعه معمولاً یک جلسه‌ی «معاینه و مشاوره» ۳۰ دقیقه‌ای است. |
| 5 | امکان پرداخت اقساطی وجود دارد؟ ✓ تأیید شود | بله. برای درمان‌های زیبایی مانند کامپوزیت و لمینت، امکان پرداخت اقساطی وجود دارد. شرایط آن در جلسه‌ی مشاوره توضیح داده می‌شود. |

Also suggested for the same page: a second internal link to `/composite` and `/veneers` inside the «درمان‌ها» paragraph, and `dateModified` updated when it goes live.

## 2. `/composite` meta description is too long

Current text is about 170 characters; Google may cut it. Proposed (about 140): ✓ تأیید شود

> کامپوزیت دندان در شیراز، معالی‌آباد، با دکتر فاطمه جعفری: اصلاح رنگ، فرم و فاصله‌ی دندان‌ها با کمترین تراش. روند درمان و پرسش‌های رایج.

Apply in `content/services.ts` (`metaDescription` for composite).

## 3. Price content (decision D3: only what drives the cost, no numbers)

Draft «هزینه» section for `/composite` and `/veneers`, and the basis for two articles («هزینه کامپوزیت دندان در شیراز» and «هزینه لمینت دندان در شیراز»). No amounts. ✓ تأیید شود

> **هزینه به چه چیزهایی بستگی دارد؟**
> هزینه به تعداد دندان‌ها، نوع کار و وضعیت دندان‌ها بستگی دارد و پس از معاینه‌ی دقیق اعلام می‌شود. [؟ آیا مواد یا روش‌های مختلف هزینه‌ی متفاوتی دارند؟ فقط اگر دکتر تأیید کند.] برای درمان‌های زیبایی امکان پرداخت اقساطی وجود دارد؛ شرایط آن در جلسه‌ی مشاوره توضیح داده می‌شود.

Rule: the articles must not quote market prices, and must not promise a result or a price before an exam.

## 4. «چطور دندانپزشک زیبایی را انتخاب کنیم؟» (guide)

Outline only. The title avoids «بهترین» and «متخصص» (project rule), and targets `دندانپزشک خوب در شیراز`. Every fact below must be confirmed by the doctor. ✓ تأیید شود

1. چه سؤال‌هایی پیش از درمان بپرسیم (معاینه، توضیح همه‌ی گزینه‌ها با مزایا و محدودیت‌ها)
2. نمونه‌کار واقعی قبل و بعد؛ نشانه‌ها یک نمونه خوب است [؟ رضایت‌نامه‌ی بیمار]
3. شماره نظام پزشکی را از سامانه‌ی نظام پزشکی بررسی کنید (لینک رسمی، پس از تأیید)
4. شفافیت درباره‌ی هزینه و اقساط
5. مراقبت‌های پس از درمان

## 5. Structured data: blocked on decisions, with ready code

These stay out until the inputs exist. When they do, the change is in `dentistSchema()` in `lib/seo.ts`.

| Property | Needs | Decision |
|---|---|---|
| `geo` | done 2026-10-08 (Google pin) | - |
| `hasMap` | done 2026-10-08 (Google pin) | - |
| `logo` | a logo file, or a real clinic photo for `image` | open |
| `priceRange` | a price decision | D3 (no numbers: leave out) |
| `sameAs` additions | Google Business Profile URL, Neshan/Balad, the council profile URL | D5 / off-site |

```ts
// once the pin and the profile URLs exist
geo: { "@type": "GeoCoordinates", latitude: 0 /* [؟] */, longitude: 0 /* [؟] */ },
hasMap: "https://maps.app.goo.gl/[؟]",
sameAs: [site.instagram, "https://g.page/[؟]"],
```

## 6. Already correct (changed no code)

- **Sitemap `lastmod`:** omitted on pages with no real content date on purpose (see the comment in `app/sitemap.ts`). The Persian and Arabic/English dates differ because they carry different content dates. Leave as is.
- **Schema `areaServed` language:** done in code (this branch): the Arabic and English pages now say "شيراز"/"Shiraz" instead of Persian names.
