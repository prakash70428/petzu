import type { FeedbackStatus } from "./types";

export const statusLabel: Record<FeedbackStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const statusBadgeVariant: Record<FeedbackStatus, "info" | "warning" | "success" | "secondary"> = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "secondary",
};

export const feedbackStatuses: FeedbackStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
