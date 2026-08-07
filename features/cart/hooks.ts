"use client";

import { useMemo } from "react";
import { getProductBySlug } from "@/features/shop/utils";
import type { Product } from "@/features/shop/types";
import { useCartItems, type CartItem } from "./store";

export interface CartLine {
  product: Product;
  quantity: number;
  variant?: string;
  lineTotal: number;
}

/**
 * Joins the raw {productId, quantity} cart store against the static
 * product catalog. Kept separate from the store itself so the store stays
 * product-agnostic — swapping in a real product API later only touches
 * this hook, not the persisted cart data shape.
 */
export function useCart() {
  const rawItems = useCartItems();

  return useMemo(() => {
    const lines: CartLine[] = rawItems.flatMap((item: CartItem) => {
      const product = getProductBySlug(item.productSlug);
      if (!product) return [];
      return [
        {
          product,
          quantity: item.quantity,
          variant: item.variant,
          lineTotal: product.price * item.quantity,
        },
      ];
    });

    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

    return { lines, itemCount, subtotal };
  }, [rawItems]);
}
