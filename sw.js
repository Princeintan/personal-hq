const CACHE_NAME = 'hq-engine-v1';
const ASSETS = [
  './',
  './index.html',
  './assets/js/app.js',
  './assets/js/db.js',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate and clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
      );
    })
  );
});

// Network First, falling back to cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});