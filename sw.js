// Ascolta l'evento push inviato dal Worker
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
    icon: "icons8-unicorno-16.png",   // metti qui la tua icona
    badge: "icons8-unicorno-16.png"   // opzionale, piccola icona
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestisce il click sulla notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // apre la tua pagina principale
  );
});
