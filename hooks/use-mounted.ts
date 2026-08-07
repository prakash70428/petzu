import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Tracks client-side mount state. Needed to guard rendering that depends
 * on browser-only APIs (theme, viewport) so SSR and the first client
 * paint stay identical and React never hits a hydration mismatch.
 * Uses useSyncExternalStore (server snapshot: false, client: true) instead
 * of an effect + setState, which React's hooks lint flags as a cascading
 * render.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
