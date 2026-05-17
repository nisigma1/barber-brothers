import { withSecurityHeaders } from "./_lib/headers";

const LOCK_COOKIE = "bb_preview_access";
const LOCK_PIN = "9090";
const LOCK_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const PUBLIC_PATHS = new Set(["/preview", "/googlea3dcd0a38a812f73.html"]);
const PUBLIC_PREFIXES = ["/_next/", "/brand/"];
const PUBLIC_FILE_EXTENSIONS = /\.(?:ico|png|jpg|jpeg|webp|svg|css|js|txt|xml|json|webmanifest)$/i;

type MiddlewareContext = {
  next: () => Promise<Response>;
  request: Request;
};

function hasAccessCookie(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${LOCK_COOKIE}=granted`);
}

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_FILE_EXTENSIONS.test(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

function safeNextPath(value: FormDataEntryValue | string | null) {
  const nextPath = typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";

  return nextPath === "/preview" || nextPath === "/unlock" ? "/" : nextPath;
}

function redirectToPreview(url: URL) {
  const previewUrl = new URL("/preview", url.origin);
  previewUrl.searchParams.set("next", `${url.pathname}${url.search}`);

  return new Response(null, {
    status: 302,
    headers: withSecurityHeaders({ location: previewUrl.toString() }),
  });
}

function apiLockedResponse() {
  return new Response(JSON.stringify({ code: "UNAUTHORIZED" }), {
    status: 401,
    headers: withSecurityHeaders({ "content-type": "application/json; charset=utf-8" }),
  });
}

export const onRequest = async ({ next, request }: MiddlewareContext) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === "/unlock" && request.method === "POST") {
    const formData = await request.formData();
    const pin = String(formData.get("pin") ?? "").trim();
    const nextPath = safeNextPath(formData.get("next"));

    if (pin === LOCK_PIN) {
      const secureCookie = url.protocol === "https:" ? "; Secure" : "";

      return new Response(null, {
        status: 302,
        headers: withSecurityHeaders({
          location: new URL(nextPath, url.origin).toString(),
          "set-cookie": `${LOCK_COOKIE}=granted; Path=/; HttpOnly; SameSite=Lax; Max-Age=${LOCK_MAX_AGE_SECONDS}${secureCookie}`,
        }),
      });
    }

    const previewUrl = new URL("/preview", url.origin);
    previewUrl.searchParams.set("error", "1");
    previewUrl.searchParams.set("next", nextPath);

    return new Response(null, {
      status: 302,
      headers: withSecurityHeaders({ location: previewUrl.toString() }),
    });
  }

  if (isPublicPath(pathname) || hasAccessCookie(request)) {
    return next();
  }

  if (pathname.startsWith("/api/")) {
    return apiLockedResponse();
  }

  return redirectToPreview(url);
};
