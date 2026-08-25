import type { RenderedMessage, TemplateData } from "./types";

export function appointmentReminderTemplate(data: TemplateData): RenderedMessage {
  return {
    subject: "Appointment reminder",
    body: `Reminder: your appointment with ${data.providerName ?? "your provider"} is on ${data.date ?? ""} at ${data.time ?? ""}.`,
    whatsappTemplateName: "appointment_reminder",
  };
}
