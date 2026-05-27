// Barber Brothers — Service Worker
// Minimal, production-safe cache layer. Keeps the staff/booking shell
// fast on reopen from the homescreen without ever caching authed API
// responses or user data.

const CACHE_NAME = "bb-shell-v4";

const SHELL_URLS = [
  "/",
  "/booking",
  "/staff",
  "/staff/login",
  "/staff/bookings",
  "/site.webmanifest",
  "/brand/barber-brothers-logo-192.png",
  "/brand/barber-brothers-logo-512.png",
  "/favicon.ico",
  "/favicon-192x192.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(SHELL_URLS).catch(() => {
        // ignore individual failures so the SW still installs
        return undefined;
      }),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name !== CACHE_NAME && name.startsWith("bb-"))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Same-origin only
  if (url.origin !== self.location.origin) {
    return;
  }

  // NEVER cache API or auth-sensitive endpoints
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/data/")
  ) {
    return;
  }

  // Navigation requests: network-first with cached shell fallback so the
  // homescreen reopen still resolves instantly when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);

          if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone()).catch(() => undefined);
          }

          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(request);

          if (cached) {
            return cached;
          }

          const fallback = await cache.match("/");

          if (fallback) {
            return fallback;
          }

          return new Response("Offline", { status: 503, statusText: "Offline" });
        }
      })(),
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/brand/") ||
    /\.(?:css|js|woff2?|ttf|png|jpg|jpeg|webp|svg|ico|json)$/i.test(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);

        const fetchAndUpdate = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone()).catch(() => undefined);
            }
            return response;
          })
          .catch(() => cached);

        return cached ?? fetchAndUpdate;
      })(),
    );
  }
});
