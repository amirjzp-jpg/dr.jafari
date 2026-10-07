import Image from "next/image";
import { InstagramIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

const copy = {
  fa: {
    eyebrow: "اینستاگرام",
    title: "لبخندهای تازه، در اینستاگرام",
    body: "نمونه‌کارهای جدید، نکته‌های مراقبت و روزهای کلینیک را در صفحه‌ی اینستاگرام دکتر جعفری دنبال کنید.",
  },
  ar: {
    eyebrow: "إنستغرام",
    title: "ابتسامات جديدة على إنستغرام",
    body: "تابعوا النماذج الجديدة ونصائح العناية ويوميات العيادة على صفحة الدكتورة جعفري في إنستغرام.",
  },
  en: {
    eyebrow: "Instagram",
    title: "New smiles, on Instagram",
    body: "Follow new results, aftercare tips and days at the clinic on Dr. Jafari's Instagram page.",
  },
} as const;

// Three real results fanned like prints, a small static echo of the gallery's card fan.
const prints = [
  { src: "/images/gallery/veneer-2.webp", className: "-rotate-[9deg] translate-x-[46%] translate-y-3" },
  { src: "/images/gallery/smile-1-after.webp", className: "rotate-[8deg] -translate-x-[46%] translate-y-3" },
  { src: "/images/gallery/veneer-1.webp", className: "z-10 -translate-y-1" },
];

/** Follow-on-Instagram band. Links out only: no embed (Instagram is filtered in Iran and would load Meta scripts). */
export function InstagramCta({ className = "", lang = "fa" }: { className?: string; lang?: Locale }) {
  if (!site.instagram) return null;
  const c = copy[lang];
  return (
    <section aria-labelledby="ig-title" className={className}>
      <Container>
        <div className="relative flex flex-col items-center gap-10 overflow-hidden rounded-[32px] bg-linear-160 from-tint to-[#EDF1F3] px-6 py-12 lg:flex-row lg:justify-between lg:gap-16 lg:px-[88px] lg:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-24 hidden size-72 rounded-full border border-champagne opacity-50 lg:block" />
          <div className="flex max-w-[480px] flex-col items-center gap-4 text-center lg:items-start lg:text-start">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 id="ig-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[38px]">
              {c.title}
            </h2>
            <p className="text-base leading-[2] text-muted-2">
              {c.body}
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="instagram_click"
              className="mt-2 inline-flex h-[52px] items-center gap-3 rounded-pill bg-primary ps-6 pe-7 text-base font-medium text-white no-underline transition-colors hover:bg-primary-hover hover:text-white"
            >
              <InstagramIcon size={20} />
              <span dir="ltr">{site.instagramHandle}</span>
            </a>
          </div>
          <div aria-hidden="true" className="relative flex h-[210px] w-full max-w-[300px] shrink-0 items-center justify-center sm:h-[230px] lg:h-[300px] lg:w-[400px] lg:max-w-none">
            {prints.map((p) => (
              <div
                key={p.src}
                className={`absolute aspect-[4/5] w-[128px] overflow-hidden rounded-[18px] border-[5px] border-surface bg-tint shadow-[0_22px_44px_-22px_rgba(28,39,51,0.45)] sm:w-[150px] lg:w-[190px] ${p.className}`}
              >
                <Image src={p.src} alt="" fill sizes="190px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
