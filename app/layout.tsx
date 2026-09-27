import type { Metadata, Viewport } from "next";
// Self-hosted fonts: bundled into /_next/static, so nothing loads from Google.
import "@fontsource/vazirmatn/arabic-300.css";
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/latin-300.css";
import "@fontsource/vazirmatn/latin-400.css";
import "@fontsource/vazirmatn/latin-500.css";
import "@fontsource/noto-naskh-arabic/arabic-500.css";
import "@fontsource/noto-naskh-arabic/arabic-600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "دکتر ندا جعفری | دندانپزشکی زیبایی در شیراز",
    template: "%s | دکتر ندا جعفری",
  },
  description:
    "کامپوزیت، لمینت و طراحی لبخند در شیراز با دکتر ندا جعفری؛ بیش از ۱۰ سال تجربه، کلینیک مجهز و امکان پرداخت اقساطی. رزرو آنلاین نوبت.",
};

export const viewport: Viewport = {
  themeColor: "#E4EEF6",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
