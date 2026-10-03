import type { Metadata } from "next";
import { BookingCta } from "@/components/content/BookingCta";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { InstagramCta } from "@/components/content/InstagramCta";
import { GalleryView } from "@/components/gallery/GalleryView";
import { Container } from "@/components/layout/Container";
import { cover, gallery, treatmentLabel } from "@/content/gallery";
import { abs, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "نمونه‌کارهای دندانپزشکی زیبایی در شیراز",
  description:
    "تصاویر واقعی قبل و بعد از کامپوزیت ونیر، لمینت سرامیکی، طراحی لبخند و بلیچینگ در کلینیک دکتر فاطمه جعفری، معالی‌آباد شیراز.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: "نمونه‌کارهای کلینیک دکتر فاطمه جعفری",
          url: abs("/gallery"),
          about: { "@id": abs("/#clinic") },
          image: gallery.map((g) => ({
            "@type": "ImageObject",
            contentUrl: abs(cover(g)),
            description: g.alt,
            about: treatmentLabel(g.treatment),
          })),
        }}
      />
      <PageHeader
        title="نمونه‌کارها"
        crumbs={[{ name: "نمونه‌کارها", path: "/gallery" }]}
        lead="نتیجه‌ی درمان‌های انجام‌شده در کلینیک، از کامپوزیت و لمینت تا طراحی لبخند و بلیچینگ. روی هر تصویر بزنید تا بزرگ‌تر ببینید؛ در نمونه‌های قبل و بعد، خط وسط را بکشید."
      />

      <Container className="pb-8">
        <GalleryView items={gallery} />

        <p className="mx-auto mt-12 max-w-[640px] text-center text-sm leading-[2] text-muted">
          همه‌ی تصاویر مربوط به بیماران کلینیک است و فقط برش و چرخش خورده‌اند؛ خودِ دندان‌ها ویرایش نشده‌اند. نتیجه‌ی هر
          درمان به شرایط دهان و دندان هر فرد بستگی دارد.
        </p>
      </Container>

      <InstagramCta className="pt-16 lg:pt-20" />
      <BookingCta title="لبخند شما، نمونه‌ی بعدی" />
    </>
  );
}
