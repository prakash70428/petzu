import type { ConsentPurpose } from "@prisma/client";

type Env = Record<string, string | undefined>;

/**
 * Promotions and service messages go out from different identities, so
 * customers can tell "your appointment is tomorrow" apart from "20% off
 * grooming" at a glance, and so a spam complaint against promotions never
 * blocks appointment reminders. This also matches India's DLT rules, where
 * promotional and transactional SMS use separately registered headers.
 *
 * Each purpose-specific variable is optional and falls back to the single
 * shared one, so existing deployments keep working unchanged.
 */
export function smsSenderFor(purpose: ConsentPurpose, env: Env = process.env) {
  const promotional = purpose === "MARKETING";
  return {
    senderId: (promotional ? env.MSG91_SENDER_ID_PROMOTIONAL : env.MSG91_SENDER_ID_TRANSACTIONAL) ?? env.MSG91_SENDER_ID,
    // MSG91 route 1 = promotional, 4 = transactional.
    route: promotional ? "1" : "4",
  };
}

export function emailFromFor(purpose: ConsentPurpose, env: Env = process.env): string {
  const specific = purpose === "MARKETING" ? env.RESEND_FROM_EMAIL_MARKETING : env.RESEND_FROM_EMAIL_TRANSACTIONAL;
  return specific ?? env.RESEND_FROM_EMAIL ?? "PetZu <onboarding@resend.dev>";
}
