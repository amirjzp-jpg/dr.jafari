import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedServicePage } from "@/components/content/LocalizedServicePage";
import { serviceContent } from "@/content/i18n/services";
import { otherServices, serviceBySlug } from "@/content/services";
import { intlLocales, isIntl, localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

// Composite and veneers have their own top-level pages.
export const dynamicParams = false;
export function generateStaticParams() {
  return intlLocales.flatMap((lang) => otherServices.map((s) => ({ lang, slug: s.slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const s = serviceBySlug(slug);
  if (!isIntl(lang) || !s || s.featured) return {};
  const t = serviceContent[lang][s.slug];
  return buildMetadata({ lang, title: t.title, description: t.metaDescription, path: localePath(lang, s.href) });
}

export default async function ServiceDetail({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const s = serviceBySlug(slug);
  if (!isIntl(lang) || !s || s.featured) notFound();
  return <LocalizedServicePage lang={lang} service={s} />;
}
