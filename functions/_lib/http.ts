import type { ApiErrorCode } from "../../src/lib/booking/types";

export function jsonResponse(body: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export function errorResponse(code: ApiErrorCode, status = 400) {
  return jsonResponse({ code }, status);
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
