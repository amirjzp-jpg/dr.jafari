import type { Metadata } from "next";
import Image from "next/image";
import { BookingCta } from "@/components/content/BookingCta";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { pagesCopy } from "@/content/i18n/pages";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { buildMetadata, personSchema } from "@/lib/seo";
import aboutDetail from "@/public/images/doctor/about-detail.webp";
import aboutMain from "@/public/images/doctor/about-main.webp";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const c = pagesCopy[lang].about;
  return buildMetadata({ lang, title: { absolute: c.metaTitle }, description: c.metaDescription, path: localePath(lang, "/about") });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const c = pagesCopy[lang].about;
  return (
    <>
      <JsonLd data={personSchema(lang)} />
      <PageHeader lang={lang} title={c.h1} crumbs={[{ name: c.crumb, path: localePath(lang, "/about") }]} />
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
        <div className="flex max-w-[680px] grow flex-col gap-6">
          <p className="text-[19px] leading-[2] text-ink">{c.paragraphs[0]}</p>
          {c.paragraphs.slice(1).map((p) => (
            <p key={p} className="text-[17px] leading-[2.1] text-muted-2">
              {p}
            </p>
          ))}
          <dl className="mt-2 flex flex-col text-[15px]">
            {c.rows.map((r, i) => (
              <div key={r.k} className={`flex justify-between gap-6 border-t border-line py-3.5 ${i === c.rows.length - 1 ? "border-b" : ""}`}>
                <dt className="text-muted">{r.k}</dt>
                <dd className="text-end">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid w-full max-w-[520px] grid-cols-[3fr_2fr] items-end gap-4 lg:w-[460px]">
          <div className="relative aspect-[420/580] overflow-hidden rounded-[50%_50%_24px_24px/36.2%_36.2%_24px_24px] bg-tint">
            <Image src={aboutMain} alt={c.altMain} fill sizes="280px" className="object-cover object-[50%_30%]" />
          </div>
          <div className="relative aspect-[250/270] overflow-hidden rounded-[20px] bg-tint">
            <Image src={aboutDetail} alt={c.altDetail} fill sizes="190px" className="object-cover object-[50%_20%]" />
          </div>
        </div>
      </Container>
      <BookingCta lang={lang} />
    </>
  );
}
