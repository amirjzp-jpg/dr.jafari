import type { Metadata } from "next";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose, type Section } from "@/components/content/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "قوانین نوبت‌دهی",
  description: "قوانین رزرو، لغو و تغییر نوبت در کلینیک دکتر ندا جعفری.",
  alternates: { canonical: "/booking-policy" },
};

// Final copy. Notice periods are the clinic's working defaults (docs/decisions.md).
const sections: Section[] = [
  {
    h: "رزرو آنلاین",
    ul: [
      "نوبت‌های آنلاین برای جلسه‌ی معاینه و مشاوره (۳۰ دقیقه) است. جلسه‌های درمان پس از مشاوره با هماهنگی کلینیک تنظیم می‌شوند.",
      "پس از تأیید شماره موبایل، اگر زمان انتخابی آزاد باشد، نوبت بلافاصله ثبت و پیامک تأیید ارسال می‌شود.",
      "هر شماره موبایل در هر زمان می‌تواند یک نوبت آنلاین فعال داشته باشد.",
    ],
  },
  {
    h: "لغو یا تغییر نوبت",
    p: [
      `اگر نمی‌توانید در زمان نوبت حاضر شوید، لطفاً دست‌کم ۲۴ ساعت پیش از آن با شماره‌ی ${site.phone.display} تماس بگیرید تا نوبت برای بیمار دیگری آزاد شود.`,
    ],
  },
  {
    h: "تأخیر",
    p: ["لطفاً چند دقیقه زودتر برسید. اگر بیش از ۱۵ دقیقه تأخیر داشته باشید، ممکن است جلسه کوتاه‌تر شود یا به زمان دیگری منتقل شود تا نوبت بیماران بعدی به هم نریزد."],
  },
  {
    h: "عدم حضور",
    p: ["اگر بدون اطلاع قبلی در زمان نوبت حاضر نشوید، رزرو بعدی شما ممکن است به تأیید تلفنی کلینیک نیاز داشته باشد."],
  },
  {
    h: "تغییر از سوی کلینیک",
    p: ["اگر کلینیک ناچار به تغییر یا لغو نوبت شما شود، از طریق پیامک و در صورت نیاز تماس تلفنی به شما اطلاع داده می‌شود."],
  },
];

export default function BookingPolicyPage() {
  return (
    <>
      <PageHeader title="قوانین نوبت‌دهی" crumbs={[{ name: "قوانین نوبت‌دهی", path: "/booking-policy" }]} />
      <Prose sections={sections} reviewed />
    </>
  );
}
