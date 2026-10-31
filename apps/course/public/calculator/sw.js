// Copyright © 2026 Christopher Snow
// This worker owns only this calculator's cache and URL scope.
const PREFIX = 'bit-lab-calculator:' + self.registration.scope + ':';
const CACHE = PREFIX + 'v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-192-maskable.png', './icon-512-maskable.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      return await cache.match(event.request) || new Response('This page has not been saved offline yet. Reconnect to open it.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  }));
});
