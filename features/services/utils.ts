import { providers } from "./constants";
import type { FilterState, Provider, ProviderType, SortOption, TimeSlot } from "./types";

// ---------------------------------------------------------------------------
// Provider lookup & filtering
// ---------------------------------------------------------------------------

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find((provider) => provider.slug === slug);
}

export function getProvidersByType(type: ProviderType): Provider[] {
  return providers.filter((provider) => provider.type === type);
}

export function filterProviders(items: Provider[], filters: FilterState, query?: string): Provider[] {
  const normalizedQuery = query?.trim().toLowerCase();

  return items.filter((provider) => {
    if (filters.specialties.length > 0) {
      const hasSpecialty = filters.specialties.some((specialty) => provider.specialties.includes(specialty));
      if (!hasSpecialty) return false;
    }
    if (filters.minRating !== null && provider.rating < filters.minRating) return false;
    if (filters.availableOnly && !provider.acceptsNewPatients) return false;
    if (normalizedQuery) {
      const haystack = `${provider.name} ${provider.clinicName} ${provider.specialties.join(" ")}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });
}

export function sortProviders(items: Provider[], sort: SortOption): Provider[] {
  const sorted = [...items];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "distance":
      return sorted.sort((a, b) => a.location.distanceMiles - b.location.distanceMiles);
    case "price-asc":
      return sorted.sort((a, b) => minPrice(a) - minPrice(b));
    case "recommended":
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

function minPrice(provider: Provider): number {
  return Math.min(...provider.services.map((service) => service.price));
}

/** Re-exported from shared `utils/currency` so existing call sites keep working. */
export { formatPrice } from "@/utils/currency";

// ---------------------------------------------------------------------------
// Deterministic "availability" — no backend, so instead of Math.random()
// (different every render, and would mismatch between server and client)
// a tiny string hash seeds a stable pseudo-random value per
// provider/date/slot. Same inputs always produce the same output.
// ---------------------------------------------------------------------------

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** A stable 0..1 value for a given seed — used to place map placeholder pins deterministically. */
export function pseudoRandom(seed: string): number {
  return (hashString(seed) % 1000) / 1000;
}

export function isDateAvailable(providerId: string, date: Date): boolean {
  if (isPastDate(date)) return false;
  return hashString(`${providerId}-${dateKey(date)}`) % 5 !== 0;
}

const SLOT_TIMES = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

export function getTimeSlotsForDate(providerId: string, date: Date): TimeSlot[] {
  return SLOT_TIMES.map((time) => ({
    time,
    available: hashString(`${providerId}-${dateKey(date)}-${time}`) % 3 !== 0,
  }));
}

// ---------------------------------------------------------------------------
// Calendar month-grid math (no date library — this is the only date
// manipulation the app needs, so pulling in a dependency for it isn't
// worth it).
// ---------------------------------------------------------------------------

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

/** Returns a 6x7 grid of dates for the given month, padded with adjacent-month days so every week is complete. */
export function getMonthMatrix(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks: Date[][] = [];
  let cursor = gridStart;
  for (let week = 0; week < 6; week++) {
    const days: Date[] = [];
    for (let day = 0; day < 7; day++) {
      days.push(cursor);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    weeks.push(days);
  }
  return weeks;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Booking reference + calendar export — both genuinely computed client-side,
// not faked. The .ics file is a real, openable calendar attachment; there's
// just no backend persisting the booking anywhere.
// ---------------------------------------------------------------------------

/** Combines a calendar date with a "9:00 AM"-style slot label into one Date. */
export function applyTimeToDate(date: Date, time: string): Date {
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return date;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function generateBookingReference(): string {
  return `PZ-${Math.floor(100000 + Math.random() * 900000)}`;
}

export interface IcsInput {
  title: string;
  description: string;
  location: string;
  start: Date;
  durationMinutes: number;
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildIcsDataUrl(input: IcsInput): string {
  const end = new Date(input.start.getTime() + input.durationMinutes * 60000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The PetZu World//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@thepetzu.world`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(input.start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${input.title}`,
    `DESCRIPTION:${input.description}`,
    `LOCATION:${input.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const content = lines.join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}
