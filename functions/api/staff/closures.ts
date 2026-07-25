import {
  ApiBookingError,
  deleteBarberDayClosure,
  upsertBarberDayClosure,
} from "../../_lib/booking";
import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { requireStaffSession } from "../../_lib/session";
import { isActiveBarberId } from "../../../src/lib/barbers";
import type { ApiErrorCode } from "../../../src/lib/booking/types";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const session = await requireStaffSession(request, env);

  if (!session || !isActiveBarberId(session.barberId)) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  try {
    const closure = await upsertBarberDayClosure(env, session.barberId, await readJson(request));
    return jsonResponse({ closure });
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};

export const onRequestDelete = async ({ env, request }: PagesContext) => {
  const session = await requireStaffSession(request, env);

  if (!session || !isActiveBarberId(session.barberId)) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  try {
    await deleteBarberDayClosure(env, session.barberId, await readJson(request));
    return jsonResponse({ ok: true });
  } catch (error) {
    if (error instanceof ApiBookingError) {
      return errorResponse(error.code as ApiErrorCode, error.status);
    }

    return errorResponse("BOOKING_SAVE_FAILED", 500);
  }
};
