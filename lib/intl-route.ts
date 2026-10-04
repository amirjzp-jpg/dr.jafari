import { notFound } from "next/navigation";
import { intlLocales, isIntl, type IntlLocale } from "@/lib/i18n";

/** generateStaticParams for a page that exists in each non-Persian language. */
export const intlStaticParams = () => intlLocales.map((lang) => ({ lang }));

type LangParams = Promise<{ lang: string }>;

/** The page's language, or a 404 for anything but /ar and /en. */
export async function pageLang(params: LangParams): Promise<IntlLocale> {
  const { lang } = await params;
  if (!isIntl(lang)) notFound();
  return lang;
}

/** Like pageLang for generateMetadata, which returns no metadata for an unknown language. */
export async function metaLang(params: LangParams): Promise<IntlLocale | null> {
  const { lang } = await params;
  return isIntl(lang) ? lang : null;
}
