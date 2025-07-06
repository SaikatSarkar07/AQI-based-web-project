// Service Worker for offline functionality and notifications
const CACHE_NAME = 'aqi-monitor-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'buy-mask') {
    // Open Amazon search for N95 masks
    event.waitUntil(
      clients.openWindow('https://www.amazon.com/s?k=n95+mask&ref=nb_sb_noss')
    )
  } else {
    // Focus the app window
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
    )
  }
})

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Background sync triggered')
}

// Push notification event
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Check AQI',
          icon: '/vite.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/vite.svg'
        }
      ]
    }
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})