import { apiClient } from "@/services/api-client";
import type { CustomerDetail, CustomerSummary, Note, Tag } from "../types";

export function fetchCustomers(staffEmail: string, query?: string) {
  const params = new URLSearchParams({ staffEmail });
  if (query) params.set("q", query);
  return apiClient<{ data: CustomerSummary[] }>(`/api/crm/customers?${params}`).then((res) => res.data);
}

export function fetchCustomerDetail(staffEmail: string, customerId: string) {
  const params = new URLSearchParams({ staffEmail });
  return apiClient<{ data: CustomerDetail }>(`/api/crm/customers/${customerId}?${params}`).then((res) => res.data);
}

export function addNote(staffEmail: string, customerId: string, body: string) {
  return apiClient<{ data: Note }>(`/api/crm/customers/${customerId}/notes`, {
    method: "POST",
    body: JSON.stringify({ staffEmail, body }),
  }).then((res) => res.data);
}

export function addTag(staffEmail: string, customerId: string, name: string) {
  return apiClient<{ data: Tag }>(`/api/crm/customers/${customerId}/tags`, {
    method: "POST",
    body: JSON.stringify({ staffEmail, name }),
  }).then((res) => res.data);
}

export function removeTag(staffEmail: string, customerId: string, tagId: string) {
  return apiClient<{ data: { tagId: string } }>(`/api/crm/customers/${customerId}/tags`, {
    method: "DELETE",
    body: JSON.stringify({ staffEmail, tagId }),
  }).then((res) => res.data);
}
