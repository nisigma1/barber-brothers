import { ApiBookingError } from "../../_lib/booking";
import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { getSessionCookieHeader } from "../../_lib/session";
import { createStaffUser } from "../../_lib/staff-users";
import type { ApiErrorCode } from "../../../src/lib/booking/types";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const body = await readJson(request);

  try {
    const user = await createStaffUser(env, body);

    return jsonResponse(
      { ok: true },
      201,
      {
        "set-cookie": await getSessionCookieHeader(
          { email: user.email, displayName: user.displayName, role: user.role },
          env.STAFF_SESSION_SECRET ?? "",
          new URL(request.url).protocol === "https:",
        ),
      },
    );
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
