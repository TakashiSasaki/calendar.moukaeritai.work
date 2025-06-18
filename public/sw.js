const CACHE_NAME = 'calendar-link-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/icon-192x192.png', // アイコンをキャッシュ対象に含める
    '/icon-512x512.png'  // アイコンをキャッシュ対象に含める
];

// Service Workerのインストール処理
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Service Workerの有効化と古いキャッシュの削除
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// fetchイベントのハンドリング（キャッシュ優先）
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュにヒットすれば、それを返す
                if (response) {
                    return response;
                }
                // キャッシュになければ、ネットワークから取得する
                return fetch(event.request);
            })
    );
});