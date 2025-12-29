const CACHE_NAME = 'alpine-ski-app-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/alpine-ski-icon.png',
        '/alpine-ski-badge.png'
      ]);
    })
  );
});

self.addEventListener('push', (event) => {
  if (event.data) {
    const notification = event.data.json();
    
    const options = {
      body: notification.message,
      icon: '/alpine-ski-icon.png',
      badge: '/alpine-ski-badge.png',
      tag: notification.raceId,
      data: notification.data,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification(notification.title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const raceId = event.notification.data?.raceId;
    const locationId = event.notification.data?.locationId;
    
    event.waitUntil(
      clients.openWindow(`/?race=${raceId}&location=${locationId}`)
    );
  }
});

self.addEventListener('notificationclose', (event) => {
  // Track notification dismissals if needed
  console.log('Notification closed:', event.notification.tag);
});