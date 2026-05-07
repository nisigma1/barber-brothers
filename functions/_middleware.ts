import type { CloudflareEnv } from "./_lib/types";

type MiddlewareContext = {
  next: () => Promise<Response>;
  request: Request;
  env: CloudflareEnv;
};

export async function onRequest(context: MiddlewareContext) {
  const response = await context.next();
  const headers = new Headers(response.headers);

  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-frame-options", "DENY");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
