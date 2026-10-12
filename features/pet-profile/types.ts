/** The animals PetZu personalises for today. Kept deliberately short: the client asked for these four first. */
export type Species = "dogs" | "cats" | "birds" | "fish";

/**
 * Where a pet is in life (client feedback point 15). Worked out from the
 * birthday every time it's read, so it moves on by itself each year;
 * "last-journey" is only ever set by the owner, never guessed.
 */
export type LifeStage = "baby" | "teen" | "adult" | "senior" | "last-journey";

/** Someone else who looks after this pet (client feedback point 5: "add family"). */
export interface FamilyMember {
  name: string;
  email: string;
}

export interface PetProfile {
  id: string;
  name: string;
  species: Species;
  breed: string;
  /** ISO date (YYYY-MM-DD), optional because plenty of rescues have no known birthday. */
  birthday?: string;
  /** True when `birthday` was estimated from a life stage the owner picked. */
  birthdayEstimated?: boolean;
  /** Owner marked the pet as in their last journey; overrides the age-based stage. */
  lastJourney?: boolean;
  family?: FamilyMember[];
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
  birthdayEstimated?: boolean;
  lastJourney?: boolean;
  family?: FamilyMember[];
}
