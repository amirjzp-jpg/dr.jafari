import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// Analytics is the only third-party origin the site may talk to, and only when configured.
const umami = (() => {
  try {
    return process.env.NEXT_PUBLIC_UMAMI_SRC ? new URL(process.env.NEXT_PUBLIC_UMAMI_SRC).origin : "";
  } catch {
    return "";
  }
})();

// Next.js streams page data through small inline scripts, so script-src needs
// 'unsafe-inline' unless every page is rendered per request with a nonce (which
// would make the static pages dynamic). Everything else is locked to this origin.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${umami}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${umami}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
]
  .map((d) => d.trim())
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first (roughly 20-30% smaller than WebP), WebP for older browsers.
    formats: ["image/avif", "image/webp"],
    // Optimised copies are reused for 30 days instead of being re-encoded.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Fewer, well-spread widths: fewer variants to encode and cache.
    deviceSizes: [360, 480, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  // Shown on the admin login's settings box, to confirm a redeploy happened.
  env: { BUILD_TIME: new Date().toISOString() },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Photos in /public keep their file names when replaced, so cache for 30 days
      // (not "immutable") and refresh in the background.
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
