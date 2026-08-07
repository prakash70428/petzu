"use client";

import { useSyncExternalStore } from "react";

export type ToastVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type Listener = () => void;

/**
 * Module-level store (no Context) so `toast()` can be called from anywhere
 * — event handlers, services, error boundaries — without needing a hook or
 * a provider reference. `Toaster` subscribes via useSyncExternalStore.
 */
let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
const EMPTY_TOASTS: ToastItem[] = [];

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

function getServerSnapshot(): ToastItem[] {
  return EMPTY_TOASTS;
}

export function toast(item: Omit<ToastItem, "id">) {
  const id = crypto.randomUUID();
  const duration = item.duration ?? 5000;

  toasts = [...toasts, { id, ...item }];
  emit();

  if (duration !== Infinity) {
    setTimeout(() => dismissToast(id), duration);
  }

  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
