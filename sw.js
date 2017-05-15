var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/main.css',
  'https://fonts.gstatic.com/s/oswald/v13/pEobIV_lL25TKBpqVI_a2w.woff2',
  // '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache.map(function(urlToPrefetch) {
              return new Request(urlToPrefetch, { mode: 'cors' });
            })).then(function() {
              console.log('All resources have been fetched and cached.');
            });
          })
  );
});


self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['my-site-cache-v1'];

  event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.map(function(cacheName) {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
        );
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request)
          .then(function(response) {
                // Cache hit - return response
                if (response) {
                  return response;
                }
                return fetch(event.request);
              }
          )
  );
});