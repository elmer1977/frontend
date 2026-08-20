// Placeholder for Firebase push, not used in this project.
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'New Notification', body: 'You have a new message.' };
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url || '/',
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});