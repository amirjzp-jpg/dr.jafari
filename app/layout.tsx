import type { Metadata, Viewport } from "next";
// Self-hosted fonts: bundled into /_next/static, so nothing loads from Google.
// Only the weights the design uses; a weight's file downloads only when text needs it.
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/arabic-600.css";
import "@fontsource/vazirmatn/latin-400.css";
import "@fontsource/vazirmatn/latin-500.css";
import "@fontsource/vazirmatn/latin-600.css";
import "@fontsource/noto-naskh-arabic/arabic-500.css";
import "@fontsource/noto-naskh-arabic/arabic-600.css";
import Script from "next/script";
import { defaultDescription, defaultTitle, robotsMeta, siteUrl } from "@/lib/seo";
import "./globals.css";

// Root metadata is inherited by every page that does not override a key, so it
// deliberately sets no alternates.canonical or openGraph.url: those would point
// every page at "/". Each public page sets its own canonical (the home page sets "/").
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "کلینیک دکتر فاطمه جعفری",
  title: {
    default: defaultTitle,
    template: "%s | دکتر فاطمه جعفری",
  },
  description: defaultDescription,
  authors: [{ name: "دکتر فاطمه جعفری", url: "/about" }],
  creator: "دکتر فاطمه جعفری",
  publisher: "کلینیک دکتر فاطمه جعفری",
  category: "health",
  robots: robotsMeta,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "کلینیک دکتر فاطمه جعفری",
    title: defaultTitle,
    description: defaultDescription,
    // app/opengraph-image.jpg (file convention) takes precedence and supplies the URL;
    // this entry documents size and alt for segments where it does not apply.
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز",
      },
    ],
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
  formatDetection: { telephone: false },
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
