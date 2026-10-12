import type { Appointment, DoseTime, DueReminder, HealthState, Medicine } from "./types";

/** Clock hour each dose time is due. */
export const DOSE_HOURS: Record<DoseTime, number> = { morning: 8, afternoon: 14, evening: 19, night: 22 };
export const DOSE_LABELS: Record<DoseTime, string> = {
  morning: "Morning (8 am)",
  afternoon: "Afternoon (2 pm)",
  evening: "Evening (7 pm)",
  night: "Night (10 pm)",
};

/** Opening the site a little late still shows the dose reminder, but not hours later. */
const DOSE_WINDOW_HOURS = 3;
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
/** Client point 13: "every 3 weeks there should be a message saying your pet's grooming time is near". */
export const GROOMING_INTERVAL_DAYS = 21;
const AFTER_VISIT_DAYS = 3;

export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isMedicineActive(medicine: Medicine, day: string): boolean {
  return medicine.startDate <= day && (!medicine.endDate || day <= medicine.endDate);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

function dayWord(start: Date, now: Date): string {
  if (isoDate(start) === isoDate(now)) return "Today";
  if (isoDate(start) === isoDate(new Date(now.getTime() + DAY))) return "Tomorrow";
  return start.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
}

/**
 * Every reminder due right now that hasn't been shown yet. Pure (no clock,
 * no storage), so the rules are unit-tested; reminders-runner.tsx calls it
 * once a minute and shows whatever comes back.
 */
export function dueReminders(
  state: Pick<HealthState, "medicines" | "appointments" | "sentReminders">,
  petNames: Record<string, string>,
  now: Date,
): DueReminder[] {
  const sent = new Set(state.sentReminders);
  const due: DueReminder[] = [];
  const push = (reminder: DueReminder) => {
    if (!sent.has(reminder.key)) due.push(reminder);
  };
  const today = isoDate(now);

  for (const medicine of state.medicines) {
    if (!isMedicineActive(medicine, today)) continue;
    const pet = petNames[medicine.petId] ?? "your pet";
    for (const time of medicine.times) {
      const dueAt = new Date(now);
      dueAt.setHours(DOSE_HOURS[time], 0, 0, 0);
      const late = now.getTime() - dueAt.getTime();
      if (late >= 0 && late < DOSE_WINDOW_HOURS * HOUR) {
        push({
          key: `med:${medicine.id}:${today}:${time}`,
          title: `Time for ${pet}'s ${medicine.name}`,
          body: `Don't forget to give ${pet} ${medicine.dose ? `${medicine.dose} of ` : ""}${medicine.name} this ${time}.`,
          href: "/health",
        });
      }
    }
  }

  for (const appointment of state.appointments) {
    const start = new Date(appointment.startsAt);
    const untilStart = start.getTime() - now.getTime();
    const sinceStart = -untilStart;

    if (untilStart > 0 && untilStart <= DAY) {
      push({
        key: `apt-soon:${appointment.id}`,
        title: `${dayWord(start, now)}: ${appointment.petName}'s appointment at ${formatTime(start)}`,
        body: `${appointment.service} with ${appointment.providerName}.${
          appointment.kind === "vet" ? " Add anything you want the vet to know to your appointment notes." : ""
        }`,
        href: "/health",
      });
    }

    if (appointment.kind === "vet" && sinceStart >= HOUR && sinceStart < AFTER_VISIT_DAYS * DAY) {
      push({
        key: `apt-after:${appointment.id}`,
        title: `How did ${appointment.petName}'s vet visit go?`,
        body: "Add the prescription to PetZu so you don't lose it, and find a pharmacy near you for the medicines.",
        href: "/health",
      });
    }
  }

  // Grooming: only the most recent groom per pet counts, so booking the next one stops the nudge.
  const lastGroom = new Map<string, Appointment>();
  for (const appointment of state.appointments) {
    if (appointment.kind !== "groomer" || new Date(appointment.startsAt) > now) continue;
    const key = appointment.petId ?? appointment.petName;
    const previous = lastGroom.get(key);
    if (!previous || previous.startsAt < appointment.startsAt) lastGroom.set(key, appointment);
  }
  const hasUpcomingGroom = (petKey: string) =>
    state.appointments.some(
      (a) => a.kind === "groomer" && (a.petId ?? a.petName) === petKey && new Date(a.startsAt) > now,
    );
  for (const [petKey, appointment] of lastGroom) {
    const daysSince = (now.getTime() - new Date(appointment.startsAt).getTime()) / DAY;
    if (daysSince >= GROOMING_INTERVAL_DAYS && !hasUpcomingGroom(petKey)) {
      push({
        key: `groom:${appointment.id}`,
        title: `${appointment.petName}'s grooming time is near`,
        body: `It's been three weeks since ${appointment.petName}'s last groom with ${appointment.providerName}.`,
        href: "/services/grooming",
      });
    }
  }

  return due;
}

/** Today's doses in time order, for the "Today" list on /health. */
export function todaysDoses(medicines: Medicine[], now: Date) {
  const today = isoDate(now);
  return medicines
    .filter((medicine) => isMedicineActive(medicine, today))
    .flatMap((medicine) => medicine.times.map((time) => ({ medicine, time, hour: DOSE_HOURS[time] })))
    .sort((a, b) => a.hour - b.hour);
}
