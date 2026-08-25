import { Resend } from "resend";
import { AdapterNotConfiguredError, type Adapter } from "../types";

export const sendEmail: Adapter = async ({ to, subject, body }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new AdapterNotConfiguredError("RESEND_API_KEY is not set");

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "PetZu <onboarding@resend.dev>";

  const result = await resend.emails.send({ from, to, subject: subject ?? "Message from PetZu", text: body });

  if (result.error) throw new Error(result.error.message);
  return { providerId: result.data?.id ?? "unknown" };
};
