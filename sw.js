// Service Worker per notifiche push

self.addEventListener('install', event => {
  // Attiva subito il nuovo SW senza attendere
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Prende il controllo immediatamente
  event.waitUntil(self.clients.claim());
});

// Gestione delle notifiche push
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Notifica", body: event.data.text() };
    }
  }

  const title = data.title || "Aggiornamento";
  const options = {
    body: data.body || "Hai un nuovo aggiornamento",
    icon: "icons8-unicorno-16.png", // icona della notifica
    badge: "icons8-unicorno-16.png" // icona piccola
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestione click sulla notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // apre la home del sito
  );
});
