import { BARBERS } from "../../src/lib/constants";
import type { BarberId } from "../../src/lib/booking/types";
import { ApiBookingError } from "./booking";

const STAFF_PIN_BY_BARBER: Record<BarberId, string> = {
  "barber-1": "1313",
  "barber-2": "1212",
};

function isBarberId(value: unknown): value is BarberId {
  return value === "barber-1" || value === "barber-2";
}

function getBarberName(barberId: BarberId) {
  return BARBERS.find((barber) => barber.id === barberId)?.name ?? "Staff";
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

export async function verifyStaffLogin(_env: unknown, payload: unknown) {
  const body = payload as { barberId?: unknown; pin?: unknown } | null;
  const barberId = isBarberId(body?.barberId) ? body.barberId : null;
  const pin = typeof body?.pin === "string" ? body.pin.trim() : "";

  if (!barberId || !pin) {
    throw new ApiBookingError("UNAUTHORIZED", 401);
  }

  if (!constantTimeEqual(pin, STAFF_PIN_BY_BARBER[barberId])) {
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
