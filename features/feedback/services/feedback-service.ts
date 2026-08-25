import { apiClient } from "@/services/api-client";
import type { FeedbackDraft, FeedbackItem, FeedbackStatus, FeedbackWithCustomer } from "../types";

export function fetchMyFeedback(email: string) {
  return apiClient<{ data: FeedbackItem[] }>(`/api/feedback?email=${encodeURIComponent(email)}`).then(
    (res) => res.data,
  );
}

export function fetchAllFeedback(staffEmail: string, status?: FeedbackStatus) {
  const params = new URLSearchParams({ staffEmail });
  if (status) params.set("status", status);
  return apiClient<{ data: FeedbackWithCustomer[] }>(`/api/feedback?${params}`).then((res) => res.data);
}

export function submitFeedback(email: string, draft: FeedbackDraft) {
  return apiClient<{ data: FeedbackItem }>("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ email, ...draft }),
  }).then((res) => res.data);
}

export function updateFeedbackStatus(staffEmail: string, id: string, status: FeedbackStatus) {
  return apiClient<{ data: FeedbackItem }>(`/api/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ staffEmail, status }),
  }).then((res) => res.data);
}
