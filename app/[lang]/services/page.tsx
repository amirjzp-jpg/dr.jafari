import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/content/BookingCta";
import { PageHeader } from "@/components/content/PageHeader";
import { ServiceIcon } from "@/components/icons/services";
import { Container } from "@/components/layout/Container";
import { serviceContent, serviceLabels } from "@/content/i18n/services";
import { ui } from "@/content/i18n/ui";
import { services } from "@/content/services";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const l = serviceLabels[lang];
  return buildMetadata({ lang, title: l.servicesMetaTitle, description: l.servicesMeta, path: localePath(lang, "/services") });
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const l = serviceLabels[lang];
  const here = localePath(lang, "/services");
  return (
    <>
      <PageHeader
        lang={lang}
        title={l.servicesTitle}
        lead={
          <>
            {l.servicesLead.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </>
        }
        crumbs={[{ name: l.servicesTitle, path: here }]}
      />
      <Container>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((s) => {
            const t = serviceContent[lang][s.slug];
            return (
              <li key={s.slug}>
                <Link
                  href={localePath(lang, s.href)}
                  className={`flex h-full items-start gap-4 rounded-[24px] p-6 text-ink no-underline hover:text-ink ${
                    s.featured ? "bg-linear-160 from-tint to-[#EEF2F3]" : "border border-line bg-surface hover:border-primary"
                  }`}
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-[22px] font-semibold">{t.name}</span>
                    <span className="text-[15px] leading-[1.9] text-muted-2">{t.short}</span>
                    <span className="text-sm font-medium text-primary">
                      {l.more} {ui[lang].arrow}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
      <BookingCta lang={lang} />
    </>
  );
}
