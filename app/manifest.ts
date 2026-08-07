import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

/**
 * `app/manifest.ts`, not a static `public/site.webmanifest`.
 *
 * The old metadata pointed at `/site.webmanifest`, which was never
 * created — a guaranteed 404 on every page load in production. Using the
 * file convention means Next serves it, and the name/colours stay tied to
 * `siteConfig` instead of being duplicated in a JSON file nobody updates.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e8823a",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
