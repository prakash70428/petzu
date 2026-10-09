"use client";

import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { speciesConfig, speciesList } from "../constants";
import { browseSpecies, setActivePet } from "../store";
import type { PetProfile, Species } from "../types";

export interface PetSwitcherProps {
  pets: PetProfile[];
  activeId: string | null;
  browsingSpecies: Species;
  onAddPet: () => void;
}

const chip =
  "glass flex items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-medium text-foreground outline-none transition-colors duration-200 ease-premium hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground";

/**
 * One row that does both jobs: switch between saved pet profiles (for
 * multi-pet homes) and browse an animal in general. Changes the homepage
 * in place instead of navigating away to the shop, which is what the old
 * "Shop for your" links did.
 */
export function PetSwitcher({ pets, activeId, browsingSpecies, onAddPet }: PetSwitcherProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
        {pets.length > 0 ? "Personalised for" : "Show me"}
      </p>
      <div role="group" aria-label="Choose a pet" className="flex flex-wrap items-center gap-2">
        {pets.map((pet) => {
          const Icon = speciesConfig[pet.species].icon;
          return (
            <button
              key={pet.id}
              type="button"
              aria-pressed={pet.id === activeId}
              onClick={() => setActivePet(pet.id)}
              className={chip}
            >
              <Icon className="size-4" aria-hidden />
              {pet.name}
            </button>
          );
        })}

        {pets.length > 0 && <span aria-hidden className="mx-1 h-5 w-px bg-border" />}

        {speciesList.map((species) => {
          const Icon = speciesConfig[species].icon;
          return (
            <button
              key={species}
              type="button"
              aria-pressed={!activeId && species === browsingSpecies}
              onClick={() => browseSpecies(species)}
              className={chip}
            >
              <Icon className="size-4" aria-hidden />
              {speciesConfig[species].label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onAddPet}
          className={cn(chip, "border border-dashed border-primary/50 bg-transparent text-primary")}
        >
          <Plus className="size-4" aria-hidden />
          Add a pet
        </button>
      </div>
    </div>
  );
}
