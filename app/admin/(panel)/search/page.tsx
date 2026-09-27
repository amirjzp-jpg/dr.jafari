import Link from "next/link";
import { input } from "@/components/admin/styles";
import { StatusBadge } from "@/components/admin/ui";
import { search } from "@/lib/booking/service";
import { toEnDigits } from "@/lib/digits";
import { formatPhone } from "@/lib/phone";
import { jalali } from "@/lib/time";

export const metadata = { title: "جستجو" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim() ?? "";
  // Phone searches work with Persian digits too.
  const term = /[0-9۰-۹٠-٩]/.test(q) ? toEnDigits(q).replace(/\D/g, "") : q;
  const results = term ? await search(term) : [];
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">جستجو</h1>
      <form method="get" role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">
          نام یا شماره موبایل
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="نام یا شماره موبایل" className={`${input} grow`} />
        <button type="submit" className="h-11 rounded-pill bg-primary px-5 text-sm text-white">
          جستجو
        </button>
      </form>
      {q && results.length === 0 && <p className="text-sm text-muted">نتیجه‌ای پیدا نشد.</p>}
      <ul className="flex flex-col gap-2">
        {results.map((a) => (
          <li key={a.id}>
            <Link
              href={`/admin/a/${a.id}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-surface p-4 text-ink no-underline hover:border-primary hover:text-ink"
            >
              <span className="font-medium">{a.name}</span>
              <span className="ltr-nums text-sm text-muted-2">{formatPhone(a.phone!)}</span>
              <span className="text-sm">{jalali.slot(new Date(a.start_at))}</span>
              <StatusBadge a={a} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
