import type { PagesContext } from "../../_lib/context";
import { errorResponse, jsonResponse, readJson } from "../../_lib/http";
import { getSessionCookieHeader } from "../../_lib/session";

export const onRequestPost = async ({ env, request }: PagesContext) => {
  const body = await readJson(request) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const configuredEmail = (env.STAFF_LOGIN_EMAIL ?? "staff@barberbrothers.com").toLowerCase();

  if (!env.STAFF_LOGIN_PASSWORD || !env.STAFF_SESSION_SECRET) {
    return errorResponse("CONFIGURATION_ERROR", 500);
  }

  if (email !== configuredEmail || password !== env.STAFF_LOGIN_PASSWORD) {
    return errorResponse("UNAUTHORIZED", 401);
  }

  return jsonResponse(
    { ok: true },
    200,
    {
      "set-cookie": await getSessionCookieHeader(
        configuredEmail,
        env.STAFF_SESSION_SECRET,
        new URL(request.url).protocol === "https:",
      ),
    },
  );
};
