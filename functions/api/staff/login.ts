import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { getSessionCookieHeader } from "../../_lib/session";
import { verifyStaffLogin } from "../../_lib/staff-users";
import { ApiBookingError } from "../../_lib/booking";
import type { ApiErrorCode } from "../../../src/lib/booking/types";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const body = await readJson(request);

  try {
    const user = await verifyStaffLogin(env, body);

    return jsonResponse(
      { ok: true },
      200,
      {
        "set-cookie": await getSessionCookieHeader(
          { email: user.email, displayName: user.displayName, barberId: user.barberId, role: user.role },
          env.STAFF_SESSION_SECRET ?? "",
          new URL(request.url).protocol === "https:",
        ),
      },
    );
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("UNAUTHORIZED", 401);
  }
};
