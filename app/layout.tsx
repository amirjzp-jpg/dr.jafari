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
import Script from "next/script";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "کلینیک دکتر ندا جعفری",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "کلینیک دکتر ندا جعفری",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
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
      <body className="min-h-dvh antialiased">
        {children}
        {/* Self-hosted Umami (cookieless). Loads only when configured. */}
        {process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SRC}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
