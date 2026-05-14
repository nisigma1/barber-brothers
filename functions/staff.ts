import type { PagesContext } from "./_lib/context";
import { redirectResponse } from "./_lib/headers";
import { requireStaffSession } from "./_lib/session";

async function staffRedirect({ env, request }: PagesContext) {
  const url = new URL(request.url);
  const session = await requireStaffSession(request, env);

  url.pathname = session ? "/staff/bookings" : "/staff/login";
  url.search = "";

  return redirectResponse(url.toString());
}

export const onRequestGet = staffRedirect;
export const onRequestHead = staffRedirect;
