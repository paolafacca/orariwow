document.addEventListener('DOMContentLoaded', function() {
    displayCurrentDate();

    fetch("https://orariwow.paola-milalove.workers.dev/api/get")
      .then(res => res.json())
      .then(dati => {
        if (dati.bikeMode === true) {
          document.getElementById('arrivalTime').textContent = 'Non lo so';
          document.getElementById('location').textContent = 'Mi arrangio';
          document.getElementById('person').textContent = 'Nessuno';
          document.getElementById('torniOggi').textContent = dati.backToday || "Sì";
        } else {
          document.getElementById('arrivalTime').textContent = dati.arrivalTime || '19:45';
          document.getElementById('location').textContent = dati.location || 'Trieste Airport';
          document.getElementById('person').textContent = dati.person || 'Papino';
          document.getElementById('torniOggi').textContent = dati.backToday || "Sì";
        }
      });

    // ✅ Controlla stato notifiche al caricamento
    if (localStorage.getItem("notificationsEnabled") === "true") {
      const btn = document.getElementById('enableNotifications');
      const status = document.getElementById('notifStatus');
      if (btn) btn.style.display = 'none';
      if (status) status.textContent = "Notifiche attivate ✅";
    }
});

function displayCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('it-IT', options);
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

setInterval(displayCurrentDate, 60000);

// ✅ Registrazione del Service Worker
navigator.serviceWorker.register('./sw.js');

// Funzione per convertire la VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const VAPID_PUBLIC_KEY = 'BPPxpHGNfsgIMIEacsv-RWaAHEnS4g698i51K8lP9n7VfLP0D13E2oHmGdCB7YOfchL9ssBeScdHJXIj3eOihvM';

// ✅ Gestione pulsante notifiche
document.getElementById('enableNotifications').addEventListener('click', async () => {
  try {
    const permission = await Notification.requestPermission();
    const status = document.getElementById('notifStatus');

    if (permission !== 'granted') {
      if (status) status.textContent = "Permesso negato ❌";
      return;
    }

    const reg = await navigator.serviceWorker.ready;

    // Riusa subscription esistente se presente
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Salva la subscription nel Worker
    await fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub })
    });

    // Persisti stato e UI
    localStorage.setItem("notificationsEnabled", "true");
    document.getElementById('enableNotifications').style.display = 'none';
    if (status) status.textContent = "Notifiche attivate ✅";

  } catch (err) {
    const status = document.getElementById('notifStatus');
    if (status) status.textContent = "Errore nella registrazione delle notifiche ❌";
    console.error(err);
  }
});
