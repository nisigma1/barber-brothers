import { ApiBookingError, getAvailability } from "../_lib/booking";
import type { PagesContext } from "../_lib/context";
import { errorResponse, jsonResponse } from "../_lib/http";
import { availabilityQuerySchema } from "../../src/lib/booking/validation";
import type { ApiErrorCode } from "../../src/lib/booking/types";

export const onRequestGet = async ({ env, request }: PagesContext) => {
  const url = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    barberId: url.searchParams.get("barberId"),
    localDate: url.searchParams.get("localDate"),
  });

  if (!parsed.success) {
    return errorResponse("INVALID_REQUEST", 400);
  }

  try {
    const slots = await getAvailability(env, parsed.data.barberId, parsed.data.localDate);

    return jsonResponse({ slots });
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
