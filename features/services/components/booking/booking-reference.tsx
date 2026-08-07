"use client";

import { useSyncExternalStore } from "react";
import { generateBookingReference } from "../../utils";

/**
 * Same lazy-client-generation pattern as the store milestone's OrderNumber
 * (useSyncExternalStore + a no-op subscription, not an effect + setState)
 * — this page is statically prerendered, so a server-computed "random"
 * reference would be baked in at build time and shown to every visitor.
 */
let cachedReference: string | null = null;

function subscribe() {
  return () => {};
}

function getSnapshot() {
  cachedReference ??= generateBookingReference();
  return cachedReference;
}

function getServerSnapshot() {
  return null;
}

export function BookingReference() {
  const reference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span className="font-mono font-semibold text-foreground">{reference ?? "—"}</span>;
}
