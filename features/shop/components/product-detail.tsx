"use client";

import { PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { productIcons } from "../constants";
import type { Product } from "../types";
import { formatPrice } from "../utils";
import { BuyOnAmazonButton } from "./buy-on-amazon-button";
import { WishlistButton } from "./wishlist-button";

const trustBadges = [
  { icon: ShieldCheck, label: "Picked by PetZu" },
  { icon: PackageCheck, label: "Delivered by Amazon" },
  { icon: RotateCcw, label: "Amazon returns" },
];

/**
 * One photo per product (see `Product.image`), so a "variant" only changes
 * the tile's tint behind it, not the photo: honest about what it is (a
 * colour choice), not pretending to be a gallery.
 */
export function ProductDetail({ product }: { product: Product }) {
  const Icon = productIcons[product.iconKey];
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.label);

  const activeVariant = product.variants?.find((variant) => variant.label === selectedVariant);
  const showcaseGradient = activeVariant?.swatchClassName ?? "from-primary/20 via-primary/5 to-transparent";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br shadow-sm",
            showcaseGradient,
          )}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.imageAlt ?? product.name}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="object-cover"
            />
          ) : (
            <Icon className="size-32 text-foreground/70" strokeWidth={1} aria-hidden />
          )}
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.label}
                type="button"
                onClick={() => setSelectedVariant(variant.label)}
                aria-pressed={selectedVariant === variant.label}
                aria-label={variant.label}
                title={variant.label}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full bg-gradient-to-br transition-all duration-200 ease-premium",
                  variant.swatchClassName,
                  selectedVariant === variant.label
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "ring-1 ring-border",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-caption text-muted-foreground">{product.category}</p>
          <h1 className="mt-1 text-heading-1 font-semibold text-foreground">{product.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-heading-2 font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-body-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.badge && <Badge variant="primary">{product.badge}</Badge>}
        </div>

        <p className="text-body-sm text-muted-foreground">{product.description}</p>

        {activeVariant && (
          <p className="text-body-sm text-foreground">
            Color: <span className="font-medium">{activeVariant.label}</span>
          </p>
        )}

        <div className="mt-2 flex flex-col gap-2">
          <BuyOnAmazonButton product={product} size="lg" variant="gradient" className="w-full sm:w-auto sm:self-start" />
          <p className="text-caption text-muted-foreground">
            Price shown is a guide. Amazon sets the final price and handles delivery.
          </p>
        </div>

        <WishlistButton productSlug={product.slug} productName={product.name} variant="inline" />

        <div className="mt-4 grid grid-cols-3 gap-3 border-y border-border py-4 text-center">
          {trustBadges.map(({ icon: TrustIcon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <TrustIcon className="size-5 text-primary" aria-hidden />
              <span className="text-caption text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <Accordion type="single" collapsible defaultValue={product.details[0]?.title}>
          {product.details.map((detail) => (
            <AccordionItem key={detail.title} value={detail.title}>
              <AccordionTrigger>{detail.title}</AccordionTrigger>
              <AccordionContent>{detail.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
