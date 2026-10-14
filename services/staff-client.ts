import { apiClient } from "./api-client";

export interface StaffStatus {
  isStaff: boolean;
  email: string | null;
}

/** The signed-in admin, read from the HttpOnly session cookie (see lib/auth/admin-session.ts). */
export function fetchStaffStatus() {
  return apiClient<{ data: StaffStatus }>("/api/admin/session").then((res) => res.data);
}

export function signInAdmin(email: string, password: string) {
  return fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error ?? "Sign-in failed");
    return body.data as StaffStatus;
  });
}

export function signOutAdmin() {
  return fetch("/api/admin/session", { method: "DELETE" });
}
