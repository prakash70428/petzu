import { describe, expect, it } from "vitest";
import { providers } from "./constants";
import {
  applyTimeToDate,
  buildIcsDataUrl,
  getMonthMatrix,
  getTimeSlotsForDate,
  isDateAvailable,
  isSameDay,
} from "./utils";

describe("availability determinism", () => {
  // This is the property the whole calendar depends on: no Math.random(),
  // so the same date never shows different availability between the
  // server render and the client hydration.
  it("returns the same date availability across repeated calls", () => {
    const date = new Date(2099, 5, 15);
    const first = isDateAvailable(providers[0].id, date);
    for (let i = 0; i < 20; i++) {
      expect(isDateAvailable(providers[0].id, date)).toBe(first);
    }
  });

  it("returns identical slot arrays across repeated calls", () => {
    const date = new Date(2099, 5, 15);
    expect(getTimeSlotsForDate(providers[0].id, date)).toEqual(
      getTimeSlotsForDate(providers[0].id, date),
    );
  });

  it("varies availability between different providers", () => {
    const date = new Date(2099, 5, 15);
    const perProvider = providers.map((p) => getTimeSlotsForDate(p.id, date));
    const signatures = new Set(perProvider.map((slots) => slots.map((s) => s.available).join("")));
    expect(signatures.size).toBeGreaterThan(1);
  });

  it("marks past dates unavailable", () => {
    expect(isDateAvailable(providers[0].id, new Date(2000, 0, 1))).toBe(false);
  });
});

describe("getMonthMatrix", () => {
  it("returns a complete 6x7 grid", () => {
    const weeks = getMonthMatrix(2026, 7);
    expect(weeks).toHaveLength(6);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
  });

  it("starts on a Sunday and runs consecutively", () => {
    const days = getMonthMatrix(2026, 7).flat();
    expect(days[0].getDay()).toBe(0);
    for (let i = 1; i < days.length; i++) {
      const diff = days[i].getTime() - days[i - 1].getTime();
      expect(Math.round(diff / 86400000)).toBe(1);
    }
  });

  it("contains every day of the target month", () => {
    const days = getMonthMatrix(2026, 1).flat(); // February 2026
    const inMonth = days.filter((d) => d.getMonth() === 1);
    expect(inMonth).toHaveLength(28);
  });
});

describe("applyTimeToDate", () => {
  const base = new Date(2026, 7, 12);

  it("parses AM times", () => {
    expect(applyTimeToDate(base, "9:30 AM").getHours()).toBe(9);
    expect(applyTimeToDate(base, "9:30 AM").getMinutes()).toBe(30);
  });

  it("converts PM times to 24-hour", () => {
    expect(applyTimeToDate(base, "4:30 PM").getHours()).toBe(16);
  });

  it("handles the 12 AM / 12 PM edge cases correctly", () => {
    expect(applyTimeToDate(base, "12:00 AM").getHours()).toBe(0);
    expect(applyTimeToDate(base, "12:00 PM").getHours()).toBe(12);
  });

  it("keeps the calendar date intact", () => {
    expect(isSameDay(applyTimeToDate(base, "4:30 PM"), base)).toBe(true);
  });
});

describe("buildIcsDataUrl", () => {
  it("produces a decodable calendar with matching start/end", () => {
    const url = buildIcsDataUrl({
      title: "Wellness exam",
      description: "With Dr. Reyes",
      location: "Sunrise Animal Hospital",
      start: new Date(Date.UTC(2026, 7, 12, 10, 0, 0)),
      durationMinutes: 30,
    });

    expect(url.startsWith("data:text/calendar")).toBe(true);
    const ics = decodeURIComponent(url.split(",")[1]);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("SUMMARY:Wellness exam");
    expect(ics).toContain("DTSTART:20260812T100000Z");
    expect(ics).toContain("DTEND:20260812T103000Z");
  });
});

describe("provider data integrity", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(providers.map((p) => p.id)).size).toBe(providers.length);
    expect(new Set(providers.map((p) => p.slug)).size).toBe(providers.length);
  });

  it("gives every provider at least one bookable service", () => {
    expect(providers.every((p) => p.services.length > 0)).toBe(true);
  });
});
