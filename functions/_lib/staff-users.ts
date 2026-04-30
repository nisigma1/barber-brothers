import type { BarberId } from "../../src/lib/booking/types";
import { ApiBookingError } from "./booking";
import type { CloudflareEnv, StaffUserRow } from "./types";

const PASSWORD_ITERATIONS = 1;
const PASSWORD_MIN_LENGTH = 8;

function getDatabase(env: CloudflareEnv) {
  if (!env.DB) {
    throw new ApiBookingError("CONFIGURATION_ERROR", 500);
  }

  return env.DB;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isBarberId(value: unknown): value is BarberId {
  return value === "barber-1" || value === "barber-2";
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

async function hashPassword(password: string, salt: string, iterations = PASSWORD_ITERATIONS) {
  let input = new TextEncoder().encode(`${salt}:${password}`);

  for (let index = 0; index < iterations; index += 1) {
    input = new Uint8Array(await crypto.subtle.digest("SHA-256", input));
  }

  return bytesToHex(input);
}

export async function createStaffUser(env: CloudflareEnv, payload: unknown) {
  const body = payload as {
    email?: unknown;
    password?: unknown;
    displayName?: unknown;
    barberId?: unknown;
    signupCode?: unknown;
  } | null;
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  const displayName = normalizeText(body?.displayName);
  const signupCode = typeof body?.signupCode === "string" ? body.signupCode : "";
  const barberId = isBarberId(body?.barberId) ? body.barberId : null;

  if (!env.STAFF_SIGNUP_CODE || !env.STAFF_SESSION_SECRET) {
    throw new ApiBookingError("CONFIGURATION_ERROR", 500);
  }

  if (signupCode !== env.STAFF_SIGNUP_CODE) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  if (!email.includes("@") || password.length < PASSWORD_MIN_LENGTH || displayName.length < 2) {
    throw new ApiBookingError("INVALID_REQUEST", 400);
  }

  const nowIso = new Date().toISOString();
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const passwordSalt = bytesToHex(saltBytes);
  const passwordHash = await hashPassword(password, passwordSalt);

  try {
    await getDatabase(env).prepare(
      `INSERT INTO staff_users (
        email, display_name, barber_id, password_hash, password_salt, iterations, role, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'staff', 'active', ?, ?)`,
    )
      .bind(email, displayName, barberId, passwordHash, passwordSalt, PASSWORD_ITERATIONS, nowIso, nowIso)
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("unique") || message.includes("constraint")) {
      throw new ApiBookingError("EMAIL_EXISTS", 409);
    }

    throw new ApiBookingError("BOOKING_SAVE_FAILED", 500);
  }

  return {
    email,
    displayName,
    barberId,
    role: "staff" as const,
  };
}

export async function verifyStaffLogin(env: CloudflareEnv, payload: unknown) {
  const body = payload as { email?: unknown; password?: unknown } | null;
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!env.STAFF_SESSION_SECRET) {
    throw new ApiBookingError("CONFIGURATION_ERROR", 500);
  }

  if (!email || !password) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  const user = await getDatabase(env).prepare("SELECT * FROM staff_users WHERE email = ? AND status = 'active'")
    .bind(email)
    .first<StaffUserRow>();

  if (!user) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  const nextHash = await hashPassword(password, user.password_salt, user.iterations);

  if (!constantTimeEqual(nextHash, user.password_hash)) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  return {
    email: user.email,
    displayName: user.display_name,
    barberId: user.barber_id,
    role: user.role,
  };
}
