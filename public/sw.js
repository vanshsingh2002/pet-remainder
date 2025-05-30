self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pet-remainder-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        // Add other assets you want to cache
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
}); 