import { ApiBookingError, listStaffBookings, softDeleteBooking } from "../../_lib/booking";
import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { requireStaffSession } from "../../_lib/session";
import type { ApiErrorCode } from "../../../src/lib/booking/types";

export const onRequestGet = async ({ env, request }: PagesContext) => {
  const session = await requireStaffSession(request, env);

  if (!session) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  return jsonResponse({ bookings: await listStaffBookings(env) });
};

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const session = await requireStaffSession(request, env);

  if (!session) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  const body = await readJson(request) as { bookingId?: unknown } | null;
  const bookingId = typeof body?.bookingId === "string" ? body.bookingId : "";

  if (!bookingId) {
    return errorResponse("INVALID_REQUEST", 400);
  }

  try {
    await softDeleteBooking(env, bookingId);

    return jsonResponse({ ok: true });
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
