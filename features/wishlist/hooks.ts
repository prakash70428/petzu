"use client";

import { useMemo } from "react";
import { products } from "@/features/shop/constants";
import type { Product } from "@/features/shop/types";
import { useWishlistSlugs } from "./store";

export function useWishlist(): { products: Product[]; slugs: string[]; count: number } {
  const slugs = useWishlistSlugs();

  const wishlistedProducts = useMemo(
    () => products.filter((product) => slugs.includes(product.slug)),
    [slugs],
  );

  return { products: wishlistedProducts, slugs, count: slugs.length };
}
