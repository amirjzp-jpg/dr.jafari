import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { Container } from "@/components/layout/Container";
import { breadcrumbSchema } from "@/lib/seo";

/** Breadcrumbs + H1 + optional lead, on the soft tint that fades into ivory. */
export function PageHeader({
  title,
  lead,
  crumbs,
}: {
  title: string;
  lead?: React.ReactNode;
  crumbs: { name: string; path: string }[];
}) {
  const all = [{ name: "خانه", path: "/" }, ...crumbs];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-linear-to-b from-tint to-ivory" />
      <Container className="flex flex-col gap-4 pt-8 pb-10 lg:pt-14 lg:pb-14">
        <nav aria-label="مسیر صفحه">
          <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i < all.length - 1 ? (
                  <Link href={c.path} className="text-muted no-underline hover:text-primary">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-[860px] font-display text-[30px] leading-normal font-semibold lg:text-[52px]">{title}</h1>
        {lead && <div className="max-w-[680px] text-[17px] leading-[2] text-muted-2">{lead}</div>}
      </Container>
    </>
  );
}
