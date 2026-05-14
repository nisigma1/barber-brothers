const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": [
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
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

export function withSecurityHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    nextHeaders.set(key, value);
  }

  return nextHeaders;
}

export function redirectResponse(url: string, status = 302) {
  return new Response(null, {
    status,
    headers: withSecurityHeaders({ location: url }),
  });
}
