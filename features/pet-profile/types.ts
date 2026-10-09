/** The animals PetZu personalises for today. Kept deliberately short: the client asked for these four first. */
export type Species = "dogs" | "cats" | "birds" | "fish";

export interface PetProfile {
  id: string;
  name: string;
  species: Species;
  breed: string;
  /** ISO date (YYYY-MM-DD), optional because plenty of rescues have no known birthday. */
  birthday?: string;
}

export interface PetProfileState {
  pets: PetProfile[];
  /** The saved pet the site is currently personalised for, if any. */
  activeId: string | null;
  /** What the hero shows when no saved pet is active (a visitor just browsing "Cats"). */
  browsingSpecies: Species;
  /** True once a first-time visitor has skipped onboarding, so it never nags twice. */
  onboardingDismissed: boolean;
  /** False during SSR and the first client render, before localStorage has been read. */
  hydrated: boolean;
}

export interface NewPetInput {
  name: string;
  species: Species;
  breed: string;
  birthday?: string;
}
