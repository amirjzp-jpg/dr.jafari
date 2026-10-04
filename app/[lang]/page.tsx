import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedHome } from "@/components/home/LocalizedHome";
import { homeCopy } from "@/content/i18n/home";
import { intlLocales, isIntl, localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return intlLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isIntl(lang)) return {};
  const c = homeCopy[lang];
  return buildMetadata({ lang, title: { absolute: c.metaTitle }, description: c.metaDescription, path: localePath(lang, "/") });
}

export default async function LangHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isIntl(lang)) notFound();
  return <LocalizedHome lang={lang} />;
}
