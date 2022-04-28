self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('ittybitty').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.js',
       '/edit.html',
       '/edit.js',
       '/bitty.js',
       '/render.html',
       '/render.js',
       '/js/lzma/lzma_worker-min.js',
       '/js/lzma/lzma-d-min.js',
       '/render/bookmarklet.js',
       '/render/bookmarklet.css',
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  console.debug("Requested", event.request.url);
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
 });