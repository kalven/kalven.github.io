const CACHE_NAME = 'v1';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(addResourcesToCache([
    '/vq/',
    '/vq/app.js',
  ]));
});

self.addEventListener('fetch', (event) => {
  // Try to service the request from the cache. Even if the resource is found in
  // the cache, the network is queried in the background and the cache is
  // updated.
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    return cache.match(event.request).then((cachedResponse) => {
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      });

      return cachedResponse || fetchedResponse;
    });
  }));
});
