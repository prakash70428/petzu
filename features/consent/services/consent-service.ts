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
) {
  return apiClient<{ data: ConsentRecord }>("/api/consent", {
    method: "POST",
    body: JSON.stringify({ email, channel, purpose, granted, source: CONSENT_SOURCE }),
  }).then((res) => res.data);
}
