import type { Viewport } from "next";
import "./fonts";
import "./globals.css";
import { TrilingualNotFound } from "@/components/layout/TrilingualNotFound";

// Served for any address no page matches. The site has several root layouts
// (Persian, and one per other language), so there is no single layout to build
// this from, and a visitor can arrive from any of them, so it is in all three.
export const metadata = { title: "404 | صفحه پیدا نشد · لم يتم العثور على الصفحة · Page not found", robots: { index: false } };

export const viewport: Viewport = { themeColor: "#E4EEF6", viewportFit: "cover" };

export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh antialiased">
        <TrilingualNotFound />
      </body>
    </html>
  );
}
