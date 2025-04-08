// Diese Workbox-Imports werden automatisch durch das Plugin hinzugefügt
// workbox-Präkonfiguration

// Benutzerdefinierte Cache-Konfiguration
const CACHE_NAME = "nfc-contact-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // Weitere Assets werden automatisch von Workbox verwaltet
];

// Installation des Service Workers
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache geöffnet");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Aktivierung des Service Workers
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              // Alte Caches löschen
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Der Rest des fetch-Handlings wird von Workbox übernommen
// Wir können aber zusätzliche benutzerdefinierte Logik hinzufügen
self.addEventListener("fetch", (event) => {
  // Spezifisches Handling für bestimmte Routen
  if (event.request.url.includes("/api/")) {
    // Hier könnte spezielle API-Handling-Logik stehen
    return;
  }

  // Alle anderen Anfragen werden von Workbox-Strategien verarbeitet
  // Workbox wird hier automatisch seinen Code einfügen
});
