import { ApiBookingError, createBooking } from "../_lib/booking";
import type { PagesContext } from "../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../_lib/http";
import { enforceRateLimit, getClientIp } from "../_lib/rate-limit";
import type { ApiErrorCode } from "../../src/lib/booking/types";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const body = await readJson(request);

  try {
    await enforceRateLimit(env, `booking:ip:${getClientIp(request)}`, 24, 60);

    const booking = await createBooking(env, body);

    return jsonResponse({ booking }, 201);
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
