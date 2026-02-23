const CACHE_NAME = "lanterna-v2";

const BASE_PATH = "/Lanterna/";

const ASSETS = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.json",
  BASE_PATH + "favicon.png",
  BASE_PATH + "icon-192.png",
  BASE_PATH + "icon-512.png",
  BASE_PATH + "assets/index-30iuQsEI.js",
  BASE_PATH + "assets/index-iDWLMtH_.css"
];

// INSTALAÇÃO
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ATIVAÇÃO
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Se for navegação (abrir página)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(BASE_PATH + "index.html"))
    );
    return;
  }

  // Para arquivos estáticos
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
