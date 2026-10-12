"use client";

import { useSyncExternalStore } from "react";
import type { Appointment, HealthRecord, HealthState, Medicine } from "./types";

const STORAGE_KEY = "petzu:health";
/** Keep the "already reminded" list from growing forever. */
const MAX_SENT_KEYS = 500;

const EMPTY: HealthState = { medicines: [], records: [], appointments: [], sentReminders: [] };

/**
 * Same module-store + localStorage pattern as features/pet-profile/store.ts.
 * Health records stay on this device on purpose: until real accounts exist
 * (see PHASE-3-PET-HEALTH-AND-REMINDERS.md), keeping them in the browser is
 * the only way to store them without anyone else being able to read them.
 */
let state: HealthState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<HealthState>) } : EMPTY;
  } catch {
    state = EMPTY;
  }
}

function update(next: Partial<HealthState>) {
  hydrate();
  state = { ...state, ...next };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the change still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  const wasHydrated = hydrated;
  hydrate();
  listeners.add(listener);
  if (!wasHydrated) listener();
  return () => listeners.delete(listener);
}

export function useHealthState(): HealthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
}

export function getHealthState(): HealthState {
  hydrate();
  return state;
}

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function addMedicine(input: Omit<Medicine, "id">): Medicine {
  const medicine = { ...input, id: newId("med") };
  update({ medicines: [...getHealthState().medicines, medicine] });
  return medicine;
}

export function removeMedicine(id: string) {
  update({ medicines: getHealthState().medicines.filter((m) => m.id !== id) });
}

export function addRecord(input: Omit<HealthRecord, "id">): HealthRecord {
  const record = { ...input, id: newId("rec") };
  update({ records: [record, ...getHealthState().records] });
  return record;
}

export function removeRecord(id: string) {
  update({ records: getHealthState().records.filter((r) => r.id !== id) });
}

export function addAppointment(input: Omit<Appointment, "id">): Appointment {
  const appointment = { ...input, id: newId("apt") };
  update({ appointments: [...getHealthState().appointments, appointment] });
  return appointment;
}

export function updateAppointment(id: string, changes: Partial<Omit<Appointment, "id">>) {
  update({ appointments: getHealthState().appointments.map((a) => (a.id === id ? { ...a, ...changes } : a)) });
}

export function removeAppointment(id: string) {
  update({ appointments: getHealthState().appointments.filter((a) => a.id !== id) });
}

export function markRemindersSent(keys: string[]) {
  if (keys.length === 0) return;
  const sent = [...getHealthState().sentReminders, ...keys];
  update({ sentReminders: sent.slice(-MAX_SENT_KEYS) });
}
