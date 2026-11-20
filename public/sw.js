/* SmartVet service worker: delivers browser push notifications. */

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = { message: event.data ? event.data.text() : '' };
    }

    const title = data.title || 'SmartVet';
    const options = {
        body: data.message || '',
        icon: '/images/VetCare.jpg',
        badge: '/images/VetCare.jpg',
        tag: data.tag || 'smartvet-notification',
        data: {
            url: data.url || '/owner/dashboard.html'
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = (event.notification.data && event.notification.data.url)
        || '/owner/dashboard.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.includes('/owner/') && 'focus' in client) {
                    return client.focus();
                }
            }

            return clients.openWindow(targetUrl);
        })
    );
});
