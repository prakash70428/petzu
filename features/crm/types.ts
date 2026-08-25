export interface CustomerSummary {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  authorEmail: string;
  body: string;
  createdAt: string;
}

export type InteractionType =
  | "CONSENT_CHANGED"
  | "CHAT_MESSAGE"
  | "EMAIL_SENT"
  | "SMS_SENT"
  | "WHATSAPP_MESSAGE"
  | "FEEDBACK_SUBMITTED"
  | "COMPLAINT_FILED"
  | "NOTE_ADDED";

export interface Interaction {
  id: string;
  type: InteractionType;
  summary: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ConsentRow {
  id: string;
  channel: "EMAIL" | "SMS" | "WHATSAPP";
  purpose: "MARKETING" | "TRANSACTIONAL" | "SUPPORT";
  granted: boolean;
  updatedAt: string;
}

export interface CustomerDetail {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  tags: Tag[];
  notes: Note[];
  interactions: Interaction[];
  consents: ConsentRow[];
}
