import { apiClient } from "@/services/api-client";
import type { KnowledgeArticle, KnowledgeArticleDraft } from "../types";

export function fetchArticles() {
  return apiClient<{ data: KnowledgeArticle[] }>("/api/knowledge").then((res) => res.data);
}

export function createArticle(staffEmail: string, draft: KnowledgeArticleDraft) {
  return apiClient<{ data: KnowledgeArticle }>("/api/knowledge", {
    method: "POST",
    body: JSON.stringify({ staffEmail, ...draft }),
  }).then((res) => res.data);
}

export function updateArticle(staffEmail: string, id: string, draft: KnowledgeArticleDraft) {
  return apiClient<{ data: KnowledgeArticle }>(`/api/knowledge/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ staffEmail, ...draft }),
  }).then((res) => res.data);
}

export function deleteArticle(staffEmail: string, id: string) {
  return apiClient<{ data: { id: string } }>(`/api/knowledge/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ staffEmail }),
  }).then((res) => res.data);
}
