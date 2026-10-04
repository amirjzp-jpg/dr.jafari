import type { Metadata, Viewport } from "next";
import "../fonts";
import { Analytics } from "@/components/layout/Analytics";
import { defaultDescription, defaultTitle, robotsMeta, siteUrl } from "@/lib/seo";
import "../globals.css";

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
        <Analytics />
      </body>
    </html>
  );
}
