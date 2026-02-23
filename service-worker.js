const CACHE_NAME = "lanterna-v3";
const BASE_PATH = "/Lanterna/";

// INSTALAÇÃO
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ATIVAÇÃO
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// FETCH
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Intercepta apenas navegação principal
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(BASE_PATH + "index.html")
      )
    );
  }
});
