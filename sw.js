// Shell aplikasi disimpan di perangkat. Permintaan ke Apps Script tidak pernah di-cache.
const CACHE = 'pkf-984a1fb5f2';
const SHELL = ['./', './index.html', './style.css?v=984a1fb5f2', './app.js?v=984a1fb5f2', './config.js?v=984a1fb5f2', './manifest.json', './icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('pkf-') && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || /script\.google(usercontent)?\.com$/.test(u.hostname)) return;
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).catch(() => caches.match('./index.html'))); return; }
  if (u.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname) || u.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); } return r; })));
  }
});