import { Resend } from "resend";
import { emailFromFor } from "./sender-identity";

const GRAPH_API_VERSION = "v21.0";

export type TeamAlertKind = "booking" | "enquiry" | "partner" | "complaint" | "feedback" | "community";

export interface TeamAlert {
  kind: TeamAlertKind;
  /** One line, e.g. "Booking request PZ-482913: Wellness exam with Dr. Meera Rao". */
  title: string;
  /** Who it's from: name and email. */
  from: string;
  /** Optional short excerpt of what they wrote. */
  excerpt?: string;
  /** Admin page to open. */
  path: string;
}

const LABEL: Record<TeamAlertKind, string> = {
  booking: "New booking request",
  enquiry: "New enquiry",
  partner: "New partner request",
  complaint: "New complaint",
  feedback: "New feedback",
  community: "New community question",
};

function list(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function siteUrl(path: string) {
  return `${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thepetzu.com").replace(/\/$/, "")}${path}`;
}

/**
 * WhatsApp template parameters can't contain new lines, tabs or more than
 * four spaces in a row, and are capped in length, so the summary is one
 * flattened line.
 */
export function whatsappSummary(alert: TeamAlert): string {
  const parts = [`${LABEL[alert.kind]}: ${alert.title}`, `From ${alert.from}`];
  if (alert.excerpt) parts.push(`"${alert.excerpt}"`);
  parts.push(siteUrl(alert.path));
  return parts
    .join(" | ")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {4,}/g, "   ")
    .slice(0, 900);
}

/** Digits only, with India's country code added to a bare 10-digit mobile number. */
export function normaliseWhatsAppNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

async function sendWhatsAppAlert(alert: TeamAlert): Promise<string[]> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipients = list("TEAM_WHATSAPP_NUMBERS").map(normaliseWhatsAppNumber).filter((n): n is string => Boolean(n));
  if (!token || !phoneNumberId || recipients.length === 0) return [];

  // Business-initiated messages must use an approved template; see
  // PETZU-OPERATIONS.md for the exact "team_alert" template to register.
  const template = process.env.TEAM_ALERT_TEMPLATE ?? "team_alert";
  const language = process.env.TEAM_ALERT_TEMPLATE_LANGUAGE ?? "en";
  const summary = whatsappSummary(alert);

  const results = await Promise.allSettled(
    recipients.map(async (to) => {
      const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: template,
            language: { code: language },
            components: [{ type: "body", parameters: [{ type: "text", text: summary }] }],
          },
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message ?? `HTTP ${response.status}`);
      }
      return to;
    }),
  );
  results.forEach((r) => r.status === "rejected" && console.error("Team WhatsApp alert failed:", r.reason));
  return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
}

async function sendEmailAlert(alert: TeamAlert): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = list("TEAM_ALERT_EMAILS");
  if (!apiKey || recipients.length === 0) return false;

  const result = await new Resend(apiKey).emails.send({
    from: emailFromFor("SUPPORT"),
    to: recipients,
    subject: `${LABEL[alert.kind]}: ${alert.title}`.slice(0, 200),
    text: [`${LABEL[alert.kind]}: ${alert.title}`, `From: ${alert.from}`, alert.excerpt ? `\n${alert.excerpt}\n` : "", `Open: ${siteUrl(alert.path)}`].join("\n"),
  });
  if (result.error) {
    console.error("Team email alert failed:", result.error.message);
    return false;
  }
  return true;
}

/**
 * Tells the PetZu team about something new, on WhatsApp and/or email,
 * whichever is configured. Never throws: an alert that fails must not
 * fail the customer's submission. Call it through `after()` so the
 * customer isn't kept waiting.
 */
export async function notifyTeam(alert: TeamAlert): Promise<void> {
  try {
    const [whatsapp, email] = await Promise.all([sendWhatsAppAlert(alert), sendEmailAlert(alert)]);
    if (whatsapp.length === 0 && !email) console.info(`Team alert not sent (no WhatsApp or email configured): ${alert.title}`);
  } catch (error) {
    console.error("Team alert failed:", error);
  }
}

/** A short, single-paragraph excerpt for alerts. */
export function excerpt(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}
