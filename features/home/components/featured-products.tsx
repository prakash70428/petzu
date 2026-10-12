"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { speciesConfig } from "@/features/pet-profile/constants";
import { usePetProfileState } from "@/features/pet-profile/store";
import { BuyOnAmazonButton, ProductCard } from "@/features/shop/components";
import { products } from "@/features/shop/constants";
import { formatPrice } from "@/utils/currency";
import { featuredProducts } from "../constants";

/**
 * PetZu Picks for the animal the visitor chose (client point 5: show their
 * animal's things only). Dogs get the client's own lifestyle photography;
 * other animals get their picks from the shop catalogue. Prices and buy
 * links come from the shop catalogue, so they always match the product page.
 */
export function FeaturedProducts() {
  const profile = usePetProfileState();
  const activePet = profile.pets.find((pet) => pet.id === profile.activeId);
  const species = activePet?.species ?? profile.browsingSpecies;
  const config = speciesConfig[species];
  const forSpecies = products.filter((p) => p.petType === config.shopPetType).slice(0, 4);

  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">PetZu Picks</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Picked for {activePet ? activePet.name : config.label.toLowerCase()}
          </h2>
          <p className="mt-3 max-w-md text-body-lg text-muted-foreground">
            Things we&apos;d use for our own pets. You buy them on Amazon.
          </p>
        </div>
        <Link
          href={`/shop?pet=${config.shopPetType}`}
          className="inline-flex shrink-0 items-center gap-1 text-body-sm font-medium text-primary transition-colors hover:underline"
        >
          All {config.label.toLowerCase()} picks
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <RevealGroup key={species} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {species === "dogs"
          ? featuredProducts.map((pick) => {
              const product = products.find((p) => p.slug === pick.slug);
              if (!product) return null;
              return (
                <RevealItem key={pick.slug}>
                  <Card interactive className="group relative flex h-full flex-col overflow-hidden p-0">
                    <Link href={`/shop/product/${product.slug}`} aria-label={product.name} className="absolute inset-0 z-10" />
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {product.badge && (
                        <Badge variant="primary" className="absolute left-3 top-3 z-10">
                          {product.badge}
                        </Badge>
                      )}
                      <Image
                        src={pick.image}
                        alt={pick.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                        className="object-cover transition-transform duration-300 ease-premium group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-card">
                      <p className="text-caption text-muted-foreground">{product.category}</p>
                      <h3 className="text-body font-semibold text-foreground">{product.name}</h3>
                      <p className="text-caption text-muted-foreground">Around {formatPrice(product.price)}</p>
                      <div className="relative z-20 mt-auto pt-2">
                        <BuyOnAmazonButton product={product} size="sm" variant="outline" className="w-full" />
                      </div>
                    </div>
                  </Card>
                </RevealItem>
              );
            })
          : forSpecies.map((product, index) => (
              <RevealItem key={product.slug}>
                <ProductCard product={product} index={index} />
              </RevealItem>
            ))}
      </RevealGroup>
    </Section>
  );
}
