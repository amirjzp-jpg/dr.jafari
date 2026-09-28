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
  // Shown on the admin login's settings box, to confirm a redeploy happened.
  env: { BUILD_TIME: new Date().toISOString() },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
