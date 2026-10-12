"use client";

import { ArrowRight, HeartPulse, Users } from "lucide-react";
import Link from "next/link";
import { usePetProfileState } from "@/features/pet-profile/store";
import { lifeStageLabel, lifeStageOf, possessive } from "@/features/pet-profile/utils";
import { services, servicesByLifeStage } from "../constants";

/** Pages that aren't in the services list but can be picked for a stage. */
const extraLinks: Record<string, { title: string; icon: typeof HeartPulse }> = {
  "/health": { title: "Health records & medicines", icon: HeartPulse },
  "/community": { title: "Talk to other pet parents", icon: Users },
};

/**
 * "Right now for Bruno": the services that matter at the active pet's life
 * stage, above the full list. Renders nothing until a saved pet with a
 * known stage is active, so visitors just browsing see the plain list.
 */
export function StagePicks() {
  const profile = usePetProfileState();
  const pet = profile.pets.find((p) => p.id === profile.activeId);
  const stage = pet ? lifeStageOf(pet) : null;
  if (!pet || !stage) return null;

  const { hrefs, why } = servicesByLifeStage[stage];
  const picks = hrefs.map((href) => {
    const service = services.find((s) => s.href === href);
    return service
      ? { href, title: service.title, icon: service.icon }
      : { href, title: extraLinks[href]?.title ?? href, icon: extraLinks[href]?.icon ?? HeartPulse };
  });

  return (
    <div className="mt-12 rounded-3xl bg-gradient-brand p-px">
      <div className="rounded-[calc(1.5rem-1px)] bg-background p-card-lg">
        <p className="text-caption font-semibold uppercase tracking-wide text-primary">
          Right now for {pet.name} · {lifeStageLabel(stage, pet.species)}
        </p>
        <p className="mt-1 text-body text-muted-foreground">{why}</p>
        <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map(({ href, title, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="flex-1">{title}</span>
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-caption text-muted-foreground">
          This changes as {possessive(pet.name)} life stage does. Everything else is below.
        </p>
      </div>
    </div>
  );
}
