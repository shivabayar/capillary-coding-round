/**
 * Service worker implementation
 */
const staticCacheName = 'capillary-v1';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName)
		.then(function(cache) {
			return cache.addAll([
				'./index.html',
                './styles/main.css',
                './styles/responsive.css',
				'./sw_register.js',
				'./data/games.json'
			]);
        })
        .catch(error => console.error(error))
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('capillary-') &&
						   cacheName != staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
        })
        .catch(error => console.error(error))
	);
})

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			return response || fetch(event.request);
        })
        .catch(error => console.error(error))
	);
});
