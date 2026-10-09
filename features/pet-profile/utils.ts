/**
 * "3 years", "5 months", "Under a month". Returns null for a missing,
 * malformed or future birthday rather than showing a nonsense age.
 */
export function formatPetAge(birthday: string | undefined, today: Date = new Date()): string | null {
  if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return null;
  const [year, month, day] = birthday.split("-").map(Number);
  const born = new Date(year, month - 1, day);
  if (Number.isNaN(born.getTime()) || born > today) return null;

  let months = (today.getFullYear() - born.getFullYear()) * 12 + (today.getMonth() - born.getMonth());
  if (today.getDate() < born.getDate()) months -= 1;

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
