import Link from "next/link";
import { Container } from "@/components/layout/Container";

const versions = [
  { lang: "fa", dir: "rtl", title: "این صفحه پیدا نشد", text: "ممکن است نشانی اشتباه باشد یا صفحه جابه‌جا شده باشد.", home: "صفحه‌ی اصلی", href: "/" },
  { lang: "ar", dir: "rtl", title: "لم يتم العثور على هذه الصفحة", text: "قد يكون العنوان خاطئًا أو تم نقل الصفحة.", home: "الصفحة الرئيسية", href: "/ar" },
  { lang: "en", dir: "ltr", title: "This page could not be found", text: "The address may be wrong, or the page may have moved.", home: "Home page", href: "/en" },
] as const;

/**
 * The page for any address that matches nothing. A visitor to /ar/… or /en/… and a
 * visitor to a Persian address all land here, so it says the same thing in the three
 * languages and links each one's home page.
 */
export function TrilingualNotFound() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-linear-to-b from-tint to-ivory" />
      <main className="grow">
        <Container className="flex flex-col items-center gap-10 py-20 text-center lg:py-28">
          <span className="font-display text-6xl text-blue-mid" aria-hidden="true">
            404
          </span>
          <div className="grid w-full max-w-[960px] gap-6 md:grid-cols-3">
            {versions.map((v, i) => (
              <section
                key={v.lang}
                lang={v.lang}
                dir={v.dir}
                className="flex flex-col items-center gap-3 rounded-[24px] border border-line bg-surface p-6"
              >
                {i === 0 ? (
                  <h1 className="font-display text-[24px] font-semibold">{v.title}</h1>
                ) : (
                  <h2 className="font-display text-[24px] font-semibold">{v.title}</h2>
                )}
                <p className="text-base leading-[1.9] text-muted">{v.text}</p>
                <Link
                  href={v.href}
                  hrefLang={v.lang}
                  className="mt-2 inline-flex h-12 items-center justify-center rounded-pill border border-primary px-7 text-sm font-medium text-primary no-underline hover:bg-tint"
                >
                  {v.home}
                </Link>
              </section>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
