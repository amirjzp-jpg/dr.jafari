import React from "react";
import { ArrowRight, Menu, X } from "lucide-react";

// Landing-page template (dark hero). Adapted for this repo: no Google Fonts import and no global `*` font rule
// (the site self-hosts its fonts and CSP allows same-origin assets only), uniquely named keyframes, local images.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

const NAV_LINKS = [
  { href: "#getting-started", label: "Getting started" },
  { href: "#components", label: "Components" },
  { href: "#documentation", label: "Documentation" },
];

const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">Logo</div>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button type="button" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button type="button" variant="default" size="sm">
              Sign Up
            </Button>
          </div>

          <button
            type="button"
            className="text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="animate-[saasSlideDown_0.3s_ease-out] border-t border-gray-800/50 bg-black/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-2 text-sm text-white/60 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 border-t border-gray-800/50 pt-4">
              <Button type="button" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button type="button" variant="default" size="sm">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = "Navigation";

type HeroProps = {
  /** Same-origin image shown under the headline. */
  previewSrc?: string;
  previewAlt?: string;
};

const Hero = React.memo(({ previewSrc = "/images/gallery/composite-2.webp", previewAlt = "Preview" }: HeroProps) => {
  return (
    <section className="relative flex min-h-screen animate-[saasFadeIn_0.6s_ease-out] flex-col items-center justify-start px-6 py-20 md:py-24">
      <style>{`
        @keyframes saasFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes saasSlideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <aside className="mb-8 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 backdrop-blur-sm">
        <span className="whitespace-nowrap text-center text-xs text-gray-400">New version of template is out!</span>
        <a
          href="#new-version"
          className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-400 transition-all hover:text-white active:scale-95"
          aria-label="Read more about the new version"
        >
          Read more
          <ArrowRight size={12} />
        </a>
      </aside>

      <h1
        className="mb-6 max-w-3xl px-6 text-center text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em",
        }}
      >
        Give your big idea <br />
        the website it deserves
      </h1>

      <p className="mb-10 max-w-2xl px-6 text-center text-sm text-gray-400 md:text-base">
        Landing page kit template with React, Shadcn/ui and Tailwind <br />
        that you can copy/paste into your project.
      </p>

      <div className="relative z-10 mb-16 flex items-center gap-4">
        <Button type="button" variant="gradient" size="lg" className="rounded-lg" aria-label="Get started with the template">
          Get started
        </Button>
      </div>

      <div className="relative w-full max-w-5xl pb-20">
        {/* Soft glow behind the preview (CSS only, replaces the remote decorative image). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-18%] z-0 h-[60%] w-[90%] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(ellipse at center, rgba(120,140,255,0.45), rgba(0,0,0,0) 70%)" }}
        />
        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt={previewAlt} className="h-auto w-full rounded-lg shadow-2xl" loading="eager" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default function Component(props: HeroProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero {...props} />
    </main>
  );
}
