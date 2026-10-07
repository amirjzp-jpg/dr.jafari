import type { Metadata } from "next";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { richText } from "@/components/content/rich";
import { pagesCopy } from "@/content/i18n/pages";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const c = pagesCopy[lang].policy;
  return buildMetadata({ lang, title: c.metaTitle, description: c.metaDescription, path: localePath(lang, "/booking-policy") });
}

export default async function BookingPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const c = pagesCopy[lang].policy;
  const sections = c.sections.map((s) => ({
    h: s.h,
    p: s.p?.map((t) => richText(t, lang)),
    ul: s.ul?.map((t) => richText(t, lang)),
  }));
  return (
    <>
      <PageHeader lang={lang} title={c.h1} crumbs={[{ name: c.crumb, path: localePath(lang, "/booking-policy") }]} />
      <Prose sections={sections} reviewed />
    </>
  );
}
