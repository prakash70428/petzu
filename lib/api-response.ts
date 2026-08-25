import { NextResponse } from "next/server";

/**
 * Response envelope every `app/api/**` route returns. `services/api-client.ts`
 * already throws `ApiError` on `!response.ok`, so the shape just needs to
 * give the client a JSON body worth reading on both paths.
 */
export function ok<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json({ data }, typeof init === "number" ? { status: init } : init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
