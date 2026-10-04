import type { Metadata } from "next";
import { LocalizedServicePage } from "@/components/content/LocalizedServicePage";
import { serviceContent } from "@/content/i18n/services";
import { serviceBySlug } from "@/content/services";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug("composite")!;

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const t = serviceContent[lang][service.slug];
  return buildMetadata({ lang, title: t.title, description: t.metaDescription, path: localePath(lang, service.href) });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  return <LocalizedServicePage lang={lang} service={service} />;
}
