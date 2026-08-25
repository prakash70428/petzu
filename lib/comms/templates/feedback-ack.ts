import type { RenderedMessage, TemplateData } from "./types";

export function feedbackAckTemplate(data: TemplateData): RenderedMessage {
  const subject = data.subject || "your submission";
  return {
    subject: "We received your feedback",
    body: `Thanks for reaching out about "${subject}" — our team will take a look and get back to you soon.`,
    whatsappTemplateName: "feedback_acknowledgement",
  };
}
