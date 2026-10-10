import { describe, expect, it } from "vitest";
import { enquiryBody, enquirySchema, enquirySubject } from "./schema";

const partner = {
  kind: "PARTNERSHIP" as const,
  name: "Asha Rao",
  email: "asha@clinic.in",
  message: "We run a vet clinic and would like to list on PetZu.",
  business: "Happy Paws Clinic",
  partnerType: "Vet clinic or hospital" as const,
  city: "Bengaluru",
  phone: "+91 98765 43210",
};

describe("enquirySchema", () => {
  it("accepts a valid partnership enquiry and trims fields", () => {
    const parsed = enquirySchema.parse({ ...partner, business: "  Happy Paws Clinic " });
    expect(parsed.kind === "PARTNERSHIP" && parsed.business).toBe("Happy Paws Clinic");
  });

  it("requires business details only for partnerships", () => {
    expect(enquirySchema.safeParse({ ...partner, business: "" }).success).toBe(false);
    expect(
      enquirySchema.safeParse({ kind: "GENERAL", name: "Ravi", email: "ravi@x.com", message: "Hello, quick question" })
        .success,
    ).toBe(true);
  });

  it("rejects unknown partner types, bad phones and short messages", () => {
    expect(enquirySchema.safeParse({ ...partner, partnerType: "Spaceship" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...partner, phone: "call me" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...partner, message: "hi" }).success).toBe(false);
  });

  it("allows the phone to be left empty", () => {
    expect(enquirySchema.safeParse({ ...partner, phone: "" }).success).toBe(true);
  });
});

describe("enquiry formatting", () => {
  it("puts the business, type and city in the subject staff triage on", () => {
    expect(enquirySubject(partner)).toBe("Partnership: Happy Paws Clinic (Vet clinic or hospital, Bengaluru)");
  });

  it("keeps the contact person and phone in the body", () => {
    expect(enquiryBody(partner)).toContain("Contact: Asha Rao");
    expect(enquiryBody(partner)).toContain("Phone: +91 98765 43210");
  });
});
