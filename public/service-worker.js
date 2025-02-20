importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

workbox.precaching.precacheAndRoute([
  { url: "/index.html", revision: null },
  { url: "/css/styles.css", revision: null },
  { url: "/js/app.js", revision: null },
  { url: "/js/nfc.js", revision: null },
  { url: "/js/auth.js", revision: null },
  { url: "/manifest.json", revision: null },
]);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.NetworkFirst()
);
