import { createHmac, timingSafeEqual } from "node:crypto";
import { AdapterNotConfiguredError, type Adapter } from "../types";

const GRAPH_API_VERSION = "v21.0";

/**
 * Verifies Meta's `X-Hub-Signature-256` header — an HMAC-SHA256 of the raw
 * request body keyed with `WHATSAPP_APP_SECRET` — so the webhook can't be
 * spoofed by a POST from anywhere else. When `WHATSAPP_APP_SECRET` isn't
 * set (no real Meta app configured yet), this returns `true` and lets the
 * request through unverified, matching this build's rule that no external
 * credential is ever required for the code to run — but that also means
 * the webhook is genuinely open to spoofed payloads until the secret is
 * set. See "Signature verification is opt-in until configured" in
 * PHASE-2-6-WHATSAPP.md; this is not a safe default for a real deployment
 * with a real secret available.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true;
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  const provided = signatureHeader.slice("sha256=".length);

  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(provided, "hex");
  if (expectedBuffer.length !== providedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

/**
 * Meta's WhatsApp Cloud API. Outbound-template-only in this phase — sending
 * arbitrary free text only works inside a 24h window opened by the customer
 * messaging first, which needs the inbound webhook Phase 6 builds. Every
 * send here is a pre-approved template (`whatsappTemplateName`), which is
 * also why `whatsappTemplateName` must be registered and approved in Meta
 * Business Manager before this will actually deliver anything — the exact
 * names used in `lib/comms/templates/*.ts` (`welcome_message`,
 * `order_confirmation`, `appointment_reminder`) are illustrative, not real
 * approved templates.
 */
export const sendWhatsApp: Adapter = async ({ to, whatsappTemplateName, whatsappComponents }) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new AdapterNotConfiguredError("WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID is not set");
  }
  if (!whatsappTemplateName) {
    throw new Error("whatsappTemplateName is required for a WhatsApp send");
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: whatsappTemplateName,
        language: { code: "en" },
        components: whatsappComponents ?? [],
      },
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error?.message ?? `WhatsApp send failed (${response.status})`);

  return { providerId: result?.messages?.[0]?.id ?? "unknown" };
};

/**
 * Free-form text reply — only valid inside the 24h "customer service window"
 * that opens when a customer messages first (exactly what
 * `app/api/whatsapp/webhook/route.ts` calls this for). This deliberately
 * does NOT go through `lib/comms/dispatcher.ts`'s consent gate: Meta's own
 * policy is that a reply inside this window doesn't need a pre-approved
 * template or the opt-in `sendWhatsApp` above requires — the customer's own
 * inbound message is what authorizes the reply. Consent gating exists for
 * *business-initiated* messages, not for answering someone who just wrote
 * to you.
 */
export async function sendWhatsAppSessionReply(to: string, body: string): Promise<{ providerId: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new AdapterNotConfiguredError("WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID is not set");
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error?.message ?? `WhatsApp reply failed (${response.status})`);

  return { providerId: result?.messages?.[0]?.id ?? "unknown" };
}

export interface InboundWhatsAppMessage {
  /** The sender's WhatsApp number (Meta's `wa_id`), e.g. "919876543210" — no "+" prefix. */
  from: string;
  messageId: string;
  text: string;
  timestamp: string;
}

/**
 * Meta's webhook payload nests inbound messages several levels deep
 * (`entry[].changes[].value.messages[]`) and mixes them with delivery-status
 * updates (`.statuses[]`, which this build doesn't act on yet) in the same
 * shape. Only text messages are extracted — image/audio/location/etc.
 * messages are silently skipped rather than crashing the webhook, since
 * Meta will retry a non-200 response and there's no useful text to hand the
 * chatbot for those types yet.
 */
export function parseWebhookPayload(payload: unknown): InboundWhatsAppMessage[] {
  const messages: InboundWhatsAppMessage[] = [];

  const entries = isRecord(payload) && Array.isArray(payload.entry) ? payload.entry : [];
  for (const entry of entries) {
    const changes = isRecord(entry) && Array.isArray(entry.changes) ? entry.changes : [];
    for (const change of changes) {
      const value = isRecord(change) ? change.value : undefined;
      const rawMessages = isRecord(value) && Array.isArray(value.messages) ? value.messages : [];

      for (const raw of rawMessages) {
        if (!isRecord(raw) || raw.type !== "text" || typeof raw.from !== "string" || typeof raw.id !== "string") {
          continue;
        }
        const text = isRecord(raw.text) && typeof raw.text.body === "string" ? raw.text.body : "";
        if (!text) continue;

        messages.push({
          from: raw.from,
          messageId: raw.id,
          text,
          timestamp: typeof raw.timestamp === "string" ? raw.timestamp : String(Date.now()),
        });
      }
    }
  }

  return messages;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
