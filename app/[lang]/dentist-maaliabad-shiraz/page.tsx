import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/content/BookingCta";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { PhoneIcon, PinIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DirectionsLink } from "@/components/ui/DirectionsLink";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { pagesCopy } from "@/content/i18n/pages";
import { INTL_UPDATED, serviceContent } from "@/content/i18n/services";
import { bookingFor, externalProps, facts, ui } from "@/content/i18n/ui";
import { services } from "@/content/services";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { abs, buildMetadata } from "@/lib/seo";

const path = "/dentist-maaliabad-shiraz";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const c = pagesCopy[lang].location;
  return buildMetadata({ lang, title: c.metaTitle, description: c.metaDescription, path: localePath(lang, path) });
}

const H2 = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <h2 id={id} className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
    {children}
  </h2>
);
const row = "flex flex-col gap-1.5 border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0";
const label = "text-[13px] text-muted-2";

export default async function MaaliabadPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const c = pagesCopy[lang].location;
  const t = ui[lang];
  const f = facts[lang];
  const book = bookingFor(lang);
  const here = localePath(lang, path);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": abs(`${here}#page`),
          url: abs(here),
          name: c.h1,
          inLanguage: lang,
          about: { "@id": abs("/#clinic") },
          isPartOf: { "@id": abs("/#website") },
          dateModified: INTL_UPDATED,
        }}
      />
      <PageHeader lang={lang} title={c.h1} crumbs={[{ name: c.crumb, path: here }]} lead={<p>{c.lead}</p>} />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-14 pb-4">
          <section aria-labelledby="where" className="flex flex-col gap-5">
            <H2 id="where">{c.whereTitle}</H2>
            <dl className="flex flex-col rounded-[24px] border border-line bg-surface px-6 py-6 text-base leading-[1.9] lg:px-8">
              <div className={row}>
                <dt className={label}>{t.address}</dt>
                <dd className="flex flex-col gap-2">
                  <span className="flex gap-2.5">
                    <PinIcon size={20} className="mt-1.5 shrink-0 text-primary" />
                    <address className="not-italic">{f.address}</address>
                  </span>
                  <span lang="fa" dir="rtl" className="ps-[30px] text-sm text-muted-2">
                    {f.addressFa}
                  </span>
                </dd>
              </div>
              <div className={row}>
                <dt className={label}>{t.hours}</dt>
                <dd>
                  {f.hours}
                  <span className="block text-sm text-muted-2">{f.closedDays}</span>
                </dd>
              </div>
              <div className={row}>
                <dt className={label}>{t.phone}</dt>
                <dd className="flex items-center gap-2.5">
                  <PhoneIcon size={20} className="shrink-0 text-primary" />
                  <PhoneLink lang={lang} />
                </dd>
              </div>
            </dl>
            <div>
              <DirectionsLink lang={lang} />
            </div>
          </section>

          <section aria-labelledby="treatments" className="flex flex-col gap-4">
            <H2 id="treatments">{c.treatmentsTitle}</H2>
            <p className="text-[17px] leading-[2] text-muted-2">{c.treatmentsBody}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => {
                const tx = serviceContent[lang][s.slug];
                return (
                  <li key={s.slug}>
                    <Link
                      href={localePath(lang, s.href)}
                      className="flex h-full flex-col gap-1 rounded-[20px] border border-line bg-surface p-5 no-underline transition-colors hover:border-champagne"
                    >
                      <span className="font-medium text-ink">{tx.name}</span>
                      <span className="text-sm leading-[1.8] text-muted-2">{tx.short}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="booking" className="flex flex-col gap-4">
            <H2 id="booking">{c.bookingTitle}</H2>
            <p className="text-[17px] leading-[2] text-muted-2">{c.bookingBody}</p>
            <div>
              <ButtonLink href={book.href} data-umami-event="book_cta" {...(book.external ? externalProps : {})}>
                {book.label}
              </ButtonLink>
            </div>
          </section>

          <section aria-labelledby="doctor" className="flex flex-col gap-4">
            <H2 id="doctor">{c.doctorTitle}</H2>
            <p className="text-[17px] leading-[2] text-muted-2">
              {c.doctorBody.replace("{council}", f.council)} <Link href={localePath(lang, "/about")}>{c.doctorLink}</Link>
            </p>
          </section>
        </div>
      </Container>
      <BookingCta lang={lang} />
    </>
  );
}
