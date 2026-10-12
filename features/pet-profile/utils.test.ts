import { describe, expect, it } from "vitest";
import { speciesConfig, speciesList } from "./constants";
import { estimatedBirthday, formatPetAge, lifeStageLabel, lifeStageOf, possessive, todayIso } from "./utils";

const today = new Date(2026, 9, 9); // 9 Oct 2026

describe("formatPetAge", () => {
  it("returns null for missing, malformed or future birthdays", () => {
    expect(formatPetAge(undefined, today)).toBeNull();
    expect(formatPetAge("", today)).toBeNull();
    expect(formatPetAge("09/10/2020", today)).toBeNull();
    expect(formatPetAge("2027-01-01", today)).toBeNull();
  });

  it("handles pets younger than a month", () => {
    expect(formatPetAge("2026-09-20", today)).toBe("Under a month");
    expect(formatPetAge("2026-10-09", today)).toBe("Under a month");
  });

  it("counts whole months, not partial ones", () => {
    expect(formatPetAge("2026-09-09", today)).toBe("1 month");
    expect(formatPetAge("2026-05-10", today)).toBe("4 months");
    expect(formatPetAge("2026-05-09", today)).toBe("5 months");
  });

  it("switches to years from twelve months", () => {
    expect(formatPetAge("2025-10-09", today)).toBe("1 year");
    expect(formatPetAge("2023-10-10", today)).toBe("2 years");
    expect(formatPetAge("2023-10-09", today)).toBe("3 years");
  });
});

describe("possessive", () => {
  it("always adds 's", () => {
    expect(possessive("Bruno")).toBe("Bruno's");
    expect(possessive("Max")).toBe("Max's");
  });
});

describe("todayIso", () => {
  it("zero-pads month and day", () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("speciesConfig", () => {
  it("covers the four animals the client asked for, each with breeds and a photo", () => {
    expect(speciesList).toEqual(["dogs", "cats", "birds", "fish"]);
    for (const species of speciesList) {
      expect(speciesConfig[species].breeds.length).toBeGreaterThan(0);
      expect(speciesConfig[species].image).toBeTruthy();
    }
  });
});

describe("lifeStageOf", () => {
  it("works the stage out from the birthday, per animal", () => {
    expect(lifeStageOf({ species: "dogs", birthday: "2026-07-01" }, today)).toBe("baby");
    expect(lifeStageOf({ species: "dogs", birthday: "2025-10-01" }, today)).toBe("teen");
    expect(lifeStageOf({ species: "dogs", birthday: "2021-10-01" }, today)).toBe("adult");
    expect(lifeStageOf({ species: "dogs", birthday: "2016-10-01" }, today)).toBe("senior");
    // Cats stay middle-aged longer than dogs.
    expect(lifeStageOf({ species: "cats", birthday: "2017-10-01" }, today)).toBe("adult");
  });

  it("moves on by itself as the years pass", () => {
    const pet = { species: "dogs" as const, birthday: "2026-01-01" };
    expect(lifeStageOf(pet, today)).toBe("teen");
    expect(lifeStageOf(pet, new Date(2028, 6, 1))).toBe("adult");
  });

  it("only reports the last journey when the owner set it, and nothing without a birthday", () => {
    expect(lifeStageOf({ species: "cats", lastJourney: true }, today)).toBe("last-journey");
    expect(lifeStageOf({ species: "cats" }, today)).toBeNull();
  });
});

describe("estimatedBirthday", () => {
  it("lands inside the stage the owner picked", () => {
    for (const species of speciesList) {
      for (const stage of ["baby", "teen", "adult", "senior"] as const) {
        expect(lifeStageOf({ species, birthday: estimatedBirthday(species, stage, today) }, today)).toBe(stage);
      }
    }
  });
});

describe("lifeStageLabel", () => {
  it("uses the animal's own word for babies", () => {
    expect(lifeStageLabel("baby", "dogs")).toBe("Puppy");
    expect(lifeStageLabel("baby", "cats")).toBe("Kitten");
    expect(lifeStageLabel("adult", "fish")).toBe("Middle age");
  });
});
