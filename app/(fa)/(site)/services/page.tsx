import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { BookingCta } from "@/components/content/BookingCta";
import { PageHeader } from "@/components/content/PageHeader";
import { ServiceIcon } from "@/components/icons/services";
import { Container } from "@/components/layout/Container";
import { services } from "@/content/services";

export const metadata: Metadata = buildMetadata({
  title: "خدمات دندانپزشکی در شیراز، معالی‌آباد",
  description:
    "خدمات کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز، معالی‌آباد: کامپوزیت، لمینت سرامیکی، طراحی لبخند، بلیچینگ، ایمپلنت، ترمیم، عصب‌کشی، جراحی و ارتودنسی.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="خدمات دندانپزشکی در شیراز"
        lead={
          <>
            <p>تمرکز اصلی کلینیک بر کامپوزیت و لمینت سرامیکی است؛ در کنار آن، خدمات کامل دندانپزشکی نیز ارائه می‌شود.</p>
            <p>
              کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز، <Link href="/dentist-maaliabad-shiraz">معالی‌آباد</Link>، خدمات زیر را ارائه می‌دهد. برای شروع، یک جلسه‌ی معاینه و مشاوره رزرو کنید تا وضعیت دندان‌ها بررسی شود و گزینه‌های درمان را با هم مرور کنیم.
            </p>
          </>
        }
        crumbs={[{ name: "خدمات", path: "/services" }]}
      />
      <Container>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.href}
                className={`flex h-full items-start gap-4 rounded-[24px] p-6 text-ink no-underline hover:text-ink ${
                  s.featured ? "bg-linear-160 from-tint to-[#EEF2F3]" : "border border-line bg-surface hover:border-primary"
                }`}
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface">
                  <ServiceIcon name={s.icon} />
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-[22px] font-semibold">{s.name}</span>
                  <span className="text-[15px] leading-[1.9] text-muted-2">{s.short}</span>
                  <span className="text-sm font-medium text-primary">بیشتر بدانید ←</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <BookingCta />
    </>
  );
}
