/* Merge și fără internet după prima vizită. Rețeaua are prioritate, ca modificările noi să apară imediat;
   fără rețea, se folosește copia salvată. PDF-urile nu se salvează (sunt mari). */
const CACHE = "music-hub-v1";
const CORE = [
  "./", "index.html", "css/app.css", "manifest.webmanifest",
  "js/core.js", "js/themes.js", "js/games.js", "js/sheets.js", "js/app.js",
  "icons/icon-192.png", "icons/icon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!fonts && url.origin !== self.location.origin) return;
  if (url.pathname.endsWith(".pdf")) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
  );
});
