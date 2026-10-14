export type DoseTime = "morning" | "afternoon" | "evening" | "night";

/** A medicine the pet is on, with the times of day it's due (client point 13: "morning, evening"). */
export interface Medicine {
  id: string;
  petId: string;
  name: string;
  /** Free text: "1 tablet", "5 ml". */
  dose: string;
  times: DoseTime[];
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD, inclusive. Missing = ongoing. */
  endDate?: string;
}

export type RecordKind = "pre-visit" | "vaccination" | "prescription" | "lab" | "scan" | "other";

/**
 * Anything the owner wants to keep: notes for the vet before a visit,
 * prescriptions after it, blood work, scans. A file, if attached, lives in
 * IndexedDB under `fileId` (see files.ts); only its name and type are here.
 */
export interface HealthRecord {
  id: string;
  petId: string;
  kind: RecordKind;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  note: string;
  fileId?: string;
  fileName?: string;
  fileType?: string;
}

export type AppointmentKind = "vet" | "groomer" | "trainer" | "sitter" | "other";

export interface Appointment {
  id: string;
  /** Pet profile id, when the pet is saved on this device. */
  petId?: string;
  petName: string;
  kind: AppointmentKind;
  providerName: string;
  service: string;
  /** ISO date-time the appointment starts. */
  startsAt: string;
  /** "Appointment notes" the owner wants the vet to know (client point 13). */
  notes: string;
  reference?: string;
}

/** One weigh-in (proposal: "weight tracker"). */
export interface WeightEntry {
  id: string;
  petId: string;
  /** YYYY-MM-DD */
  date: string;
  kg: number;
}

export interface HealthState {
  medicines: Medicine[];
  records: HealthRecord[];
  appointments: Appointment[];
  weights: WeightEntry[];
  /** Reminder keys already shown, so each fires once. */
  sentReminders: string[];
}

export interface DueReminder {
  key: string;
  title: string;
  body: string;
  href: string;
}
