"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { speciesConfig } from "@/features/pet-profile/constants";
import { usePetProfileState } from "@/features/pet-profile/store";
import { ProductCard } from "@/features/shop/components";
import { products } from "@/features/shop/constants";

/**
 * PetZu Picks for the animal the visitor chose (client point 5: show their
 * animal's things only), straight from the shop catalogue so photos, prices
 * and buy links always match the product page.
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
        {forSpecies.map((product, index) => (
          <RevealItem key={product.slug}>
            <ProductCard product={product} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
