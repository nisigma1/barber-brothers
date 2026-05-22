"use client";

import type {
  ApiErrorCode,
  AvailabilitySlot,
  BookingSummary,
  PublicBookingPayload,
  ServiceId,
  StaffBookingItem,
} from "@/lib/booking/types";

type ApiErrorBody = {
  code?: ApiErrorCode;
};

const API_TIMEOUT_MS = 12_000;

export class ClientBookingError extends Error {
  code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function parseErrorCode(response: Response): Promise<ApiErrorCode> {
  try {
    const body = await response.json() as ApiErrorBody;

    return body.code ?? "BOOKING_SAVE_FAILED";
  } catch {
    return "BOOKING_SAVE_FAILED";
  }
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(input, {
      credentials: "include",
      ...init,
      signal: init?.signal ?? controller.signal,
      headers: {
        "content-type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ClientBookingError("BOOKING_SAVE_FAILED", "BOOKING_SAVE_FAILED");
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    const code = await parseErrorCode(response);
    throw new ClientBookingError(code, code);
  }

  return response.json() as Promise<T>;
}

export async function getClientAvailability(
  barberId: PublicBookingPayload["barberId"],
  localDate: string,
  serviceIds: ServiceId[],
) {
  const params = new URLSearchParams({ barberId, localDate });
  serviceIds.forEach((serviceId) => params.append("serviceIds", serviceId));
  const body = await fetchJson<{ slots: AvailabilitySlot[] }>(`/api/availability?${params.toString()}`);

  return body.slots;
}

export async function createClientBooking(payload: unknown) {
  const body = await fetchJson<{ booking: BookingSummary }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return body.booking;
}

export async function staffLogin(barberId: PublicBookingPayload["barberId"], pin: string) {
  await fetchJson<{ ok: true }>("/api/staff/login", {
    method: "POST",
    body: JSON.stringify({ barberId, pin }),
  });
}

export async function staffLogout() {
  await fetchJson<{ ok: true }>("/api/staff/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function listClientStaffBookings() {
  const body = await fetchJson<{ bookings: StaffBookingItem[] }>("/api/staff/bookings");

  return body.bookings;
}

export async function softDeleteClientBooking(booking: StaffBookingItem) {
  await fetchJson<{ ok: true }>("/api/staff/bookings", {
    method: "POST",
    body: JSON.stringify({ bookingId: booking.bookingId }),
  });
}

export async function cancelClientBooking(token: string) {
  const body = await fetchJson<{ ok: true; bookingId: string }>("/api/bookings/cancel", {
    method: "POST",
    body: JSON.stringify({ token }),
  });

  return body;
}
