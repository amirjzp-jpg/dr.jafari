import type { Metadata } from "next";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { PhoneIcon, PinIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DirectionsLink } from "@/components/ui/DirectionsLink";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { INTL_UPDATED } from "@/content/i18n/services";
import { pagesCopy } from "@/content/i18n/pages";
import { externalProps, facts, waLink } from "@/content/i18n/ui";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { abs, buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const c = pagesCopy[lang].contact;
  return buildMetadata({ lang, title: c.metaTitle, description: c.metaDescription, path: localePath(lang, "/booking") });
}

const H2 = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <h2 id={id} className="font-display text-[22px] leading-normal font-semibold lg:text-[28px]">
    {children}
  </h2>
);
const card = "flex flex-col gap-4 rounded-[24px] border border-line bg-surface p-6 lg:p-8";

/**
 * How to book from abroad. The SMS-code booking only works with Iranian numbers, so
 * Arabic and English visitors get WhatsApp and the phone; Iranian numbers are sent to
 * the Persian booking page.
 */
export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const c = pagesCopy[lang].contact;
  const f = facts[lang];
  const here = localePath(lang, "/booking");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
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
        <div className="flex max-w-[860px] flex-col gap-8 pb-24">
          <div className="grid gap-6 md:grid-cols-2">
            <section aria-labelledby="wa" className={card}>
              <H2 id="wa">{c.waTitle}</H2>
              <p className="text-base leading-[2] text-muted-2">{c.waBody}</p>
              <div className="mt-auto flex flex-col items-start gap-3">
                <ButtonLink href={waLink(lang)} data-umami-event="whatsapp_click" {...externalProps}>
                  {c.waButton}
                </ButtonLink>
                <span dir="ltr" className="ltr-nums text-sm font-semibold text-ink">
                  {site.whatsapp.display}
                </span>
              </div>
            </section>

            <section aria-labelledby="tel" className={card}>
              <H2 id="tel">{c.phoneTitle}</H2>
              <p className="flex items-center gap-2.5 text-base">
                <PhoneIcon size={20} className="shrink-0 text-primary" />
                <PhoneLink lang={lang} />
              </p>
              <p className="text-base leading-[2] text-muted-2">
                {f.hours}
                <span className="block text-sm">{f.closedDays}</span>
              </p>
              <p className="mt-auto text-sm text-muted-2">{c.teamNote}</p>
            </section>
          </div>

          <section aria-labelledby="visit" className="flex flex-col gap-3">
            <H2 id="visit">{c.visitTitle}</H2>
            <p className="text-[17px] leading-[2] text-muted-2">{c.visitBody}</p>
          </section>

          <section aria-labelledby="iran" className={`${card} bg-linear-160 from-tint to-[#EDF1F3] border-transparent`}>
            <H2 id="iran">{c.iranTitle}</H2>
            <p className="text-base leading-[2] text-muted-2">{c.iranBody}</p>
            <div>
              <ButtonLink href="/booking" variant="outline" size="md" hrefLang="fa" lang="fa">
                {c.iranButton}
              </ButtonLink>
            </div>
          </section>

          <section aria-labelledby="place" className="flex flex-col gap-4">
            <H2 id="place">{c.placeTitle}</H2>
            <p className="flex gap-2.5 text-base leading-[1.9]">
              <PinIcon size={20} className="mt-1.5 shrink-0 text-primary" />
              <span>{f.address}</span>
            </p>
            <p lang="fa" dir="rtl" className="ps-[30px] text-sm text-muted-2">
              {f.addressFa}
            </p>
            <div>
              <DirectionsLink lang={lang} />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
