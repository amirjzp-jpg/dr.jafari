import { articles } from "@/content/journal";
import { homeFaq } from "@/content/home";
import { homeCopy } from "@/content/i18n/home";
import { serviceContent } from "@/content/i18n/services";
import { services, type Faq } from "@/content/services";
import { intlLocales, isTranslated, languageNames, localePath, type IntlLocale } from "@/lib/i18n";
import { abs } from "@/lib/seo";
import { site } from "@/lib/site";

// Summary for AI search tools, built from the same facts as the pages and the
// structured data, so it can never disagree with them. Links are absolute.
export const dynamic = "force-static";

const link = (label: string, path: string, note?: string) => `- [${label}](${abs(path)})${note ? `: ${note}` : ""}`;
const service = (slug: string) => services.find((s) => s.slug === slug)!;

// Approved questions and answers exactly as the pages show them, so AI answers can quote them.
// Only questions a page also marks up as FAQPage (noSchema ones belong to another page and repeat).
const qa = (faq: Faq[], path: string) =>
  faq.filter((f) => !f.noSchema).flatMap((f) => [`### ${f.q}`, "", `${f.a} (${abs(path)})`, ""]);

const main = ["composite", "veneers", "smile-design"];
const faqHeading: Record<IntlLocale, string> = { ar: "## الأسئلة الشائعة (العربية)", en: "## Frequently asked questions (English)" };

// The same approved questions in Arabic and English, linking to each language's own pages.
// A question asked on more than one page is listed once, with the first page that asks it.
const intlQa = (lang: IntlLocale) => {
  const seen = new Set<string>();
  const once = (faq: Faq[]) => faq.filter((f) => !seen.has(f.q) && seen.add(f.q));
  return [
    faqHeading[lang],
    "",
    ...qa(once(homeCopy[lang].faq), localePath(lang, "/")),
    ...main.flatMap((slug) => {
      const c = serviceContent[lang][slug];
      return c ? qa(once(c.detail?.faq ?? c.faq ?? []), localePath(lang, service(slug).href)) : [];
    }),
  ];
};

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
    link("دندانپزشکی زیبایی در معالی‌آباد شیراز", "/dentist-maaliabad-shiraz", "نشانی، ساعت کاری، خدمات و رزرو آنلاین نوبت."),
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
    ...(isTranslated("/")
      ? [
          "## Other languages",
          "",
          link(languageNames.ar, localePath("ar", "/"), "الصفحة الرئيسية بالعربية"),
          link(languageNames.en, localePath("en", "/"), "Home page in English"),
          link("المجلة", localePath("ar", "/journal"), "مقالات بالعربية عن الكومبوزيت والفينير الخزفي (البورسلين) والتبييض"),
          link("Journal", localePath("en", "/journal"), "Articles in English on composite bonding, ceramic (porcelain) veneers and whitening"),
          "",
        ]
      : []),
    "## پرسش‌های رایج",
    "",
    ...qa(homeFaq, "/"),
    ...main.flatMap((slug) => qa(service(slug).detail?.faq ?? service(slug).faq ?? [], service(slug).href)),
    ...(isTranslated("/") ? intlLocales.flatMap(intlQa) : []),
    "## Optional",
    "",
    link("مجله", "/journal", "مقاله‌های آموزشی درباره‌ی کامپوزیت و لمینت."),
    ...articles.map((a) => link(a.title, `/journal/${a.slug}`)),
    link("حریم خصوصی", "/privacy"),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
