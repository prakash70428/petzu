import type { RenderedMessage, TemplateData } from "./types";

export function welcomeTemplate(data: TemplateData): RenderedMessage {
  const name = data.name || "there";
  return {
    subject: "Welcome to PetZu!",
    body: `Hi ${name}, welcome to PetZu! We're glad you're here — browse vetted products, book a vet or groomer, and check out our pet-care guides whenever you're ready.`,
    // Illustrative — a real send needs this exact name registered and
    // approved in Meta Business Manager first. See "WhatsApp template
    // names are illustrative" in PHASE-2-5-COMMS.md.
    whatsappTemplateName: "welcome_message",
  };
}
