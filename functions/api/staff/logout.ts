import type { PagesContext } from "../../_lib/context";
import { jsonResponse } from "../../_lib/http";
import { getClearSessionCookieHeader } from "../../_lib/session";

export const onRequestPost = async ({ request }: PagesContext) => {
  return jsonResponse(
    { ok: true },
    200,
    {
      "set-cookie": getClearSessionCookieHeader(new URL(request.url).protocol === "https:"),
    },
  );
};
