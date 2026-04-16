const CACHE = 'seeing-clearly-v7';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  // Cache assets but DO NOT skipWaiting — wait for user to tap Update
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Do NOT call self.skipWaiting() here — that caused the banner to flash and disappear
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Only skip waiting when user explicitly taps Update
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
