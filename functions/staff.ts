import type { PagesContext } from "./_lib/context";
import { requireStaffSession } from "./_lib/session";

async function staffRedirect({ env, request }: PagesContext) {
  const url = new URL(request.url);
  const session = await requireStaffSession(request, env);

  url.pathname = session ? "/staff/bookings" : "/staff/login";
  url.search = "";

  return Response.redirect(url.toString(), 302);
}

export const onRequestGet = staffRedirect;
export const onRequestHead = staffRedirect;
