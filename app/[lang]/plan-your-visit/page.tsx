import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { INTL_UPDATED, serviceContent } from "@/content/i18n/services";
import { pagesCopy } from "@/content/i18n/pages";
import { externalProps, waLink } from "@/content/i18n/ui";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { abs, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

const path = "/plan-your-visit";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const c = pagesCopy[lang].stay;
  return buildMetadata({ lang, title: c.metaTitle, description: c.metaDescription, path: localePath(lang, path) });
}

/**
 * How long to plan in Shiraz, for patients coming from abroad. The times are the clinic's
 * own approximate figures (client, 2026-10-04); this page exists only in Arabic and English.
 */
export default async function PlanYourVisit({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const c = pagesCopy[lang].stay;
  const here = localePath(lang, path);
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": abs(`${here}#page`),
            url: abs(here),
            name: c.h1,
            inLanguage: lang,
            about: { "@id": abs("/#clinic") },
            isPartOf: { "@id": abs("/#website") },
            dateModified: INTL_UPDATED,
          },
          breadcrumbSchema([
            { name: pagesCopy[lang].home, path: localePath(lang, "/") },
            { name: c.crumb, path: here },
          ]),
          faqSchema(c.faq),
        ]}
      />
      <PageHeader lang={lang} title={c.h1} crumbs={[{ name: c.crumb, path: here }]} lead={<p>{c.lead}</p>} />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-14 pb-4">
          <section aria-labelledby="times" className="flex flex-col gap-5">
            <h2 id="times" className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
              {c.tableTitle}
            </h2>
            <div className="overflow-hidden rounded-[24px] border border-line bg-surface">
              <table className="w-full text-start text-base">
                <thead>
                  <tr className="bg-tint text-sm text-muted-2">
                    <th scope="col" className="w-2/5 px-5 py-3 text-start font-medium lg:px-7">
                      {c.colTreatment}
                    </th>
                    <th scope="col" className="px-5 py-3 text-start font-medium lg:px-7">
                      {c.colTime}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r.slug} className="border-t border-line align-top">
                      <th scope="row" className="px-5 py-4 text-start font-medium lg:px-7">
                        <Link href={localePath(lang, r.slug === "composite" ? "/composite" : r.slug === "veneers" ? "/veneers" : `/services/${r.slug}`)}>
                          {serviceContent[lang][r.slug].name}
                        </Link>
                      </th>
                      <td className="px-5 py-4 lg:px-7">
                        <span className="font-semibold">{r.time}</span>
                        {r.note && <span className="mt-1 block text-sm leading-[1.8] text-muted-2">{r.note}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="faq" className="flex flex-col gap-4">
            <h2 id="faq" className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
              {lang === "ar" ? "أسئلة شائعة" : "Frequently asked questions"}
            </h2>
            <div className="flex flex-col border-t border-line">
              {c.faq.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="text-xl text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-base leading-[2] text-muted-2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="cta" className="flex flex-col gap-4 rounded-[24px] bg-linear-160 from-tint to-[#EDF1F3] p-6 lg:p-8">
            <h2 id="cta" className="font-display text-[22px] leading-normal font-semibold lg:text-[28px]">
              {c.ctaTitle}
            </h2>
            <p className="text-base leading-[2] text-muted-2">{c.ctaBody}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={waLink(lang)} data-umami-event="whatsapp_click" {...externalProps}>
                {lang === "ar" ? "احجز عبر واتساب" : "Book on WhatsApp"}
              </ButtonLink>
              <PhoneLink lang={lang} />
            </div>
          </section>
        </div>
      </Container>
      <div className="pb-24" />
    </>
  );
}
