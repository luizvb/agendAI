self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png',
                // Adicione outros recursos que você deseja armazenar em cache
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
