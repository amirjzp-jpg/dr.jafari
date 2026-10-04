import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { ui } from "@/content/i18n/ui";
import type { Locale } from "@/lib/i18n";

/** Header, main area, footer and the phone booking bar, for any language. */
export function SiteShell({ lang = "fa", children }: { lang?: Locale; children: React.ReactNode }) {
  return (
    // `isolate` keeps page backdrops (e.g. the hero gradient at -z-10) above the body background.
    <div className="relative isolate flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-surface focus:px-5 focus:py-2"
      >
        {ui[lang].skip}
      </a>
      <Header lang={lang} />
      <main id="main" className="grow">
        {children}
      </main>
      <Footer lang={lang} />
      <MobileBookingBar lang={lang} />
    </div>
  );
}
