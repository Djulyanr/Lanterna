const CACHE_NAME = "lanterna-v1";
// Adicione o index.html e o favicon que estavam faltando
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  // O skipWaiting faz com que o novo SW assuma o controle imediatamente
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Limpa caches antigos para não ocupar espaço desnecessário
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
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Estratégia: Tenta o cache, se não tiver, busca na rede
      return response || fetch(event.request);
    })
  );
});
