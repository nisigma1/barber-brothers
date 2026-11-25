import { errorResponse } from "./_lib/http";

type MiddlewareContext = {
  request: Request;
  next: () => Promise<Response>;
};

const retiredAssetPaths = new Set([
  "/brand/edi.jpeg",
  "/brand/edi.webp",
  "/brand/hero-logo.png",
]);

const productionHosts = new Set([
  "barberbrothers.style",
  "www.barberbrothers.style",
  "barber-brothers-qeta.pages.dev",
]);

export const onRequest = async ({ request, next }: MiddlewareContext) => {
  const url = new URL(request.url);
  if (url.protocol === "https:" && url.pathname.startsWith("/api/")
    && request.method !== "GET" && request.method !== "HEAD"
    && !productionHosts.has(url.hostname)) {
    return errorResponse("BOOKING_SAVE_FAILED", 503);
  }


  if (retiredAssetPaths.has(url.pathname)) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return next();
};
