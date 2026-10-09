"use client";

import { useSyncExternalStore } from "react";
import type { NewPetInput, PetProfile, PetProfileState, Species } from "./types";

const STORAGE_KEY = "petzu:pet-profiles";

type PersistedState = Omit<PetProfileState, "hydrated">;

const DEFAULT_STATE: PersistedState = {
  pets: [],
  activeId: null,
  browsingSpecies: "dogs",
  onboardingDismissed: false,
};
const SERVER_STATE: PetProfileState = { ...DEFAULT_STATE, hydrated: false };

/**
 * Same module-store + localStorage pattern as features/auth/store.ts and
 * features/wishlist/store.ts. There's no backend yet, so profiles live on
 * this device only; when accounts become real, this is the one module to
 * swap for an API-backed store.
 */
let state: PetProfileState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") return;
  const persisted: PersistedState = {
    pets: state.pets,
    activeId: state.activeId,
    browsingSpecies: state.browsingSpecies,
    onboardingDismissed: state.onboardingDismissed,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<PersistedState>) : {};
    state = { ...DEFAULT_STATE, ...saved, hydrated: true };
  } catch {
    state = { ...DEFAULT_STATE, hydrated: true };
  }
}

function update(next: Partial<PersistedState>) {
  hydrate();
  state = { ...state, ...next };
  persist();
  emit();
}

function subscribe(listener: () => void) {
  const wasHydrated = hydrated;
  hydrate();
  listeners.add(listener);
  if (!wasHydrated) listener();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

export function addPet(input: NewPetInput): PetProfile {
  hydrate();
  const pet: PetProfile = {
    id: `pet-${Date.now().toString(36)}`,
    name: input.name.trim(),
    species: input.species,
    breed: input.breed,
    ...(input.birthday ? { birthday: input.birthday } : {}),
  };
  update({ pets: [...state.pets, pet], activeId: pet.id, onboardingDismissed: true });
  return pet;
}

export function removePet(id: string) {
  hydrate();
  const pets = state.pets.filter((pet) => pet.id !== id);
  update({ pets, activeId: state.activeId === id ? (pets[0]?.id ?? null) : state.activeId });
}

export function setActivePet(id: string) {
  update({ activeId: id });
}

/** Browsing a species clears the active pet, so "Cats" means cats in general, not your cat. */
export function browseSpecies(species: Species) {
  update({ browsingSpecies: species, activeId: null });
}

export function dismissOnboarding() {
  update({ onboardingDismissed: true });
}

export function usePetProfileState(): PetProfileState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
