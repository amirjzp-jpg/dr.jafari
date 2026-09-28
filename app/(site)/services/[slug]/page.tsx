import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingCta } from "@/components/content/BookingCta";
import { DraftNotice } from "@/components/content/DraftNotice";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { otherServices, serviceBySlug } from "@/content/services";
import { faqSchema } from "@/lib/seo";

// Composite and veneers have their own top-level pages.
export const dynamicParams = false;
export function generateStaticParams() {
  return otherServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return { title: s.title, description: s.metaDescription, alternates: { canonical: s.href } };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s || s.featured) notFound();
  return (
    <>
      <PageHeader title={s.title} crumbs={[{ name: "خدمات", path: "/services" }, { name: s.name, path: s.href }]} />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-5">
          <DraftNotice reviewed={s.reviewed} />
          {s.intro.map((p) => (
            <p key={p} className="text-[17px] leading-[2] text-muted-2">
              {p}
            </p>
          ))}
          <p className="text-[17px] leading-[2] text-muted-2">
            برای بررسی وضعیت دندان‌ها و گفت‌وگو درباره‌ی این درمان، یک جلسه‌ی معاینه و مشاوره رزرو کنید.
          </p>
          {s.faq && s.faq.length > 0 && (
            <section aria-labelledby="faq" className="mt-8 flex flex-col gap-4">
              <JsonLd data={faqSchema(s.faq)} />
              <h2 id="faq" className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
                پرسش‌های رایج
              </h2>
              <Faq items={s.faq} />
            </section>
          )}
        </div>
      </Container>
      <BookingCta />
    </>
  );
}
