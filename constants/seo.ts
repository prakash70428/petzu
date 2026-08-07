import type { Metadata } from "next";
import { siteConfig } from "./site";

/**
 * Base metadata every route inherits. Individual pages/features override
 * only the fields they need via Next's metadata merging — they should
 * never redeclare openGraph/twitter boilerplate from scratch.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // `images` is intentionally omitted from both openGraph and twitter:
  // app/opengraph-image.tsx is a Next file convention, so Next injects the
  // generated image URL (with correct dimensions and a cache-busting hash)
  // automatically. Declaring it manually here would override that with a
  // hardcoded path — which is exactly the bug this replaced.
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.socials.twitter,
    creator: siteConfig.socials.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  // `icons` and `manifest` are likewise handled by app/favicon.ico and
  // app/manifest.ts file conventions.
};

/**
 * Helper for page-level metadata so routes only specify what differs from
 * the base (title/description/path) instead of the full OG/Twitter shape.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const resolvedDescription = description ?? siteConfig.description;

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description: resolvedDescription,
      url,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description: resolvedDescription,
    },
  };
}
