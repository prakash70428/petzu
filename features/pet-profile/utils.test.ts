import { describe, expect, it } from "vitest";
import { speciesConfig, speciesList } from "./constants";
import { formatPetAge, possessive, todayIso } from "./utils";

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
