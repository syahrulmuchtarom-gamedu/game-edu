const CACHE_NAME = 'educational-games-v1';
const urlsToCache = [
  '/',
  '/games/math-adventure',
  '/games/memory-animals',
  '/games/spelling-game',
  '/games/color-patterns',
  '/games/count-fruits',
  '/games/interactive-story',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});