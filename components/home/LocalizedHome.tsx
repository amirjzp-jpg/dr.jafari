import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { InstagramCta } from "@/components/content/InstagramCta";
import { JsonLd } from "@/components/content/JsonLd";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons/ui";
import { ServiceIcon } from "@/components/icons/services";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DirectionsLink } from "@/components/ui/DirectionsLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { cases } from "@/content/cases";
import { featuredPhoto } from "@/content/gallery";
import { articleText, journalLabels } from "@/content/i18n/articles";
import { homeCopy, serviceText } from "@/content/i18n/home";
import { bookingFor, externalProps, facts, ui } from "@/content/i18n/ui";
import { latestArticles } from "@/content/journal";
import { featuredServices, otherServices } from "@/content/services";
import { localeHref, localePath, type IntlLocale } from "@/lib/i18n";
import { dentistSchema, faqSchema, personSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import aboutDetail from "@/public/images/doctor/about-detail.webp";
import aboutMain from "@/public/images/doctor/about-main.webp";
import drHero from "@/public/images/doctor/dr-hero.webp";

/**
 * Home page for the Arabic and English versions. The layout is the Persian home
 * page's (app/(fa)/(site)/page.tsx); Arabic is right to left like Persian, and
 * English mirrors it. The journal section is left out until the articles are
 * translated, and links to pages without a translation are left out too.
 */
export function LocalizedHome({ lang }: { lang: IntlLocale }) {
  const c = homeCopy[lang];
  const t = ui[lang];
  const f = facts[lang];
  const book = bookingFor(lang);
  const bookProps = book.external ? externalProps : {};
  const ltr = lang === "en";

  return (
    <>
      <JsonLd data={[websiteSchema(lang), dentistSchema(lang), personSchema(lang)]} />

      {/* Hero */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[900px] bg-linear-to-b from-tint via-[#E8EFF3] via-58% to-ivory lg:h-[816px]"
      />
      <Container className="flex flex-col lg:h-[600px] lg:flex-row lg:items-stretch lg:gap-10 xl:h-[720px]">
        <div
          className={`order-1 flex flex-col gap-2 pt-[18px] lg:grow lg:justify-center lg:gap-[22px] lg:pt-0 lg:pb-[60px] ${
            ltr ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="hidden lg:block">
            <Eyebrow>{c.heroEyebrow}</Eyebrow>
          </div>
          <h1 className="font-display text-[34px] leading-normal font-semibold text-balance lg:text-[clamp(36px,calc((100vw-600px)/10.5),60px)] xl:text-[clamp(36px,calc((min(100vw,1440px)-880px)/10.5),60px)]">
            {f.tagline}
          </h1>
          <p className="text-[19px] text-primary lg:text-[24px]">{c.heroLine}</p>
          <p className="hidden max-w-[440px] text-[17px] leading-[2] text-muted lg:block">{c.heroText}</p>
          <div className="mt-3.5 hidden flex-wrap items-center gap-x-7 gap-y-4 lg:flex">
            <ButtonLink href={book.href} data-umami-event="book_cta" {...bookProps}>
              {book.label}
            </ButtonLink>
            <span className="flex shrink-0 items-center gap-2.5 text-[15px]">
              <PhoneIcon size={18} className="text-primary" />
              <PhoneLink lang={lang} />
            </span>
          </div>
        </div>

        <div
          className={`relative order-2 -mx-5 mt-4 h-[460px] w-[calc(100%+40px)] max-w-[390px] shrink-0 self-center overflow-x-clip md:mx-auto md:w-full lg:m-0 lg:h-auto lg:w-[600px] lg:max-w-none lg:self-stretch lg:overflow-visible lg:[zoom:0.8] xl:[zoom:1] ${
            ltr ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="absolute start-[55px] bottom-0 h-[400px] w-[280px] rounded-t-[140px] bg-linear-to-b from-tint-2 via-[#D8E4EE] via-70% to-[rgba(232,239,243,0)] lg:start-[70px] lg:h-[600px] lg:w-[440px] lg:rounded-t-[220px]" />
          <div className="absolute start-[54px] bottom-0 h-[401px] w-[282px] rounded-t-[141px] border border-b-0 border-champagne opacity-55 lg:start-[69px] lg:h-[601px] lg:w-[442px] lg:rounded-t-[221px]" />
          <Image
            src={drHero}
            alt={c.heroAlt}
            priority
            sizes="(min-width: 1024px) 500px, 350px"
            className="absolute start-[22px] bottom-0 h-[460px] w-auto max-w-none [mask-image:linear-gradient(180deg,#000_80%,transparent_100%)] lg:start-[40px] lg:h-[660px]"
          />
          <div className="absolute end-5 bottom-[38px] flex flex-col gap-0.5 rounded-[14px] border border-line bg-ivory px-4 py-3 lg:end-auto lg:start-[420px] lg:bottom-[150px] lg:min-w-[170px] lg:gap-1 lg:rounded-2xl lg:px-[22px] lg:py-4">
            <span aria-hidden="true" className="mb-1 h-px w-[22px] bg-champagne lg:mb-1.5 lg:w-7" />
            <span className="font-display text-base font-semibold whitespace-nowrap lg:text-[19px]">{f.name}</span>
            <span className="text-xs text-muted lg:text-[13px]">{f.experience}</span>
          </div>
        </div>

        <p className="order-3 mt-6 flex items-center justify-center gap-2.5 text-[15px] lg:hidden">
          <PhoneIcon size={18} className="text-primary" />
          <PhoneLink lang={lang} />
        </p>
      </Container>

      {/* Stats */}
      <section aria-label={c.statsLabel}>
        <Container className="pt-10 pb-6 lg:pt-14">
          <ul className="grid grid-cols-1 border-y border-line md:grid-cols-3">
            {c.stats.map((it, i) => (
              <li
                key={it.big}
                className={`flex flex-col gap-1.5 py-6 md:py-9 ${
                  i > 0 ? "border-t border-line md:border-t-0 md:border-s" : ""
                } ${i === 0 ? "md:pe-10" : i === 1 ? "md:px-10" : "md:ps-10"}`}
              >
                <span className="font-display text-[24px] font-semibold text-primary lg:text-[30px]">{it.big}</span>
                <span className="text-[15px] text-muted">{it.small}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* About */}
      <section id="about" aria-labelledby="about-title">
        <Container className="flex flex-col items-center gap-12 pt-20 pb-10 lg:flex-row lg:gap-24 lg:pt-32">
          <div className="relative aspect-[560/640] w-full max-w-[560px] shrink-0 lg:w-[560px]">
            <div className="absolute start-0 top-0 h-[90.6%] w-[75%] overflow-hidden rounded-[50%_50%_24px_24px/36.2%_36.2%_24px_24px] bg-tint">
              <Image
                src={aboutMain}
                alt={c.about.altMain}
                fill
                sizes="(min-width: 1024px) 420px, 75vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -start-px -top-px h-[calc(90.6%+1px)] w-[calc(75%+2px)] rounded-[50%_50%_25px_25px/36.2%_36.2%_25px_25px] border border-champagne opacity-55"
            />
            <div className="absolute end-0 bottom-0 h-[42%] w-[44.6%] overflow-hidden rounded-[20px] border-8 border-ivory bg-tint">
              <Image
                src={aboutDetail}
                alt={c.about.altDetail}
                fill
                sizes="(min-width: 1024px) 250px, 45vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
          </div>
          <div className="flex grow flex-col gap-[18px]">
            <Eyebrow>{c.about.eyebrow}</Eyebrow>
            <h2 id="about-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[40px]">
              {c.about.title}
            </h2>
            <p className="text-[17px] leading-[2.1] text-muted-2">{c.about.body}</p>
            <dl className="mt-2 flex flex-col text-[15px]">
              {c.about.rows.map((r, i, all) => (
                <div
                  key={r.k}
                  className={`flex justify-between gap-6 border-t border-line py-3.5 ${i === all.length - 1 ? "border-b" : ""}`}
                >
                  <dt className="text-muted">{r.k}</dt>
                  <dd className="text-end">{r.v}</dd>
                </div>
              ))}
            </dl>
            {localeHref(lang, "/about") && (
              <ButtonLink href={localeHref(lang, "/about")!} variant="outline" size="md" className="mt-2.5 self-start !h-12 !px-[30px] text-sm">
                {c.about.button}
              </ButtonLink>
            )}
          </div>
        </Container>
      </section>

      {/* Cases */}
      <section id="cases" aria-labelledby="cases-title">
        <Container className="flex flex-col items-center gap-14 pt-24 pb-24 lg:pt-[120px] lg:pb-28">
          <div className="flex flex-col items-center gap-3.5 text-center">
            <Eyebrow centered>{c.cases.eyebrow}</Eyebrow>
            <h2 id="cases-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[42px]">
              {c.cases.title}
            </h2>
            <p className="text-base text-muted">{c.cases.hint}</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cases.map((item, i) => (
              <BeforeAfter
                key={item.label}
                lang={lang}
                item={{ ...item, title: c.cases.titles[i] ?? item.title, label: `${i + 1}` }}
              />
            ))}
          </div>
          {localeHref(lang, "/gallery") && (
            <ButtonLink href={localeHref(lang, "/gallery")!} variant="outline" size="md" className="!h-12 !px-[30px] text-sm">
              {c.cases.button}
            </ButtonLink>
          )}
        </Container>
      </section>

      <InstagramCta lang={lang} className="pb-16 lg:pb-24" />

      {/* Services */}
      <section id="services" aria-labelledby="services-title">
        <Container className="flex flex-col gap-12 pt-10 pb-24 lg:flex-row lg:gap-24 lg:pb-[120px]">
          <div className="flex shrink-0 flex-col gap-4 pt-2 lg:w-[340px]">
            <Eyebrow>{c.services.eyebrow}</Eyebrow>
            <h2 id="services-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[40px]">
              {c.services.title}
            </h2>
            <p className="text-base leading-[2] text-muted">{c.services.body}</p>
            {localeHref(lang, "/gallery") && (
              <Link
                href={localeHref(lang, "/gallery")!}
                className="group relative mt-8 hidden aspect-[4/5] w-full overflow-hidden rounded-[170px_170px_24px_24px] bg-tint text-ink no-underline lg:block"
              >
                <Image
                  src={featuredPhoto.src}
                  alt={c.featuredAlt}
                  fill
                  sizes="340px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-pill bg-ivory/95 py-2.5 ps-5 pe-4 text-sm font-medium text-ink group-hover:text-primary">
                  {c.services.gallery}
                  <span aria-hidden="true">{t.arrow}</span>
                </span>
              </Link>
            )}
          </div>
          <div className="flex grow flex-col gap-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featuredServices.map((s) => {
                const tx = serviceText[lang][s.slug];
                const href = localeHref(lang, s.href);
                const inner = (
                  <>
                    <span className="mb-1 flex size-16 items-center justify-center rounded-[20px] bg-surface">
                      <ServiceIcon name={s.icon} size={34} />
                    </span>
                    <span className="font-display text-[26px] font-semibold lg:text-[30px]">{tx.name}</span>
                    <span className="text-[15px] leading-[1.9] text-muted-2">{tx.short}</span>
                    {href && (
                      <span className="mt-auto text-sm font-medium text-primary group-hover:text-primary-hover">
                        {c.services.more} {t.arrow}
                      </span>
                    )}
                  </>
                );
                const cls =
                  "group flex min-h-[250px] flex-col gap-3 rounded-[24px] bg-linear-160 from-tint to-[#EEF2F3] p-8 text-ink no-underline hover:text-ink lg:p-10";
                return href ? (
                  <Link key={s.slug} href={href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <div key={s.slug} className={cls}>
                    {inner}
                  </div>
                );
              })}
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
              {otherServices.map((s) => {
                const tx = serviceText[lang][s.slug];
                const href = localeHref(lang, s.href);
                const row = (
                  <>
                    <span className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl border border-line bg-surface">
                      <ServiceIcon name={s.icon} />
                    </span>
                    <span className="grow text-lg">{tx.name}</span>
                    {href && (
                      <span aria-hidden="true" className="text-[15px] text-primary">
                        {t.arrow}
                      </span>
                    )}
                  </>
                );
                const cls = "flex h-[84px] items-center gap-[18px] border-b border-line text-ink no-underline";
                return (
                  <li key={s.slug}>
                    {href ? (
                      <Link href={href} className={`${cls} hover:text-primary`}>
                        {row}
                      </Link>
                    ) : (
                      <div className={cls}>{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* Journal */}
      <section id="journal" aria-labelledby="journal-title">
        <Container className="flex flex-col gap-12 pt-10 pb-24 lg:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <Eyebrow>{journalLabels[lang].homeEyebrow}</Eyebrow>
              <h2 id="journal-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[40px]">
                {journalLabels[lang].homeTitle}
              </h2>
            </div>
            <ButtonLink href={localePath(lang, "/journal")} variant="outline" size="md" className="!h-12 !px-[30px] text-sm">
              {journalLabels[lang].allArticles}
            </ButtonLink>
          </div>
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {latestArticles(3).map((a) => {
              const t = articleText[lang][a.slug];
              return (
                <li key={a.slug}>
                  <Link href={localePath(lang, `/journal/${a.slug}`)} className="flex flex-col gap-4 text-ink no-underline hover:text-ink">
                    <Image
                      src={a.image.card}
                      alt={t.imageAlt}
                      width={a.image.cardW}
                      height={a.image.cardH}
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                      className="h-[250px] w-full rounded-[20px] bg-tint object-cover"
                    />
                    <span className="self-start rounded-pill bg-tint px-3.5 py-[5px] text-xs text-primary">{t.category}</span>
                    <span className="font-display text-[22px] leading-[1.6] font-semibold">{t.title}</span>
                    <span className="text-[15px] leading-[1.9] text-muted">{t.excerpt}</span>
                    <span className="text-[13px] text-muted">{journalLabels[lang].minutes(a.readMinutes)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title">
        <JsonLd data={faqSchema(c.faq)} />
        <Container className="flex flex-col gap-10 pb-24 lg:flex-row lg:gap-24 lg:pb-32">
          <div className="flex shrink-0 flex-col gap-3.5 lg:w-[340px]">
            <Eyebrow>{c.faqEyebrow}</Eyebrow>
            <h2 id="faq-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[40px]">
              {c.faqTitle}
            </h2>
          </div>
          <div className="grow">
            <Faq items={c.faq} />
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-6">
        <Container>
          <div className="flex flex-col justify-between gap-12 rounded-[32px] bg-linear-160 from-tint to-[#EDF1F3] px-6 py-12 lg:flex-row lg:gap-20 lg:px-[88px] lg:py-20">
            <div className="flex max-w-[480px] flex-col gap-[18px]">
              <Eyebrow>{c.contact.eyebrow}</Eyebrow>
              <h2 id="contact-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[38px]">
                {c.contact.title}
              </h2>
              <p className="text-base leading-[2] text-muted-2">{c.contact.body}</p>
              <div className="mt-2">
                <ButtonLink href={book.href} data-umami-event="book_cta" {...bookProps}>
                  {book.label}
                </ButtonLink>
              </div>
            </div>
            <dl className="flex flex-col text-base leading-[1.9] lg:w-[440px]">
              <div className="flex flex-col gap-1 border-b border-[#D2DCE4] pb-5">
                <dt className="text-[13px] text-muted-2">{t.phone}</dt>
                <dd>
                  <PhoneLink lang={lang} />
                </dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#D2DCE4] py-5">
                <dt className="text-[13px] text-muted-2">{t.whatsapp}</dt>
                <dd>
                  <a
                    href={site.whatsapp.url}
                    {...externalProps}
                    dir="ltr"
                    data-umami-event="whatsapp_click"
                    className="-my-2.5 inline-flex items-center gap-2.5 whitespace-nowrap py-2.5 font-semibold text-ink no-underline hover:text-primary"
                  >
                    <WhatsAppIcon size={20} className="text-[#1f8f5f]" />
                    {site.whatsapp.display}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#D2DCE4] py-5">
                <dt className="text-[13px] text-muted-2">{t.address}</dt>
                <dd className="flex flex-col items-start gap-4">
                  <span className="flex gap-2.5">
                    <PinIcon size={20} className="mt-1.5 shrink-0 text-primary" />
                    {f.address}
                  </span>
                  {/* The Persian address, for showing to a taxi driver. */}
                  <span lang="fa" dir="rtl" className="ps-[30px] text-sm text-muted-2">
                    {f.addressFa}
                  </span>
                  <DirectionsLink lang={lang} />
                </dd>
              </div>
              <div className={`flex flex-col gap-1 pt-5 ${site.instagram ? "border-b border-[#D2DCE4] pb-5" : ""}`}>
                <dt className="text-[13px] text-muted-2">{t.hours}</dt>
                <dd>
                  {f.hours}
                  <span className="block text-sm text-muted-2">{f.closedDays}</span>
                </dd>
              </div>
              {site.instagram && (
                <div className="flex flex-col gap-1 pt-5">
                  <dt className="text-[13px] text-muted-2">{t.instagram}</dt>
                  <dd>
                    <a
                      href={site.instagram}
                      {...externalProps}
                      dir="ltr"
                      data-umami-event="instagram_click"
                      className="-my-2.5 inline-flex items-center gap-2 py-2.5 font-medium text-ink no-underline hover:text-primary"
                    >
                      <InstagramIcon size={18} className="text-primary" />
                      {site.instagramHandle}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
