import { apiClient } from "@/services/api-client";

/**
 * Unlike every other service in this build, this doesn't go through
 * `apiClient()` — `GET /api/customers/export` returns a raw file
 * (`Content-Disposition: attachment`), not the `{ data }` JSON envelope
 * `apiClient()` expects. Fetches the file directly and triggers a normal
 * browser download via a temporary `<a download>` link.
 */
export async function exportMyData(email: string): Promise<void> {
  const response = await fetch(`/api/customers/export?email=${encodeURIComponent(email)}`);
  if (!response.ok) throw new Error("Export failed");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const filenameMatch = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/);
  const filename = filenameMatch?.[1] ?? "petzu-data-export.json";

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function deleteMyAccount(email: string) {
  return apiClient<{ data: { deleted: boolean } }>(`/api/customers?email=${encodeURIComponent(email)}`, {
    method: "DELETE",
  }).then((res) => res.data);
}
