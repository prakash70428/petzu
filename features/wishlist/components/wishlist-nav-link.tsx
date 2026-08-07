"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWishlistSlugs } from "../store";

export function WishlistNavLink() {
  const slugs = useWishlistSlugs();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={slugs.length > 0 ? `Wishlist, ${slugs.length} items` : "Wishlist"}
      asChild
    >
      <Link href="/wishlist">
        <Heart className="size-5" />
        {slugs.length > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {slugs.length > 9 ? "9+" : slugs.length}
          </span>
        )}
      </Link>
    </Button>
  );
}
