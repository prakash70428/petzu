"use client";

import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/utils/cn";
import { productIcons } from "../constants";
import type { Product } from "../types";
import { formatPrice } from "../utils";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";

const trustBadges = [
  { icon: Truck, label: "Free shipping ₹999+" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: ShieldCheck, label: "Vet-approved" },
];

/**
 * No product photography exists, so a "variant" here changes the showcase
 * tile's gradient tint rather than swapping in a fake alternate photo —
 * honest about what it is (a color choice), not pretending to be a gallery.
 */
export function ProductDetail({ product }: { product: Product }) {
  const Icon = productIcons[product.iconKey];
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.label);
  const [quantity, setQuantity] = useState(1);

  const activeVariant = product.variants?.find((variant) => variant.label === selectedVariant);
  const showcaseGradient = activeVariant?.swatchClassName ?? "from-primary/20 via-primary/5 to-transparent";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br shadow-sm",
            showcaseGradient,
          )}
        >
          <Icon className="size-32 text-foreground/70" strokeWidth={1} aria-hidden />
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

        <Rating value={product.rating} showValue reviewCount={product.reviewCount} size="md" />

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

        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <AddToCartButton
            productSlug={product.slug}
            productName={product.name}
            quantity={quantity}
            selectedVariant={selectedVariant}
            disabled={!product.inStock}
            size="lg"
            className="flex-1"
          >
            {product.inStock ? "Add to cart" : "Out of stock"}
          </AddToCartButton>
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
