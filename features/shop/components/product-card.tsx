import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/utils/cn";
import { productIcons } from "../constants";
import type { Product } from "../types";
import { formatPrice } from "../utils";
import { AddToCartButton } from "./add-to-cart-button";
import { QuickViewTrigger } from "./quick-view-dialog";
import { WishlistButton } from "./wishlist-button";

const tileGradients = [
  "from-primary/25 via-primary/10 to-transparent",
  "from-info/25 via-info/10 to-transparent",
  "from-success/25 via-success/10 to-transparent",
  "from-warning/25 via-warning/10 to-transparent",
];

export interface ProductCardProps {
  product: Product;
  /** Rotates the tile gradient so a grid doesn't repeat the same tint every 1 card. */
  index?: number;
}

/**
 * The one reusable card behind every product surface — listing, category,
 * search, related products, and the wishlist page all render this same
 * component. A single full-cover `Link` sits *behind* the interactive
 * controls (wishlist heart, quick view, add-to-cart) via z-index layering,
 * so clicking anywhere on the card navigates except those specific
 * buttons — the standard ecommerce "clickable card with escape-hatch
 * controls" pattern, without nesting `<button>` inside `<a>`.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const Icon = productIcons[product.iconKey];
  const href = `/shop/product/${product.slug}`;

  return (
    <Card interactive className="group relative flex h-full flex-col overflow-hidden p-0">
      <Link href={href} aria-label={product.name} className="absolute inset-0 z-10" />

      <div
        className={cn(
          "relative z-0 flex aspect-square items-center justify-center bg-gradient-to-br",
          tileGradients[index % tileGradients.length],
        )}
      >
        {!product.inStock ? (
          <Badge variant="secondary" className="absolute left-3 top-3 z-20">
            Out of stock
          </Badge>
        ) : (
          product.badge && (
            <Badge variant="primary" className="absolute left-3 top-3 z-20">
              {product.badge}
            </Badge>
          )
        )}

        <div className="absolute right-3 top-3 z-20">
          <WishlistButton productSlug={product.slug} productName={product.name} />
        </div>

        <Icon
          className="size-16 text-foreground/70 transition-transform duration-300 ease-premium group-hover:scale-110"
          strokeWidth={1.25}
          aria-hidden
        />

        <QuickViewTrigger product={product} />
      </div>

      <div className="relative z-0 flex flex-1 flex-col gap-2 p-card">
        <p className="text-caption text-muted-foreground">{product.category}</p>
        <h3 className="line-clamp-2 text-body-sm font-semibold text-foreground">{product.name}</h3>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-heading-4 font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-caption text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-20 px-card pb-card">
        <AddToCartButton
          productSlug={product.slug}
          productName={product.name}
          disabled={!product.inStock}
          size="sm"
          className="w-full"
        >
          {product.inStock ? "Add to cart" : "Out of stock"}
        </AddToCartButton>
      </div>
    </Card>
  );
}
