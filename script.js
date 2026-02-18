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

    // ✅ Notifiche / Service Worker
    setupNotificationsUI();
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

// --- Push helpers ---
// PushManager.subscribe() vuole applicationServerKey come Uint8Array (non stringa).
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function setupNotificationsUI() {
  const btn = document.getElementById('enableNotifications');
  const status = document.getElementById('notifStatus');
  if (!btn || !status) return;

  // Feature detection (evita errori su browser non compatibili)
  const swSupported = 'serviceWorker' in navigator;
  const notifSupported = 'Notification' in window;
  const pushSupported = swSupported && 'PushManager' in window;

  if (!swSupported) {
    btn.style.display = 'none';
    status.textContent = "Questo browser non supporta i Service Worker ❌";
    return;
  }
  if (!notifSupported) {
    btn.style.display = 'none';
    status.textContent = "Questo browser non supporta le notifiche ❌";
    return;
  }
  if (!pushSupported) {
    btn.style.display = 'none';
    status.textContent = "Questo browser non supporta le notifiche push ❌";
    return;
  }

  // Registra SW (solo su HTTPS o localhost; su file:// non funziona)
  try {
    await navigator.serviceWorker.register('./sw.js');
  } catch (e) {
    // Se fallisce, non blocchiamo la pagina: mostriamo solo un messaggio.
    status.textContent = "Impossibile registrare il Service Worker (serve HTTPS o localhost) ❌";
    return;
  }

  // Se già abilitato, nascondi pulsante
  try {
    const reg = await navigator.serviceWorker.ready;
    const existingSub = await reg.pushManager.getSubscription();
    if (existingSub) {
      btn.style.display = 'none';
      status.textContent = "Notifiche già attive ✅";
      return;
    }
  } catch (_) {
    // ignora
  }

  // Click → richiedi permessi
  btn.addEventListener('click', async () => {
    status.textContent = "";
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      status.textContent = "Permesso negato ❌";
      return;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = 'BPPxpHGNfsgIMIEacsv-RWaAHEnS4g698i51K8lP9n7VfLP0D13E2oHmGdCB7YOfchL9ssBeScdHJXIj3eOihvM';
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // Salva la subscription nel Worker
      await fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON ? sub.toJSON() : sub })
      });

      btn.style.display = 'none';
      status.textContent = "Notifiche attivate ✅";
    } catch (e) {
      console.error(e);
      status.textContent = "Errore durante l'attivazione delle notifiche ❌";
    }
  });
}
