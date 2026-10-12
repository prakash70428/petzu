import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { speciesConfig, speciesList } from "@/features/pet-profile/constants";

/**
 * Round photos of the four animals PetZu covers instead of a row of
 * icon-in-a-box cards (client feedback: the rectangular blocks read as AI).
 * No product counts: there was nothing behind the old "3,200+" numbers.
 */
export function Categories() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-display-lg text-foreground">Shop by pet</h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-body-sm font-medium text-primary transition-colors hover:underline"
        >
          See everything
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {speciesList.map((species) => {
          const config = speciesConfig[species];
          return (
            <RevealItem key={species}>
              <Link
                href={`/shop?pet=${config.shopPetType}`}
                className="group flex flex-col items-center gap-4 rounded-full text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="relative aspect-square w-full max-w-44 overflow-hidden rounded-full ring-4 ring-transparent transition-all duration-300 ease-premium group-hover:ring-primary/40">
                  <Image
                    src={config.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 11rem, 40vw"
                    className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                  />
                </span>
                <span className="font-display text-heading-3 text-foreground">{config.label}</span>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
