import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * Deliberately not including a Content-Security-Policy here: a CSP that
 * isn't tested against every inline style/script the app emits does more
 * harm than good (it silently breaks things in production). That belongs
 * in a dedicated pass with report-only mode first — noted in PHASE-1.md
 * under future work rather than shipped half-configured.
 */
const securityHeaders = [
  // Stop the browser from MIME-sniffing a response into something else.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow framing entirely — this app has no legitimate embed use case,
  // which closes off clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  // Send the origin (not the full path) on cross-origin requests, so
  // internal URLs never leak into third-party referer logs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Explicitly drop powerful APIs the app never uses. Geolocation is
  // allowed for this origin only, for the vet page's "Near me" map.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version in response headers.
  poweredByHeader: false,

  // Trailing-slash-free canonical URLs, matching what sitemap.ts emits.
  trailingSlash: false,

  // Prisma's query engine ships a native binary that webpack can't bundle
  // correctly — this tells Next to require() it at runtime instead of
  // trying to trace/bundle it into the serverless function.
  serverExternalPackages: ["@prisma/client"],

  /**
   * The single biggest bundle win available here.
   *
   * `lucide-react` ships as one barrel file re-exporting ~1500 icon
   * components. Importing 6 icons can pull the whole barrel into the
   * module graph before tree-shaking resolves it, inflating both bundle
   * size and compile time. `optimizePackageImports` rewrites barrel
   * imports into direct per-icon module imports at build time.
   */
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  images: {
    // Modern formats first; the browser picks the best it supports.
    // Product/lifestyle photography is served from /public (see
    // features/home/constants.ts). The one remote source is Unsplash, for
    // the cat/bird/fish hero photos in features/pet-profile/constants.ts
    // until the client supplies their own.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },

  // The standalone pricing page was folded into a note on /services
  // (there are no tiers to compare), so old links land there instead.
  async redirects() {
    return [
      { source: "/pricing", destination: "/services", permanent: true },
      // PetZu runs no delivery service; the old page now points at the shop.
      { source: "/services/delivery", destination: "/shop", permanent: true },
      // Products are bought on Amazon now (client point 6), so there is no
      // cart or checkout. Not permanent, in case PetZu sells directly later.
      { source: "/cart", destination: "/shop", permanent: false },
      { source: "/checkout/:path*", destination: "/shop", permanent: false },
      // Appointments and reminders live in the health records hub now.
      { source: "/dashboard/appointments", destination: "/health", permanent: true },
      { source: "/dashboard/notifications", destination: "/health", permanent: true },
      { source: "/dashboard/orders", destination: "/health", permanent: true },
      // The admin area has its own sign-in now, outside the customer dashboard.
      { source: "/dashboard/admin", destination: "/admin", permanent: true },
      { source: "/dashboard/admin/:path*", destination: "/admin/:path*", permanent: true },
    ];
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
