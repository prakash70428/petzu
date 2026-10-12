"use client";

import type { ReactNode } from "react";
import { usePetProfileState } from "../store";
import type { Species } from "../types";

/** Renders its children only while the site is personalised for `species` (dogs by default, as on the server). */
export function ForSpecies({ species, children }: { species: Species; children: ReactNode }) {
  const profile = usePetProfileState();
  const active = profile.pets.find((pet) => pet.id === profile.activeId)?.species ?? profile.browsingSpecies;
  return active === species ? children : null;
}
