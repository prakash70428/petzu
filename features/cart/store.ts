"use client";

import { useSyncExternalStore } from "react";

export interface CartItem {
  /** A product's `slug` — used as the cart's stable key. */
  productSlug: string;
  quantity: number;
  variant?: string;
}

const STORAGE_KEY = "petzu:cart";
const EMPTY_ITEMS: CartItem[] = [];

/**
 * Module-level store (same pattern as hooks/use-toast.ts) persisted to
 * localStorage — this app has no backend, so localStorage *is* the order
 * of record for an in-progress cart. Hydration is lazy (only on the
 * client, on first subscribe) since localStorage doesn't exist during SSR.
 */
let items: CartItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw) as CartItem[];
  } catch {
    items = [];
  }
}

function subscribe(listener: () => void) {
  const wasHydrated = hydrated;
  hydrate();
  listeners.add(listener);
  // Hydration may have just loaded different data than the pre-hydration
  // (empty) snapshot React rendered with — notify immediately rather than
  // waiting for the next store mutation to reveal the mismatch.
  if (!wasHydrated) listener();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function findIndex(productSlug: string, variant?: string) {
  return items.findIndex((item) => item.productSlug === productSlug && item.variant === variant);
}

export function addToCart(productSlug: string, quantity = 1, variant?: string) {
  hydrate();
  const index = findIndex(productSlug, variant);
  if (index === -1) {
    items = [...items, { productSlug, quantity, variant }];
  } else {
    items = items.map((item, i) => (i === index ? { ...item, quantity: item.quantity + quantity } : item));
  }
  persist();
  emit();
}

export function removeFromCart(productSlug: string, variant?: string) {
  hydrate();
  items = items.filter((item) => !(item.productSlug === productSlug && item.variant === variant));
  persist();
  emit();
}

export function updateCartQuantity(productSlug: string, quantity: number, variant?: string) {
  hydrate();
  if (quantity <= 0) {
    removeFromCart(productSlug, variant);
    return;
  }
  items = items.map((item) =>
    item.productSlug === productSlug && item.variant === variant ? { ...item, quantity } : item,
  );
  persist();
  emit();
}

export function clearCart() {
  items = [];
  persist();
  emit();
}

export function useCartItems() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
