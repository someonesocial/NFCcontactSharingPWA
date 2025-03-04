importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// Cache-Namen definieren
const CACHE_NAME = "nfc-contacts-v1";

// Zu cachende Dateien
const RESOURCES_TO_CACHE = [
  "/",
  "/index.html",
  "/contact.html",
  "/css/main.css",
  "/js/app.js",
  "/js/contacts.js",
  "/js/firebase-config.js",
  "/js/view-contact.js",
  "/manifest.json",
];

// Installationsphase - Cache füllen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );
});

// Wenn online, verwende das Netzwerk und aktualisiere den Cache
// Wenn offline, verwende den Cache
workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.NetworkFirst({
    cacheName: "pages-cache",
  })
);

// CSS, JS und Webfont-Dateien aus dem Cache laden und im Hintergrund aktualisieren
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets-cache",
  })
);

// Bilder aus dem Cache laden
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: "images-cache",
  })
);

// Fallback-Seite für Navigationsanfragen im Offline-Zustand
workbox.routing.setCatchHandler(({ event }) => {
  if (event.request.destination === "document") {
    return caches.match("/index.html");
  }
  return Response.error();
});
