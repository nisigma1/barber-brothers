import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse } from "../../_lib/http";
import { requireStaffSession } from "../../_lib/session";
import { getBarberProfile, isActiveBarberId } from "../../../src/lib/barbers";

export const onRequestGet = async ({ env, request }: PagesContext) => {
  const session = await requireStaffSession(request, env);

  if (!session || !isActiveBarberId(session.barberId)) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  const profile = getBarberProfile(session.barberId);

  return jsonResponse({
    session: {
      barberId: session.barberId,
      displayName: profile?.displayName ?? "Staff",
    },
  });
};
