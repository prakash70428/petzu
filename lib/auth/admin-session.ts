import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { isStaff } from "./is-staff";

/**
 * Server-side admin sessions. Customer sign-in is still a front-end
 * placeholder (see AUTH.md), so staff access cannot rely on it: an admin
 * signs in with an allow-listed email (ADMIN_EMAILS) plus ADMIN_PASSWORD and
 * gets a signed, HttpOnly cookie. Every staff-only route checks that cookie
 * instead of trusting an email sent by the browser.
 *
 * No ADMIN_PASSWORD set means nobody can sign in: the admin area fails
 * closed rather than open.
 */
export const ADMIN_COOKIE = "petzu_admin";
const SESSION_HOURS = 12;

function secret(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  // A dedicated secret is preferred; deriving one keeps setup to a single
  // variable. Changing ADMIN_PASSWORD signs every admin out.
  return process.env.ADMIN_SESSION_SECRET ?? createHash("sha256").update(`petzu-admin:${password}`).digest("hex");
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function adminPasswordMatches(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compare digests so the comparison takes the same time whatever the length.
  const hash = (v: string) => createHash("sha256").update(v).digest("hex");
  return safeEqual(hash(candidate), hash(password));
}

export function createAdminToken(email: string, now = Date.now()): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(JSON.stringify({ email: email.toLowerCase(), exp: now + SESSION_HOURS * 3600_000 })).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

/** The admin's email if the token is genuine, unexpired and still allow-listed. */
export function verifyAdminToken(token: string | undefined, now = Date.now()): string | null {
  const key = secret();
  if (!key || !token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, key))) return null;
  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email: string; exp: number };
    if (typeof exp !== "number" || exp < now) return null;
    return isStaff(email) ? email : null;
  } catch {
    return null;
  }
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

/** Use in every staff-only route: the signed-in admin's email, or null. */
export function staffSession(request: Request): string | null {
  return verifyAdminToken(readCookie(request, ADMIN_COOKIE));
}

export function adminCookie(token: string): string {
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
}

export const clearAdminCookie = `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
