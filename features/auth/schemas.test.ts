import { describe, expect, it } from "vitest";
import { loginSchema, passwordChangeSchema, signupSchema } from "./schemas";
import { getInitials, getPasswordStrength } from "./utils";

const validSignup = {
  name: "Alex Morgan",
  email: "alex@example.com",
  password: "Str0ngPassword",
  confirmPassword: "Str0ngPassword",
  agreeToTerms: true,
};

describe("loginSchema", () => {
  it("accepts a well-formed login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects a malformed email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  });

  it("rejects an empty password without imposing signup rules on it", () => {
    // Sign-in must not enforce complexity — an existing account may
    // predate the current policy.
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "old" }).success).toBe(true);
  });
});

describe("signupSchema", () => {
  it("accepts a valid signup", () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it("requires 8+ chars, an uppercase letter and a number", () => {
    expect(signupSchema.safeParse({ ...validSignup, password: "Sh0rt", confirmPassword: "Sh0rt" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...validSignup, password: "alllowercase1", confirmPassword: "alllowercase1" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...validSignup, password: "NoNumbersHere", confirmPassword: "NoNumbersHere" }).success).toBe(false);
  });

  it("reports a password mismatch on the confirm field, not the password field", () => {
    const result = signupSchema.safeParse({ ...validSignup, confirmPassword: "Different1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "confirmPassword")).toBe(true);
    }
  });

  it("requires the terms checkbox", () => {
    expect(signupSchema.safeParse({ ...validSignup, agreeToTerms: false }).success).toBe(false);
  });
});

describe("passwordChangeSchema", () => {
  it("applies the same complexity rules as signup", () => {
    // Both compose the shared `passwordSchema`, so the two forms can't
    // drift apart on what counts as a valid password.
    const weak = { currentPassword: "old", newPassword: "weak", confirmNewPassword: "weak" };
    expect(passwordChangeSchema.safeParse(weak).success).toBe(false);

    const strong = { currentPassword: "old", newPassword: "Str0ngPassword", confirmNewPassword: "Str0ngPassword" };
    expect(passwordChangeSchema.safeParse(strong).success).toBe(true);
  });
});

describe("getPasswordStrength", () => {
  it("scores monotonically as complexity increases", () => {
    const weak = getPasswordStrength("abc").score;
    const medium = getPasswordStrength("abcdefgh").score;
    const strong = getPasswordStrength("Abcdefgh1").score;
    const strongest = getPasswordStrength("Abcdefghijkl1!").score;

    expect(weak).toBeLessThanOrEqual(medium);
    expect(medium).toBeLessThanOrEqual(strong);
    expect(strong).toBeLessThanOrEqual(strongest);
  });

  it("never exceeds the 0–4 range the meter renders", () => {
    for (const pw of ["", "a", "Abcdefghijklmnop1!@#$"]) {
      const { score } = getPasswordStrength(pw);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(4);
    }
  });
});

describe("getInitials", () => {
  it("uses first and last name", () => {
    expect(getInitials("Alex Morgan")).toBe("AM");
    expect(getInitials("Mary Jane Watson")).toBe("MW");
  });

  it("falls back to the first two letters of a single name", () => {
    expect(getInitials("Cher")).toBe("CH");
  });

  it("tolerates extra whitespace", () => {
    expect(getInitials("  Alex   Morgan  ")).toBe("AM");
  });
});
