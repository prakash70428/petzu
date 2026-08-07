"use client";

import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { toggleWishlist, useWishlistSlugs } from "@/features/wishlist/store";

export interface WishlistButtonProps {
  productSlug: string;
  productName: string;
  className?: string;
  /** `floating` sits over a product image (hidden until hover); `inline` renders as a labeled row. */
  variant?: "floating" | "inline";
}

export function WishlistButton({
  productSlug,
  productName,
  className,
  variant = "floating",
}: WishlistButtonProps) {
  const slugs = useWishlistSlugs();
  const isWishlisted = slugs.includes(productSlug);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(productSlug);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: productName,
      variant: isWishlisted ? "default" : "success",
      duration: 2500,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isWishlisted}
      aria-label={
        isWishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`
      }
      className={cn(
        variant === "floating"
          ? cn(
              "flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-all duration-200 ease-premium hover:text-destructive",
              isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )
          : "flex items-center gap-2 text-body-sm text-muted-foreground transition-colors hover:text-destructive",
        isWishlisted && "text-destructive",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-200 ease-premium", isWishlisted && "scale-110 fill-destructive")}
      />
      {variant === "inline" && (isWishlisted ? "Wishlisted" : "Add to wishlist")}
    </button>
  );
}
