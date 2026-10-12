import type { LifeStage, PetProfile, Species } from "./types";

/** Whole months between a YYYY-MM-DD birthday and today, or null if unusable. */
export function ageInMonths(birthday: string | undefined, today: Date = new Date()): number | null {
  if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return null;
  const [year, month, day] = birthday.split("-").map(Number);
  const born = new Date(year, month - 1, day);
  if (Number.isNaN(born.getTime()) || born > today) return null;
  let months = (today.getFullYear() - born.getFullYear()) * 12 + (today.getMonth() - born.getMonth());
  if (today.getDate() < born.getDate()) months -= 1;
  return Math.max(months, 0);
}

/**
 * Month boundaries where each animal becomes a teenager, middle-aged and
 * senior. Rough, deliberately: they only decide what the site shows first.
 */
const STAGE_BOUNDARIES: Record<Species, [teen: number, adult: number, senior: number]> = {
  dogs: [6, 24, 84],
  cats: [6, 24, 120],
  birds: [6, 24, 96],
  fish: [3, 12, 48],
};

/** The life stage for a birthday, or null when the birthday isn't known. */
export function lifeStageFromAge(species: Species, months: number | null): Exclude<LifeStage, "last-journey"> | null {
  if (months === null) return null;
  const [teen, adult, senior] = STAGE_BOUNDARIES[species];
  if (months < teen) return "baby";
  if (months < adult) return "teen";
  if (months < senior) return "adult";
  return "senior";
}

export function lifeStageOf(pet: Pick<PetProfile, "species" | "birthday" | "lastJourney">, today: Date = new Date()): LifeStage | null {
  if (pet.lastJourney) return "last-journey";
  return lifeStageFromAge(pet.species, ageInMonths(pet.birthday, today));
}

const BABY_LABEL: Record<Species, string> = { dogs: "Puppy", cats: "Kitten", birds: "Chick", fish: "Young fish" };

export function lifeStageLabel(stage: LifeStage, species: Species): string {
  switch (stage) {
    case "baby":
      return BABY_LABEL[species];
    case "teen":
      return "Teenager";
    case "adult":
      return "Middle age";
    case "senior":
      return "Senior";
    case "last-journey":
      return "Last journey";
  }
}

/**
 * When the owner doesn't know the birthday but picks a stage, estimate one
 * from the middle of that stage. The stage then keeps moving on with time
 * instead of being frozen at the day they signed up.
 */
export function estimatedBirthday(species: Species, stage: Exclude<LifeStage, "last-journey">, today: Date = new Date()): string {
  const [teen, adult, senior] = STAGE_BOUNDARIES[species];
  const midMonths = { baby: teen / 2, teen: (teen + adult) / 2, adult: (adult + senior) / 2, senior: senior + 12 }[stage];
  const born = new Date(today.getFullYear(), today.getMonth() - Math.round(midMonths), 1);
  return todayIso(born);
}

/**
 * "3 years", "5 months", "Under a month". Returns null for a missing,
 * malformed or future birthday rather than showing a nonsense age.
 */
export function formatPetAge(birthday: string | undefined, today: Date = new Date()): string | null {
  const months = ageInMonths(birthday, today);
  if (months === null) return null;

  if (months < 1) return "Under a month";
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

/** Possessive for headlines: "Bruno's". Always 's, even after an s ("Max's", "Jess's"). */
export function possessive(name: string): string {
  return `${name}'s`;
}

/** Today's date as YYYY-MM-DD in local time, for a date input's `max`. */
export function todayIso(today: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
}
