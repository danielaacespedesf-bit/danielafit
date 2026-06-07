const CACHE_NAME = 'danielafit-cache-v5.0.0';
const ASSETS = [
  './',
  './index.html?v=5.0.0',
  './styles.css?v=5.0.0',
  './app.js?v=5.0.0',
  './manifest.json?v=5.0.0',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key.startsWith('danielafit-cache') && key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppShell = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/app.js') || url.pathname.endsWith('/styles.css') || url.pathname.endsWith('/manifest.json');
  if (isAppShell) {
    event.respondWith(fetch(event.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html?v=5.0.0'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
    return response;
  }).catch(() => caches.match('./index.html?v=5.0.0'))));
});
