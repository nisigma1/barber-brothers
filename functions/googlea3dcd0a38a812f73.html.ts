export function onRequest() {
  return new Response("google-site-verification: googlea3dcd0a38a812f73.html", {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
