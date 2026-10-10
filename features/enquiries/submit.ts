import { apiClient } from "@/services/api-client";
import type { Enquiry } from "./schema";

/** Posts a contact or partnership enquiry; throws ApiError if the server rejects it. */
export function submitEnquiry(enquiry: Enquiry) {
  return apiClient<{ data: { received: true } }>("/api/enquiries", {
    method: "POST",
    body: JSON.stringify(enquiry),
  });
}
