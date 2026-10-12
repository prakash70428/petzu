import { apiClient } from "@/services/api-client";
import { CONSENT_SOURCE } from "../constants";
import type { ConsentChannel, ConsentPurpose, ConsentRecord } from "../types";

export function fetchConsents(email: string) {
  return apiClient<{ data: ConsentRecord[] }>(`/api/consent?email=${encodeURIComponent(email)}`).then(
    (res) => res.data,
  );
}

export function updateConsent(
  email: string,
  channel: ConsentChannel,
  purpose: ConsentPurpose,
  granted: boolean,
  source: string = CONSENT_SOURCE,
) {
  return apiClient<{ data: ConsentRecord }>("/api/consent", {
    method: "POST",
    body: JSON.stringify({ email, channel, purpose, granted, source }),
  }).then((res) => res.data);
}

/** A newsletter sign-up is an explicit opt-in to marketing email, recorded like any other consent. */
export function subscribeToNewsletter(email: string, source: string) {
  return updateConsent(email, "EMAIL", "MARKETING", true, source);
}
