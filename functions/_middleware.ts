import type { CloudflareEnv } from "./_lib/types";

type MiddlewareContext = {
  next: () => Promise<Response>;
  request: Request;
  env: CloudflareEnv;
};

export async function onRequest(context: MiddlewareContext) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  const url = new URL(context.request.url);

  headers.set(
    "content-security-policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com",
      "font-src 'self' data:",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https:",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-frame-options", "DENY");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");

  if (url.protocol === "https:") {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
