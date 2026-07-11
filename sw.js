const CACHE = 'lvlup-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// сеть в приоритете; cache:'no-cache' заставляет сверяться с сервером,
// иначе GitHub Pages (max-age=600) подсовывает старую версию из HTTP-кэша
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
