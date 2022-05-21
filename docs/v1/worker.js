self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('ittybitty-v1').then(function(cache) {
     return cache.addAll([
       '/',
       '/favicon.ico'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.debug("Requested", event.request.url, response);

      return response || fetch(event.request);
    })
  );
 });