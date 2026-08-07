import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { articles, authors, categories } from "@/features/blog/constants";
import { slugify } from "@/features/blog/utils";
import { providers } from "@/features/services/constants";
import { petTypeLabels, products } from "@/features/shop/constants";
import type { PetType } from "@/features/shop/types";

/**
 * Generated from the same data the pages render from, rather than a
 * hand-maintained URL list. Adding a product or article automatically
 * adds its sitemap entry — a manual list is guaranteed to drift.
 *
 * Private routes (dashboard, checkout, cart, auth) are excluded
 * deliberately; see app/robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
    lastModified: Date = now,
  ) => ({ url: `${siteConfig.url}${path}`, lastModified, changeFrequency, priority });

  const staticRoutes = [
    entry("/", 1.0, "daily"),
    entry("/shop", 0.9, "daily"),
    entry("/services/vet-booking", 0.9),
    entry("/services/grooming", 0.9),
    entry("/blog", 0.8, "daily"),
    entry("/faq", 0.5, "monthly"),
    entry("/sign-in", 0.3, "yearly"),
    entry("/sign-up", 0.4, "yearly"),
  ];

  const shopCategories = (Object.keys(petTypeLabels) as PetType[]).map((petType) =>
    entry(`/shop/${petType}`, 0.8),
  );

  const productRoutes = products.map((product) => entry(`/shop/product/${product.slug}`, 0.7));

  const providerRoutes = providers.map((provider) =>
    entry(`/services/providers/${provider.slug}`, 0.7),
  );

  const articleRoutes = articles.map((article) =>
    entry(`/blog/${article.slug}`, 0.7, "monthly", new Date(article.publishedAt)),
  );

  const blogCategoryRoutes = categories.map((category) =>
    entry(`/blog/category/${slugify(category)}`, 0.6),
  );

  const authorRoutes = authors.map((author) => entry(`/blog/author/${author.slug}`, 0.5, "monthly"));

  return [
    ...staticRoutes,
    ...shopCategories,
    ...productRoutes,
    ...providerRoutes,
    ...articleRoutes,
    ...blogCategoryRoutes,
    ...authorRoutes,
  ];
}
