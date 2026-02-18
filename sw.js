// Mostra le notifiche push (se mai inviate)
self.addEventListener("push", (event) => {
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
    icon: "icons8-unicorn-neon-96.png",
    badge: "icons8-unicorn-neon-70.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Quando clicchi la notifica
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Apre la home rispettando lo scope (utile se il sito non è nella root)
  event.waitUntil(clients.openWindow(self.registration.scope));
});

// Controlla il KV e mostra la notifica aggiornata
async function checkNotifications() {
  try {
    const res = await fetch("https://orariwow.paola-milalove.workers.dev/api/get");
    const data = await res.json();
    const lastNotification = data.lastNotification;
    if (!lastNotification) return;

    const { title, body } = JSON.parse(lastNotification);
    self.registration.showNotification(title, {
      body,
      icon: "icons8-unicorn-neon-96.png",
      badge: "icons8-unicorn-neon-70.png",
    });
  } catch (err) {
    console.error("Errore:", err);
  }
}

// Quando la pagina admin salva → esegue sync
self.addEventListener("sync", (event) => {
  if (event.tag === "check-updates") {
    event.waitUntil(checkNotifications());
  }
});
