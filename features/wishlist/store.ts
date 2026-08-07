"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "petzu:wishlist";
const EMPTY_SLUGS: string[] = [];

let slugs: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) slugs = JSON.parse(raw) as string[];
  } catch {
    slugs = [];
  }
}

function subscribe(listener: () => void) {
  const wasHydrated = hydrated;
  hydrate();
  listeners.add(listener);
  if (!wasHydrated) listener();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return slugs;
}

function getServerSnapshot(): string[] {
  return EMPTY_SLUGS;
}

export function toggleWishlist(productSlug: string) {
  hydrate();
  slugs = slugs.includes(productSlug)
    ? slugs.filter((slug) => slug !== productSlug)
    : [...slugs, productSlug];
  persist();
  emit();
}

export function removeFromWishlist(productSlug: string) {
  hydrate();
  slugs = slugs.filter((slug) => slug !== productSlug);
  persist();
  emit();
}

export function useWishlistSlugs() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
