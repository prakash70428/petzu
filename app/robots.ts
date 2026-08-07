import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or non-indexable surfaces. `/dashboard` also sets
      // `robots: noindex` in its layout metadata — belt and braces,
      // because robots.txt only asks crawlers not to *crawl*, while the
      // meta tag prevents indexing if a URL is discovered some other way.
      disallow: ["/dashboard/", "/checkout/", "/cart", "/verify", "/forgot-password"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
