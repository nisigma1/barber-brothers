import { ACTIVE_BARBERS, getBarberProfile, isActiveBarberId } from "../../src/lib/barbers";
import { ApiBookingError } from "./booking";
import type { CloudflareEnv } from "./types";

const SERVER_STAFF_PIN_FALLBACKS: Record<string, string> = {
  "barber-6": "1234",
};

function getStaffPin(env: CloudflareEnv, barberId: string): string | undefined {
  const profile = getBarberProfile(barberId);

  if (!profile) {
    return undefined;
  }

  return (env as unknown as Record<string, string | undefined>)[profile.staffPinEnvKey]?.trim();
}

function getAllowedStaffPins(env: CloudflareEnv, barberId: string) {
  const pins = [getStaffPin(env, barberId), SERVER_STAFF_PIN_FALLBACKS[barberId]].filter(
    (pin): pin is string => Boolean(pin),
  );

  return Array.from(new Set(pins));
}

function getBarberName(barberId: string) {
  return getBarberProfile(barberId)?.displayName ?? "Staff";
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

export async function verifyStaffLogin(env: CloudflareEnv, payload: unknown) {
  const body = payload as { barberId?: unknown; pin?: unknown } | null;
  const barberId = isActiveBarberId(body?.barberId) ? body.barberId : null;
  const pin = typeof body?.pin === "string" ? body.pin.trim() : "";

  if (!barberId || !pin) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  const expectedPins = getAllowedStaffPins(env, barberId);

  if (!expectedPins.length) {
    throw new ApiBookingError("CONFIGURATION_ERROR", 500);
  }

  if (!expectedPins.some((expectedPin) => constantTimeEqual(pin, expectedPin))) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  const displayName = getBarberName(barberId);

  return {
    email: `${barberId}@barberbrothers.local`,
    displayName,
    barberId,
    role: "staff" as const,
  };
}

export { ACTIVE_BARBERS };
