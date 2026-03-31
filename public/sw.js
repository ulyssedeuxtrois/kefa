const CACHE_STATIC = 'kefa-static-v3';
const CACHE_PAGES  = 'kefa-pages-v3';
const OFFLINE_URL  = '/offline.html';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  OFFLINE_URL,
];

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate — clear old caches ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const VALID_CACHES = [CACHE_STATIC, CACHE_PAGES];
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => !VALID_CACHES.includes(name))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // API routes: network only, offline stub on failure
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline', events: [], total: 0 }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Next.js static assets: Cache First (immutable, long TTL)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_STATIC).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // Event detail pages: Cache First with network fallback
  // Visited pages stay available offline indefinitely
  if (url.pathname.startsWith('/events/')) {
    event.respondWith(
      caches.open(CACHE_PAGES).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) {
            // Revalidate in background so next visit is fresh
            fetch(request)
              .then((response) => { if (response.ok) cache.put(request, response.clone()); })
              .catch(() => {});
            return cached;
          }
          return fetch(request)
            .then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
            .catch(() => caches.match(OFFLINE_URL));
        })
      )
    );
    return;
  }

  // Homepage: Network First (fresh data when online, cached when offline)
  if (url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_PAGES).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // All other pages: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_PAGES).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached || caches.match(OFFLINE_URL));

        return cached || fetchPromise;
      })
    )
  );
});

// ─── Push notifications ────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Kefa', {
      body: data.body || 'Nouvel événement près de toi !',
      icon: '/icon.svg',
      badge: '/icon.svg',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const client = clientList.find((c) => c.url === url && 'focus' in c);
      if (client) return client.focus();
      return clients.openWindow(url);
    })
  );
});
