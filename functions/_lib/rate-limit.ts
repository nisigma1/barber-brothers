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

  await env.DB.prepare("DELETE FROM request_limits WHERE reset_at <= ?").bind(nowIso).run();

  const existing = await env.DB.prepare("SELECT count, reset_at FROM request_limits WHERE key = ?")
    .bind(hashedKey)
    .first<RateLimitRow>();

  if (!existing || existing.reset_at <= nowIso) {
    await env.DB.prepare(
      "INSERT OR REPLACE INTO request_limits (key, count, reset_at, updated_at) VALUES (?, 1, ?, ?)",
    )
      .bind(hashedKey, resetAtIso, nowIso)
      .run();
    return;
  }

  const nextCount = existing.count + 1;

  await env.DB.prepare("UPDATE request_limits SET count = ?, updated_at = ? WHERE key = ?")
    .bind(nextCount, nowIso, hashedKey)
    .run();

  if (nextCount > limit) {
    throw new ApiBookingError("RATE_LIMITED", 429);
  }
}
