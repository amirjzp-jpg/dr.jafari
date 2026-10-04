import Script from "next/script";

/** Self-hosted Umami (cookieless). Loads only when configured. */
export function Analytics() {
  if (!process.env.NEXT_PUBLIC_UMAMI_SRC || !process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null;
  return (
    <Script
      src={process.env.NEXT_PUBLIC_UMAMI_SRC}
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
