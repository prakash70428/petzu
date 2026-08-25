import { AdapterNotConfiguredError, type Adapter } from "../types";

/**
 * MSG91's Flow API (https://control.msg91.com/api/v5/flow/) is what MSG91
 * itself recommends for India, since it's built around DLT-registered
 * templates rather than free-form text — TRAI regulation requires every
 * commercial SMS to map to a pre-approved template. `MSG91_AUTH_KEY` and
 * `MSG91_SENDER_ID` alone aren't enough for a real send: you also need a
 * DLT-approved Flow ID from your MSG91 dashboard, which this illustrative
 * payload doesn't have a slot for yet (there's no generic "just send this
 * text" endpoint that's DLT-compliant — see PHASE-2-5-COMMS.md for why this
 * adapter's exact request shape will need adjusting against your real,
 * approved Flow template once one exists).
 */
export const sendSms: Adapter = async ({ to, body }) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID;
  if (!authKey || !senderId) throw new AdapterNotConfiguredError("MSG91_AUTH_KEY / MSG91_SENDER_ID is not set");

  const response = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: { "Content-Type": "application/json", authkey: authKey },
    body: JSON.stringify({
      sender: senderId,
      route: "4",
      recipients: [{ mobiles: to, VAR: body }],
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message ?? `MSG91 request failed (${response.status})`);

  return { providerId: result?.request_id ?? "unknown" };
};
