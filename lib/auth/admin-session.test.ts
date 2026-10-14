import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { adminPasswordMatches, createAdminToken, staffSession, verifyAdminToken } from "./admin-session";

const env = { ...process.env };

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct horse battery staple";
  process.env.ADMIN_EMAILS = "owner@petzu.example, team@petzu.example";
  delete process.env.ADMIN_SESSION_SECRET;
});

afterEach(() => {
  process.env = { ...env };
});

describe("admin sessions", () => {
  it("issues a token that verifies for an allow-listed email", () => {
    const token = createAdminToken("Owner@petzu.example")!;
    expect(verifyAdminToken(token)).toBe("owner@petzu.example");
  });

  it("rejects tampered, expired and unknown tokens", () => {
    const token = createAdminToken("owner@petzu.example")!;
    const [payload, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ email: "owner@petzu.example", exp: Date.now() + 1e9 })).toString("base64url");
    expect(verifyAdminToken(`${forged}.${signature}`)).toBeNull();
    expect(verifyAdminToken(`${payload}.x${signature}`)).toBeNull();
    expect(verifyAdminToken(token, Date.now() + 13 * 3600_000)).toBeNull();
    expect(verifyAdminToken(undefined)).toBeNull();
  });

  it("stops working when the email leaves the allow-list or the password changes", () => {
    const token = createAdminToken("team@petzu.example")!;
    process.env.ADMIN_EMAILS = "owner@petzu.example";
    expect(verifyAdminToken(token)).toBeNull();
    process.env.ADMIN_EMAILS = "team@petzu.example";
    process.env.ADMIN_PASSWORD = "a new password";
    expect(verifyAdminToken(token)).toBeNull();
  });

  it("fails closed without ADMIN_PASSWORD", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(createAdminToken("owner@petzu.example")).toBeNull();
    expect(adminPasswordMatches("")).toBe(false);
  });

  it("checks the password exactly", () => {
    expect(adminPasswordMatches("correct horse battery staple")).toBe(true);
    expect(adminPasswordMatches("correct horse battery")).toBe(false);
  });

  it("reads the session from the request cookie only", () => {
    const token = createAdminToken("owner@petzu.example")!;
    const withCookie = new Request("https://thepetzu.com/api/x", { headers: { cookie: `a=1; petzu_admin=${token}` } });
    expect(staffSession(withCookie)).toBe("owner@petzu.example");
    expect(staffSession(new Request("https://thepetzu.com/api/x?staffEmail=owner@petzu.example"))).toBeNull();
  });
});
