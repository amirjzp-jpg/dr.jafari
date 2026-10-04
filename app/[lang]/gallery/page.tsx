import type { Metadata } from "next";
import { BookingCta } from "@/components/content/BookingCta";
import { InstagramCta } from "@/components/content/InstagramCta";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { GalleryView } from "@/components/gallery/GalleryView";
import { Container } from "@/components/layout/Container";
import { cover } from "@/content/gallery";
import { galleryFor, treatmentLabelFor } from "@/content/i18n/gallery";
import { pagesCopy } from "@/content/i18n/pages";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { abs, buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const c = pagesCopy[lang].gallery;
  return buildMetadata({ lang, title: c.metaTitle, description: c.metaDescription, path: localePath(lang, "/gallery") });
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const c = pagesCopy[lang].gallery;
  const items = galleryFor(lang);
  const here = localePath(lang, "/gallery");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: c.schemaName,
          url: abs(here),
          inLanguage: lang,
          about: { "@id": abs("/#clinic") },
          image: items.map((g) => ({
            "@type": "ImageObject",
            contentUrl: abs(cover(g)),
            description: g.alt,
            about: treatmentLabelFor(lang, g.treatment),
          })),
        }}
      />
      <PageHeader lang={lang} title={c.h1} crumbs={[{ name: c.crumb, path: here }]} lead={c.lead} />
      <Container className="pb-8">
        <GalleryView items={items} lang={lang} />
        <p className="mx-auto mt-12 max-w-[640px] text-center text-sm leading-[2] text-muted">{c.note}</p>
      </Container>
      <InstagramCta lang={lang} className="pt-16 lg:pt-20" />
      <BookingCta lang={lang} title={c.ctaTitle} />
    </>
  );
}
