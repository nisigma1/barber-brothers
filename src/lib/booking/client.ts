"use client";

import type {
  ApiErrorCode,
  AvailabilitySlot,
  BookingSummary,
  PublicBookingPayload,
  StaffBookingItem,
} from "@/lib/booking/types";

type ApiErrorBody = {
  code?: ApiErrorCode;
};

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
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const code = await parseErrorCode(response);
    throw new ClientBookingError(code, code);
  }

  return response.json() as Promise<T>;
}

export async function getClientAvailability(barberId: PublicBookingPayload["barberId"], localDate: string) {
  const params = new URLSearchParams({ barberId, localDate });
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

export async function staffLogin(email: string, password: string) {
  await fetchJson<{ ok: true }>("/api/staff/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function staffSignup(payload: {
  email: string;
  password: string;
  displayName: string;
  barberId: PublicBookingPayload["barberId"] | "";
  signupCode: string;
}) {
  await fetchJson<{ ok: true }>("/api/staff/signup", {
    method: "POST",
    body: JSON.stringify(payload),
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
