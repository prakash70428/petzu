"use client";

import { useSyncExternalStore } from "react";
import type { Session, User } from "./types";

const STORAGE_KEY = "petzu:session";
const EMPTY_SESSION: Session = { isAuthenticated: false, user: null };

/**
 * Same module-store + localStorage pattern as features/cart/store.ts and
 * features/wishlist/store.ts — there's no backend, so a persisted client
 * session is the closest honest equivalent. "Login" never checks a
 * password against anything real; it just sets this session.
 */
let session: Session = EMPTY_SESSION;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) session = JSON.parse(raw) as Session;
  } catch {
    session = EMPTY_SESSION;
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
  return session;
}

function getServerSnapshot(): Session {
  return EMPTY_SESSION;
}

export function login(user: User) {
  hydrate();
  session = { isAuthenticated: true, user };
  persist();
  emit();
}

export function logout() {
  session = EMPTY_SESSION;
  persist();
  emit();
}

export function updateUser(patch: Partial<User>) {
  hydrate();
  if (!session.user) return;
  session = { ...session, user: { ...session.user, ...patch } };
  persist();
  emit();
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
