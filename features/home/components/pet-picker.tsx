import Link from "next/link";
import { petTypeIcons, petTypeLabels } from "@/features/shop/constants";
import type { PetType } from "@/features/shop/types";

const petTypes = Object.keys(petTypeLabels) as PetType[];

/**
 * Lets a first-time visitor jump straight to their pet's shop category from
 * the hero, instead of landing on an undifferentiated homepage and having
 * to find their way to `/shop` themselves. Deep-links into the existing
 * `/shop?pet=` filter (see `app/(shop)/shop/page.tsx`) rather than a
 * separate onboarding flow or global "selected pet" state — the picker is
 * just a shortcut into filtering that already exists.
 */
export function PetPicker() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
        Shop for your
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {petTypes.map((petType) => {
          const Icon = petTypeIcons[petType];
          return (
            <Link
              key={petType}
              href={`/shop?pet=${petType}`}
              className="glass group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-medium text-foreground transition-colors duration-200 ease-premium hover:bg-primary hover:text-primary-foreground"
            >
              <Icon className="size-4 text-primary transition-colors group-hover:text-primary-foreground" aria-hidden />
              {petTypeLabels[petType]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
