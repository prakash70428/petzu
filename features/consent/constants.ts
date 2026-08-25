import type { ConsentChannel, ConsentPurpose } from "./types";

export const CONSENT_SOURCE = "dashboard-settings";

export const consentChannels: { id: ConsentChannel; label: string }[] = [
  { id: "EMAIL", label: "Email" },
  { id: "SMS", label: "SMS" },
  { id: "WHATSAPP", label: "WhatsApp" },
];

export const consentPurposes: { id: ConsentPurpose; label: string; description: string }[] = [
  {
    id: "TRANSACTIONAL",
    label: "Order & appointment updates",
    description: "Confirmations, shipping status, reminders — about something you already booked or bought.",
  },
  {
    id: "SUPPORT",
    label: "Support & account",
    description: "Replies to your questions, complaint updates, account/security notices.",
  },
  {
    id: "MARKETING",
    label: "Offers & recommendations",
    description: "Promotions, new products, and pet-care tips we think you'd like.",
  },
];
