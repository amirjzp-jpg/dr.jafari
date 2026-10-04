import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../fonts";
// English headings (see the html[lang="en"] rules in globals.css). Only the Latin subset, and a file
// downloads only on a page that has text in it.
import "@fontsource/playfair-display/latin-500.css";
import "@fontsource/playfair-display/latin-600.css";
import "../globals.css";
import { Analytics } from "@/components/layout/Analytics";
import { SiteShell } from "@/components/layout/SiteShell";
import { facts } from "@/content/i18n/ui";
import { dirOf, intlLocales, isIntl } from "@/lib/i18n";
import { robotsMeta, siteUrl } from "@/lib/seo";

// The Arabic (/ar) and English (/en) versions of the site. Persian is the root
// layout in app/(fa). Any other first path segment is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return intlLocales.map((lang) => ({ lang }));
}

const titleSuffix = { ar: "د. فاطمة جعفري", en: "Dr. Fatemeh Jafari" } as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isIntl(lang)) return {};
  return {
    metadataBase: new URL(siteUrl),
    applicationName: facts[lang].clinicName,
    title: { default: facts[lang].clinicName, template: `%s | ${titleSuffix[lang]}` },
    robots: robotsMeta,
    category: "health",
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#E4EEF6",
  viewportFit: "cover",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isIntl(lang)) notFound();
  return (
    <html lang={lang} dir={dirOf(lang)}>
      <body className="min-h-dvh antialiased">
        <SiteShell lang={lang}>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
