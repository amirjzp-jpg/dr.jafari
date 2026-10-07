import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { Container } from "@/components/layout/Container";
import { pagesCopy } from "@/content/i18n/pages";
import { localePath, type Locale } from "@/lib/i18n";
import { breadcrumbSchema } from "@/lib/seo";
import { displayTitle } from "@/lib/title-case";

/** Breadcrumbs + H1 + optional lead, on the soft tint that fades into ivory. */
export function PageHeader({
  title,
  lead,
  crumbs,
  lang = "fa",
}: {
  title: string;
  lead?: React.ReactNode;
  /** Paths are the final URLs (already prefixed for Arabic and English). */
  crumbs: { name: string; path: string }[];
  lang?: Locale;
}) {
  const home = lang === "fa" ? "خانه" : pagesCopy[lang].home;
  const all = [{ name: home, path: localePath(lang, "/") }, ...crumbs];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-linear-to-b from-tint to-ivory" />
      <Container className="flex flex-col gap-4 pt-8 pb-10 lg:pt-14 lg:pb-14">
        <nav aria-label={lang === "fa" ? "مسیر صفحه" : pagesCopy[lang].breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i < all.length - 1 ? (
                  <Link href={c.path} className="-my-2.5 inline-block py-2.5 text-muted no-underline hover:text-primary">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-[860px] font-display text-[30px] leading-normal font-semibold lg:text-[52px]">{displayTitle(lang, title)}</h1>
        {lead && <div className="max-w-[680px] text-[17px] leading-[2] text-muted-2">{lead}</div>}
      </Container>
    </>
  );
}
