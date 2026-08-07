/**
 * Thin fetch wrapper all feature services build on. Centralizing this
 * makes it a single place to add auth headers, retries, or tracing later
 * without touching every call site.
 */
export interface ApiClientOptions extends RequestInit {
  baseUrl?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiClient<T>(
  path: string,
  { baseUrl = DEFAULT_BASE_URL, ...init }: ApiClientOptions = {},
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed`);
  }

  return response.json() as Promise<T>;
}
