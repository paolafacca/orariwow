self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Notifica", {
      body: data.body || "Hai un aggiornamento",
      icon: "icons8-unicorno-16.png"
    })
  );
});
