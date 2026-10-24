const CACHE_STATIC_NAME = 'kusinakita-static-v2';
const CACHE_IMAGES_NAME = 'kusinakita-images-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon-apple-touch-icon.png',
  '/favicon-512x512.png',
  '/brand-logo-main.png',
  '/brand-logo-horizontal.png',
  '/brand-logo-carinderia.png',
  '/app-icon-180x180.png',
  '/app-icon-192x192.png',
  '/app-icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_IMAGES_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. API Calls: Network-first with offline fallback JSON
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response(
          JSON.stringify({
            success: false,
            offline: true,
            error: 'Naka-offline mode ka sa palengke. I-save muna sa lokal o subukan muli pag may signal.'
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          }
        );
      })
    );
    return;
  }

  // 2. Images (Local or Unsplash CDN): Cache-first with dynamic caching
  const isImage = req.destination === 'image' ||
    url.hostname.includes('unsplash.com') ||
    /\.(png|jpe?g|webp|svg|gif|ico)$/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;

        return fetch(req).then((networkRes) => {
          if (!networkRes || networkRes.status !== 200) {
            return networkRes;
          }
          const clone = networkRes.clone();
          caches.open(CACHE_IMAGES_NAME).then((cache) => {
            cache.put(req, clone);
          });
          return networkRes;
        }).catch(() => {
          // Fallback to static app icon if offline and uncached
          return caches.match('/app-icon-192x192.png');
        });
      })
    );
    return;
  }

  // 3. Navigation (HTML pages): Network-first falling back to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_STATIC_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  // 4. Static JS/CSS/Fonts: Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_STATIC_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
