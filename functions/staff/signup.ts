import type { PagesContext } from "../_lib/context";
import { redirectResponse } from "../_lib/headers";

function redirectToStaffLogin({ request }: PagesContext) {
  const url = new URL(request.url);
  url.pathname = "/staff/login";
  url.search = "";

  return redirectResponse(url.toString());
}

export const onRequestGet = redirectToStaffLogin;
export const onRequestHead = redirectToStaffLogin;
