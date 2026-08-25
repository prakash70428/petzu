import { appointmentReminderTemplate } from "./appointment-reminder";
import { feedbackAckTemplate } from "./feedback-ack";
import { orderConfirmationTemplate } from "./order-confirmation";
import { welcomeTemplate } from "./welcome";
import type { RenderedMessage, TemplateData, TemplateRenderer } from "./types";

export const templates = {
  welcome: welcomeTemplate,
  "order-confirmation": orderConfirmationTemplate,
  "appointment-reminder": appointmentReminderTemplate,
  "feedback-ack": feedbackAckTemplate,
} satisfies Record<string, TemplateRenderer>;

export type TemplateKey = keyof typeof templates;

export function renderTemplate(key: TemplateKey, data: TemplateData): RenderedMessage {
  return templates[key](data);
}

export type { TemplateData, RenderedMessage };
