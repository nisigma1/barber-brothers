type MiddlewareContext = {
  request: Request;
  next: () => Promise<Response>;
};

const retiredAssetPaths = new Set([
  "/brand/edi.jpeg",
  "/brand/edi.webp",
  "/brand/hero-logo.png",
]);

export const onRequest = async ({ request, next }: MiddlewareContext) => {
  const url = new URL(request.url);

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
