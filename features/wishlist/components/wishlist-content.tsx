"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/features/shop/components";
import { useWishlist } from "../hooks";

export function WishlistContent() {
  const { products } = useWishlist();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
        <Heart className="size-10 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">Your wishlist is empty</p>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Tap the heart on any product to save it here.
          </p>
        </div>
        <Button asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
