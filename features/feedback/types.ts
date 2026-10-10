export type FeedbackType = "FEEDBACK" | "COMPLAINT" | "ENQUIRY" | "PARTNERSHIP";

export const feedbackTypeLabels: Record<FeedbackType, string> = {
  FEEDBACK: "Feedback",
  COMPLAINT: "Complaint",
  ENQUIRY: "Enquiry",
  PARTNERSHIP: "Partnership",
};
export type FeedbackStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface FeedbackItem {
  id: string;
  customerId: string | null;
  type: FeedbackType;
  subject: string;
  body: string;
  rating: number | null;
  status: FeedbackStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export interface FeedbackWithCustomer extends FeedbackItem {
  customer: { email: string; name: string | null } | null;
}

export interface FeedbackDraft {
  type: FeedbackType;
  subject: string;
  body: string;
  rating?: number;
}
