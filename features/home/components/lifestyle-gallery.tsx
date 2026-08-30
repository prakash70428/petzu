import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { lifestyleGallery } from "../constants";

/**
 * A short editorial band of real product-in-use photography, sitting between
 * the value-prop sections and the testimonials. Real homes, real pets — the
 * counterpoint to the icon-and-gradient treatment everywhere else.
 */
export function LifestyleGallery() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline">In real homes</Badge>
        <h2 className="mt-4 font-display text-display-lg text-foreground">
          Made for the way you actually live with your pet
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          Not staged pack shots — the products PetZu stocks, in the homes and
          hands of the pet parents who use them.
        </p>
      </div>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lifestyleGallery.map((item) => (
          <RevealItem key={item.image}>
            <Link
              href={item.href}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                aria-hidden
              />
              <span className="absolute bottom-4 left-4 right-4 text-body-sm font-semibold text-white">
                {item.caption}
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
