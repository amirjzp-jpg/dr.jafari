import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { site } from "@/lib/site";
import { loadBooking } from "./actions";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = {
  title: "رزرو نوبت",
  description: "رزرو آنلاین نوبت معاینه و مشاوره در کلینیک دکتر ندا جعفری، شیراز.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage() {
  await connection(); // always per-request: holds and availability are live
  let data: Awaited<ReturnType<typeof loadBooking>> | null = null;
  try {
    data = await loadBooking();
  } catch (err) {
    console.error("[booking] unavailable", err);
  }

  if (!data) return <BookingUnavailable />;
  return (
    <BookingFlow
      initialDays={data.days}
      initialHold={data.hold}
      initialVerified={data.verifiedMasked}
      serverNow={data.serverNow}
    />
  );
}

/** Shown if the database can't be reached, so patients can still call. */
function BookingUnavailable() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-5 px-5 text-center">
      <h1 className="font-display text-[26px] font-semibold">رزرو آنلاین در دسترس نیست</h1>
      <p className="text-[15px] leading-[1.9] text-muted">
        لطفاً برای رزرو نوبت با کلینیک تماس بگیرید. {site.hours}.
      </p>
      <p className="flex justify-center gap-2 text-lg">
        {site.phones.map((p, i) => (
          <span key={p.tel}>
            {i > 0 && "· "}
            <a href={`tel:${p.tel}`} className="ltr-nums text-ink no-underline">
              {p.display}
            </a>
          </span>
        ))}
      </p>
      <Link href="/" className="text-primary">
        بازگشت به صفحه‌ی اصلی
      </Link>
    </main>
  );
}
