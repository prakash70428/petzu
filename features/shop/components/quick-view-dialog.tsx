"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/utils/cn";
import { productIcons } from "../constants";
import type { Product } from "../types";
import { formatPrice } from "../utils";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";

/**
 * The hover-revealed "Quick view" affordance plus its own Dialog instance.
 * Self-contained (owns its `open` state) so any ProductCard can drop this
 * in without a parent needing to track "which product is being previewed."
 */
export function QuickViewTrigger({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const Icon = productIcons[product.iconKey];

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-background/90 py-2 text-caption font-medium text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 ease-premium group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Eye className="size-3.5" aria-hidden />
        Quick view
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.category}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div
            className={cn(
              "flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent",
            )}
          >
            <Icon className="size-20 text-foreground/70" strokeWidth={1.25} aria-hidden />
          </div>

          <div className="flex flex-col gap-3">
            <Rating value={product.rating} showValue reviewCount={product.reviewCount} />
            <div className="flex items-baseline gap-2">
              <span className="text-heading-3 font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-body-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-body-sm text-muted-foreground">{product.description}</p>

            <div className="mt-auto flex flex-col gap-3 pt-2">
              <AddToCartButton
                productSlug={product.slug}
                productName={product.name}
                disabled={!product.inStock}
                className="w-full"
              >
                {product.inStock ? "Add to cart" : "Out of stock"}
              </AddToCartButton>
              <div className="flex items-center justify-between">
                <WishlistButton productSlug={product.slug} productName={product.name} variant="inline" />
                <Link
                  href={`/shop/product/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-caption font-medium text-primary transition-colors hover:underline"
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
