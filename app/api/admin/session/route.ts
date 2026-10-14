import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { adminCookie, adminPasswordMatches, clearAdminCookie, createAdminToken, staffSession } from "@/lib/auth/admin-session";
import { isStaff } from "@/lib/auth/is-staff";

export const runtime = "nodejs";

const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

/**
 * Best-effort brute-force brake: per IP, per server instance. Serverless
 * instances don't share memory, so this slows guessing rather than stopping
 * it; a long random ADMIN_PASSWORD is the real protection.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60_000;

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count++;
}

export async function GET(request: Request) {
  const email = staffSession(request);
  return ok({ isStaff: Boolean(email), email });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooManyAttempts(ip)) return fail("Too many attempts. Try again in 15 minutes.", 429);

  const parsed = signInSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Enter your email and password");

  const { email, password } = parsed.data;
  // Same message whichever part is wrong, so the response doesn't reveal admin emails.
  if (!isStaff(email) || !adminPasswordMatches(password)) {
    recordFailure(ip);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return fail("That email and password don't match an admin account.", 401);
  }

  const token = createAdminToken(email);
  if (!token) return fail("Admin sign-in isn't set up yet.", 503);

  attempts.delete(ip);
  const response = ok({ isStaff: true, email: email.toLowerCase() });
  response.headers.append("Set-Cookie", adminCookie(token));
  return response;
}

export async function DELETE() {
  const response = ok({ signedOut: true });
  response.headers.append("Set-Cookie", clearAdminCookie);
  return response;
}
