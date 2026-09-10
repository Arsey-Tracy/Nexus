// Minimal service worker for caching static assets to enable basic PWA installability
const CACHE_NAME = 'nexus-static-v1';
const PRECACHE_URLS = [
  '/',
  '/site.webmanifest',
  '/manifest.json',
  '/manifest-admin.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const isPublicSameOriginRequest =
    event.request.method === 'GET' &&
    requestUrl.origin === self.location.origin &&
    !requestUrl.pathname.startsWith('/api/') &&
    !event.request.headers.has('Authorization');

  // Never cache API responses or requests carrying user credentials.
  if (!isPublicSameOriginRequest) return;

  // For navigation requests, try network-first then fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // Public static assets can use the cache without sharing user-specific data.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
