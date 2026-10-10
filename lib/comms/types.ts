import type { ConsentPurpose } from "@prisma/client";

/** Thrown by an adapter when its required env var(s) aren't set — the dispatcher catches this specifically to log `QUEUED` with an explanatory note instead of `FAILED`, per the credentials matrix in the approved plan: no external account should ever be required for `npm run build`/`verify` to stay green. */
export class AdapterNotConfiguredError extends Error {}

export interface SendPayload {
  to: string;
  /** Lets adapters send promotions and service messages from different identities (see sender-identity.ts). */
  purpose: ConsentPurpose;
  subject?: string;
  body: string;
  /** WhatsApp Business Platform requires a pre-approved template name for any business-initiated message outside a 24h customer-service session — see lib/comms/adapters/whatsapp-meta.ts. */
  whatsappTemplateName?: string;
  whatsappComponents?: Record<string, unknown>[];
}

export interface SendResult {
  providerId: string;
}

export type Adapter = (payload: SendPayload) => Promise<SendResult>;
