import { ApiBookingError, cancelBookingByToken } from "../../_lib/booking";
import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { enforceRateLimit, getClientIp } from "../../_lib/rate-limit";
import type { ApiErrorCode } from "../../../src/lib/booking/types";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const body = await readJson(request) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  try {
    await enforceRateLimit(env, `cancel:ip:${getClientIp(request)}`, 12, 60);

    const result = await cancelBookingByToken(env, token);

    return jsonResponse(result);
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
