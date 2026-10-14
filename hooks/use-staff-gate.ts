"use client";

import { useSyncExternalStore } from "react";
import { fetchStaffStatus, type StaffStatus } from "@/services/staff-client";

/**
 * The admin session, shared by every admin page. The real check happens on
 * the server (each staff route verifies the signed cookie); this only
 * decides what to render. One request per page load, cached in the module.
 */
interface GateState extends StaffStatus {
  loading: boolean;
}

let state: GateState = { isStaff: false, email: null, loading: true };
let started = false;
const listeners = new Set<() => void>();

function set(next: GateState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function refreshStaffGate() {
  set({ ...state, loading: true });
  return fetchStaffStatus()
    .then((status) => set({ ...status, loading: false }))
    .catch(() => set({ isStaff: false, email: null, loading: false }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    void refreshStaffGate();
  }
  return () => listeners.delete(listener);
}

const SERVER_STATE: GateState = { isStaff: false, email: null, loading: true };

export function useStaffGate(): GateState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}
