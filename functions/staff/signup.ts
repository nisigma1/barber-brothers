import type { PagesContext } from "../_lib/context";

function redirectToStaffLogin({ request }: PagesContext) {
  const url = new URL(request.url);
  url.pathname = "/staff/login";
  url.search = "";

  return Response.redirect(url.toString(), 302);
}

export const onRequestGet = redirectToStaffLogin;
export const onRequestHead = redirectToStaffLogin;
