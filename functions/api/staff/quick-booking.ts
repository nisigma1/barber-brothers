import { ApiBookingError, createStaffQuickBooking } from "../../_lib/booking";
import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { enforceRateLimit, getClientIp } from "../../_lib/rate-limit";
import { requireStaffSession } from "../../_lib/session";
import { isActiveBarberId } from "../../../src/lib/barbers";
import type { ApiErrorCode } from "../../../src/lib/booking/types";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const session = await requireStaffSession(request, env);

  if (!session) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  if (!isActiveBarberId(session.barberId)) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  try {
    await enforceRateLimit(env, `quickbook:ip:${getClientIp(request)}`, 30, 60);

    const body = await readJson(request);
    const booking = await createStaffQuickBooking(env, session.barberId, body);

    return jsonResponse({ booking }, 201);
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
