import { articles } from "@/content/journal";
import { services } from "@/content/services";
import { abs } from "@/lib/seo";
import { site } from "@/lib/site";

// Summary for AI search tools, built from the same facts as the pages and the
// structured data, so it can never disagree with them. Links are absolute.
export const dynamic = "force-static";

const link = (label: string, path: string, note?: string) => `- [${label}](${abs(path)})${note ? `: ${note}` : ""}`;
const service = (slug: string) => services.find((s) => s.slug === slug)!;

export function GET() {
  const doctor = "دکتر فاطمه جعفری";
  const lines = [
    `# ${site.clinicName}`,
    "",
    `> کلینیک دندانپزشکی زیبایی ${doctor} (دندانپزشک زیبایی، شماره نظام پزشکی ${site.councilNumber}) در شیراز؛ کامپوزیت دندان، لمینت سرامیکی و طراحی لبخند، با بیش از ۱۰ سال تجربه و امکان پرداخت اقساطی برای درمان‌های زیبایی. رزرو آنلاین نوبت معاینه و مشاوره: ${abs("/booking")}`,
    ">",
    "> English: Cosmetic dental clinic of Dr. Fatemeh Jafari (cosmetic dentist, Iran Medical Council no. 169473) in Shiraz, Iran, offering composite bonding, ceramic veneers and smile design, with online booking.",
    "",
    "زبان سایت فارسی است.",
    "",
    "## درباره‌ی پزشک و کلینیک",
    "",
    link(`درباره‌ی ${doctor}`, "/about", `${doctor} (با نام «دکتر ندا جعفری» نیز شناخته می‌شود)، دندانپزشک زیبایی، شماره نظام پزشکی ${site.councilNumber} (169473)، بیش از ۱۰ سال تجربه.`),
    link("نمونه‌کارها", "/gallery", "تصاویر واقعی قبل و بعد از کامپوزیت ونیر، لمینت سرامیکی، طراحی لبخند و بلیچینگ."),
    ...(site.instagram ? [`- اینستاگرام: ${site.instagram} (${site.instagramHandle})`] : []),
    `- نشانی: ${site.address}.`,
    `- تلفن: ‎${site.phone.tel.replace("+98", "+98 ").replace(/(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3")}`,
    `- ساعت کاری: ${site.hours}؛ ${site.closedDays}.`,
    "- پرداخت: امکان پرداخت اقساطی برای درمان‌های زیبایی.",
    "",
    "## خدمات اصلی",
    "",
    ...["composite", "veneers", "smile-design"].map((slug) => link(service(slug).name, service(slug).href)),
    "",
    "## سایر خدمات",
    "",
    link("همه‌ی خدمات", "/services"),
    ...services.filter((s) => !["composite", "veneers", "smile-design"].includes(s.slug)).map((s) => link(s.name, s.href)),
    "",
    "## رزرو نوبت",
    "",
    link("رزرو آنلاین نوبت", "/booking", "نوبت «معاینه و مشاوره» (۳۰ دقیقه) با تأیید پیامکی."),
    link("قوانین رزرو", "/booking-policy"),
    "",
    "## Optional",
    "",
    link("مجله", "/journal", "مقاله‌های آموزشی درباره‌ی کامپوزیت و لمینت."),
    ...articles.map((a) => link(a.title, `/journal/${a.slug}`)),
    link("حریم خصوصی", "/privacy"),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
