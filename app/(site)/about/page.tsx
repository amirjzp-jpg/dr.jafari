import type { Metadata } from "next";
import Image from "next/image";
import { BookingCta } from "@/components/content/BookingCta";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { personSchema } from "@/lib/seo";
import aboutDetail from "@/public/images/doctor/about-detail.webp";
import aboutMain from "@/public/images/doctor/about-main.webp";

export const metadata: Metadata = {
  title: "درباره‌ی دکتر",
  description: "آشنایی با دکتر ندا جعفری، دندانپزشک زیبایی در شیراز با بیش از ده سال تجربه در کامپوزیت و لمینت سرامیکی.",
  alternates: { canonical: "/about" },
};

const rows = [
  { k: "رویکرد", v: "حفظ حداکثری بافت دندان" },
  { k: "طراحی", v: "متناسب با چهره" },
  { k: "مشاوره", v: "بررسی همه‌ی گزینه‌ها پیش از درمان" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <PageHeader title="درباره‌ی دکتر ندا جعفری" crumbs={[{ name: "درباره‌ی دکتر", path: "/about" }]} />
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
        <div className="flex max-w-[680px] grow flex-col gap-6">
          <p className="text-[17px] leading-[2.1] text-muted-2">
            دکتر ندا جعفری، دانش‌آموخته‌ی دندانپزشکی از [دانشگاه ؟]، بیش از ده سال است که در زمینه‌ی دندانپزشکی زیبایی
            فعالیت می‌کند. تمرکز اصلی کلینیک بر کامپوزیت و لمینت سرامیکی است.
          </p>
          <p className="text-[17px] leading-[2.1] text-muted-2">[یک یا دو جمله درباره‌ی رویکرد درمان، از زبان خود دکتر.]</p>
          <p className="text-[17px] leading-[2.1] text-muted-2">
            کلینیک در شیراز، پل معالی‌آباد قرار دارد؛ کلینیکی مجهز به تجهیزات و فناوری‌های روز دندانپزشکی، با امکان پرداخت
            اقساطی برای درمان‌های زیبایی.
          </p>
          <dl className="mt-2 flex flex-col text-[15px]">
            {rows.map((r, i) => (
              <div key={r.k} className={`flex justify-between gap-6 border-t border-line py-3.5 ${i === rows.length - 1 ? "border-b" : ""}`}>
                <dt className="text-muted">{r.k}</dt>
                <dd className="text-end">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid w-full max-w-[520px] grid-cols-[3fr_2fr] items-end gap-4 lg:w-[460px]">
          <div className="relative aspect-[420/580] overflow-hidden rounded-[50%_50%_24px_24px/36.2%_36.2%_24px_24px] bg-tint">
            <Image src={aboutMain} alt="دکتر ندا جعفری در حال درمان یک بیمار در کلینیک" fill sizes="280px" className="object-cover object-[50%_30%]" />
          </div>
          <div className="relative aspect-[250/270] overflow-hidden rounded-[20px] bg-tint">
            <Image src={aboutDetail} alt="دکتر ندا جعفری هنگام معاینه" fill sizes="190px" className="object-cover object-[50%_20%]" />
          </div>
        </div>
      </Container>
      <BookingCta />
    </>
  );
}
