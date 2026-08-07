"use client";

import { useSyncExternalStore } from "react";

/**
 * Generated client-side, lazily, on first read — this page is statically
 * prerendered (no backend to assign a real order id), so a server-computed
 * "random" number would be baked in at build time and show the same value
 * to every visitor. Uses useSyncExternalStore (not an effect + setState,
 * which React's hooks lint flags as a cascading-render risk — see the same
 * fix in hooks/use-mounted.ts) with a no-op subscription, since the value
 * never changes after it's first generated.
 */
let cachedOrderNumber: string | null = null;

function subscribe() {
  return () => {};
}

function getSnapshot() {
  cachedOrderNumber ??= `PZ-${Math.floor(100000 + Math.random() * 900000)}`;
  return cachedOrderNumber;
}

function getServerSnapshot() {
  return null;
}

export function OrderNumber() {
  const orderNumber = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span className="font-mono font-semibold text-foreground">{orderNumber ?? "—"}</span>;
}
