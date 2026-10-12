import { describe, expect, it } from "vitest";
import type { Appointment, Medicine } from "./types";
import { dueReminders, todaysDoses } from "./utils";

const pets = { "pet-1": "Bruno" };
const at = (iso: string) => new Date(iso);

const medicine: Medicine = {
  id: "med-1",
  petId: "pet-1",
  name: "Apoquel",
  dose: "1 tablet",
  times: ["morning", "evening"],
  startDate: "2026-10-01",
  endDate: "2026-10-20",
};

const appointment = (overrides: Partial<Appointment>): Appointment => ({
  id: "apt-1",
  petId: "pet-1",
  petName: "Bruno",
  kind: "vet",
  providerName: "Dr. Meera Rao",
  service: "Wellness exam",
  startsAt: "2026-10-14T16:30:00",
  notes: "",
  ...overrides,
});

const empty = { medicines: [], appointments: [], sentReminders: [] };

describe("dueReminders: medicines", () => {
  it("reminds at the dose time, by the pet's name", () => {
    const [reminder] = dueReminders({ ...empty, medicines: [medicine] }, pets, at("2026-10-13T08:05:00"));
    expect(reminder.key).toBe("med:med-1:2026-10-13:morning");
    expect(reminder.body).toBe("Don't forget to give Bruno 1 tablet of Apoquel this morning.");
  });

  it("stays quiet before the dose and a few hours after it", () => {
    expect(dueReminders({ ...empty, medicines: [medicine] }, pets, at("2026-10-13T07:59:00"))).toEqual([]);
    expect(dueReminders({ ...empty, medicines: [medicine] }, pets, at("2026-10-13T11:30:00"))).toEqual([]);
  });

  it("doesn't remind outside the course dates or twice", () => {
    expect(dueReminders({ ...empty, medicines: [medicine] }, pets, at("2026-10-21T08:05:00"))).toEqual([]);
    const sentReminders = ["med:med-1:2026-10-13:morning"];
    expect(dueReminders({ ...empty, medicines: [medicine], sentReminders }, pets, at("2026-10-13T08:05:00"))).toEqual([]);
  });
});

describe("dueReminders: appointments", () => {
  it("gives a day-ahead reminder with the time and doctor", () => {
    const [reminder] = dueReminders({ ...empty, appointments: [appointment({})] }, pets, at("2026-10-13T18:00:00"));
    expect(reminder.title).toBe("Tomorrow: Bruno's appointment at 4:30 pm");
    expect(reminder.body).toContain("Dr. Meera Rao");
  });

  it("asks for the prescription after a vet visit, not after a groom", () => {
    const after = at("2026-10-14T19:00:00");
    const [vet] = dueReminders({ ...empty, appointments: [appointment({})] }, pets, after);
    expect(vet.key).toBe("apt-after:apt-1");
    expect(dueReminders({ ...empty, appointments: [appointment({ kind: "groomer" })] }, pets, after)).toEqual([]);
  });

  it("nudges for grooming three weeks after the last groom, unless the next one is booked", () => {
    const groom = appointment({ id: "g-1", kind: "groomer", startsAt: "2026-09-20T10:00:00" });
    const [nudge] = dueReminders({ ...empty, appointments: [groom] }, pets, at("2026-10-12T10:00:00"));
    expect(nudge.title).toBe("Bruno's grooming time is near");
    expect(dueReminders({ ...empty, appointments: [groom] }, pets, at("2026-10-05T10:00:00"))).toEqual([]);

    const next = appointment({ id: "g-2", kind: "groomer", startsAt: "2026-10-20T10:00:00" });
    expect(dueReminders({ ...empty, appointments: [groom, next] }, pets, at("2026-10-12T10:00:00"))).toEqual([]);
  });
});

describe("todaysDoses", () => {
  it("lists active doses in time order", () => {
    const night: Medicine = { ...medicine, id: "med-2", name: "Fish oil", times: ["night"] };
    const doses = todaysDoses([night, medicine], at("2026-10-13T09:00:00"));
    expect(doses.map((d) => `${d.medicine.name}:${d.time}`)).toEqual([
      "Apoquel:morning",
      "Apoquel:evening",
      "Fish oil:night",
    ]);
  });
});
