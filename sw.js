const CACHE_NAME = 'Finki';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',

  '/logo.png',
  '/user.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Montserrat:wght@600;700;800&display=swap',
  'https://geo.dailymotion.com/player.html?video=x9n2qyk',
  'https://geo.dailymotion.com/player.html?video=x8eimg9',
  'https://geo.dailymotion.com/player.html?video=x84eirw'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First, luego Network
self.addEventListener('fetch', event => {
  // Excluir las peticiones a los iframes de video
  if (event.request.url.includes('geo.dailymotion.com')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

