import { describe, expect, it } from "vitest";
import { emailFromFor, smsSenderFor } from "./sender-identity";

describe("smsSenderFor", () => {
  const env = {
    MSG91_SENDER_ID: "PETZU",
    MSG91_SENDER_ID_PROMOTIONAL: "PZOFFR",
    MSG91_SENDER_ID_TRANSACTIONAL: "PZCARE",
  };

  it("sends promotions from the promotional header on the promotional route", () => {
    expect(smsSenderFor("MARKETING", env)).toEqual({ senderId: "PZOFFR", route: "1" });
  });

  it("sends reminders and support from the transactional header", () => {
    expect(smsSenderFor("TRANSACTIONAL", env)).toEqual({ senderId: "PZCARE", route: "4" });
    expect(smsSenderFor("SUPPORT", env)).toEqual({ senderId: "PZCARE", route: "4" });
  });

  it("falls back to the shared sender when no split is configured", () => {
    expect(smsSenderFor("MARKETING", { MSG91_SENDER_ID: "PETZU" }).senderId).toBe("PETZU");
  });
});

describe("emailFromFor", () => {
  it("uses a separate from-address for marketing when set", () => {
    const env = { RESEND_FROM_EMAIL: "PetZu <care@x.com>", RESEND_FROM_EMAIL_MARKETING: "PetZu Offers <offers@x.com>" };
    expect(emailFromFor("MARKETING", env)).toBe("PetZu Offers <offers@x.com>");
    expect(emailFromFor("TRANSACTIONAL", env)).toBe("PetZu <care@x.com>");
  });

  it("keeps the old default when nothing is configured", () => {
    expect(emailFromFor("SUPPORT", {})).toBe("PetZu <onboarding@resend.dev>");
  });
});
