import { ApiBookingError } from "./booking";
import type { CloudflareEnv } from "./types";

type RateLimitRow = {
  count: number;
  reset_at: string;
};

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashKey(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return bytesToHex(new Uint8Array(digest));
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "local";

  return forwarded || "local";
}

export async function enforceRateLimit(
  env: CloudflareEnv,
  key: string,
  limit: number,
  windowSeconds: number,
) {
  const now = new Date();
  const nowIso = now.toISOString();
  const resetAtIso = new Date(now.getTime() + windowSeconds * 1000).toISOString();
  const hashedKey = await hashKey(key);

  if (Math.random() < 0.02) {
    await env.DB.prepare("DELETE FROM request_limits WHERE reset_at <= ?").bind(nowIso).run();
  }

  const row = await env.DB.prepare(
    `INSERT INTO request_limits (key, count, reset_at, updated_at)
     VALUES (?, 1, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE
         WHEN request_limits.reset_at <= ? THEN 1
         ELSE request_limits.count + 1
       END,
       reset_at = CASE
         WHEN request_limits.reset_at <= ? THEN excluded.reset_at
         ELSE request_limits.reset_at
       END,
       updated_at = excluded.updated_at
     RETURNING count, reset_at`,
  )
    .bind(hashedKey, resetAtIso, nowIso, nowIso, nowIso)
    .first<RateLimitRow>();

  if ((row?.count ?? limit + 1) > limit) {
    throw new ApiBookingError("RATE_LIMITED", 429);
  }
}
