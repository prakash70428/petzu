import { ArrowUpRight, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/currency";
import { featuredProducts } from "../constants";

export function FeaturedProducts() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">PetZu Picks</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Loved by pets. Trusted by pet parents.
          </h2>
          <p className="mt-3 max-w-md text-body-lg text-muted-foreground">
            Carefully chosen products for happier, healthier pets.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center gap-1 text-body-sm font-medium text-primary transition-colors hover:underline"
        >
          Explore PetZu Picks
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <RevealItem key={product.name}>
            <Card interactive className="group flex h-full flex-col overflow-hidden p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.badge && (
                  <Badge variant="primary" className="absolute left-3 top-3 z-10">
                    {product.badge}
                  </Badge>
                )}
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-all duration-200 ease-premium group-hover:opacity-100 hover:text-destructive"
                >
                  <Heart className="size-4" />
                </button>
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                  className="object-cover transition-transform duration-300 ease-premium group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-card">
                <p className="text-caption text-muted-foreground">{product.category}</p>
                <h3 className="text-body font-semibold text-foreground">{product.name}</h3>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3.5",
                          i < Math.round(product.rating)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/30",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-caption text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-heading-4 font-semibold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-caption text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Add ${product.name} to cart`}
                    className="transition-transform duration-200 ease-premium hover:border-primary hover:bg-primary hover:text-primary-foreground group-hover:scale-105"
                  >
                    <ShoppingCart className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
