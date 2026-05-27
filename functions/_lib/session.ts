import type { CloudflareEnv } from "./types";

const COOKIE_NAME = "bb_staff_session";
// 30 days — staff installs the PWA on their own device, so a long-lived
// HttpOnly + Secure + SameSite=Lax cookie keeps them signed in without
// re-entering the PIN. The cookie is HMAC-signed; tampering invalidates it.
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value: string) {
  const pairs = value.match(/.{1,2}/g) ?? [];

  return Uint8Array.from(pairs, (pair) => Number.parseInt(pair, 16));
}

function encodeText(value: string) {
  return bytesToHex(new TextEncoder().encode(value));
}

function decodeText(value: string) {
  return new TextDecoder().decode(hexToBytes(value));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return bytesToHex(new Uint8Array(signature));
}

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function getCookieSecurityAttribute(isSecureRequest: boolean) {
  return isSecureRequest ? " Secure;" : "";
}

export function getSessionCookieHeader(
  session: { email: string; displayName: string; barberId?: string; role: string },
  secret: string,
  isSecureRequest: boolean,
) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = encodeText(JSON.stringify({ ...session, exp: expiresAt }));

  return sign(payload, secret).then((signature) => {
    return `${COOKIE_NAME}=${encodeURIComponent(`${payload}.${signature}`)}; HttpOnly;${getCookieSecurityAttribute(isSecureRequest)} SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
  });
}

export function getClearSessionCookieHeader(isSecureRequest: boolean) {
  return `${COOKIE_NAME}=; HttpOnly;${getCookieSecurityAttribute(isSecureRequest)} SameSite=Lax; Path=/; Max-Age=0`;
}

export async function requireStaffSession(request: Request, env: CloudflareEnv) {
  const secret = env.STAFF_SESSION_SECRET;

  if (!secret) {
    return null;
  }

  const cookie = getCookie(request, COOKIE_NAME);

  if (!cookie) {
    return null;
  }

  const [payload, signature] = cookie.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = await sign(payload, secret);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const session = JSON.parse(decodeText(payload)) as { email?: string; barberId?: string; exp?: number };
    const now = Math.floor(Date.now() / 1000);

    if (!session.email || typeof session.exp !== "number" || session.exp <= now) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
