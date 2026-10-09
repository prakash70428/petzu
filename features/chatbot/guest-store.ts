"use client";

import { useSyncExternalStore } from "react";

export interface ChatGuest {
  name: string;
  email: string;
}

const STORAGE_KEY = "petzu:chat-guest";

/**
 * Remembers the name/email a signed-out visitor gave the chat widget, so
 * reopening it skips the form. Same module-store + localStorage pattern as
 * features/wishlist/store.ts.
 */
let guest: ChatGuest | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) guest = JSON.parse(raw) as ChatGuest;
  } catch {
    guest = null;
  }
}

function subscribe(listener: () => void) {
  const wasHydrated = hydrated;
  hydrate();
  listeners.add(listener);
  if (!wasHydrated) listener();
  return () => listeners.delete(listener);
}

export function setChatGuest(next: ChatGuest) {
  hydrate();
  guest = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function useChatGuest() {
  return useSyncExternalStore(
    subscribe,
    () => guest,
    () => null,
  );
}
