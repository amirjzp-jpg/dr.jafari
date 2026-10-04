import type { Viewport } from "next";
import "./fonts";
import "./globals.css";
import { NotFoundView } from "@/components/layout/NotFoundView";

// Served for any address no page matches. The site has several root layouts
// (Persian, and one per other language), so there is no single layout to build
// this from; it is Persian, the site's default language.
export const metadata = { title: "صفحه پیدا نشد", robots: { index: false } };

export const viewport: Viewport = { themeColor: "#E4EEF6", viewportFit: "cover" };

export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh antialiased">
        <NotFoundView />
      </body>
    </html>
  );
}
