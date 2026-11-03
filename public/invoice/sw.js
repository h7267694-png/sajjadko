// عمل التطبيق بدون إنترنت: الشبكة أولًا، والنسخة المحفوظة عند انقطاع الاتصال
const CACHE = 'sajjadko-invoice-v3';
const ASSETS = ['/invoice/', '/invoice/config.js?v=5', '/invoice/app.js?v=5', '/invoice/invoice.css?v=5', '/invoice/codes.json', '/invoice/vendor/qrcode.js', '/invoice/vendor/modern-screenshot.js', '/invoice/vendor/html2canvas.min.js', '/invoice/vendor/jspdf.umd.min.js', '/fonts/alexandria-arabic.woff2', '/fonts/alexandria-latin.woff2', '/brand/icon-192.png', '/brand/icon-512.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
