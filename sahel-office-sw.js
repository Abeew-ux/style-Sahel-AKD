// Sahel AKD : service worker minimal (réseau d'abord, copie hors-ligne de la page seulement).
// Il ne met jamais en cache les données : suivi et office restent toujours à jour.
const CACHE = 'sahel-office-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.mode !== 'navigate') return;
  e.respondWith(fetch(r).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(r, copy)).catch(() => {});
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
