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

// ✅ Registrazione del Service Worker (senza richiesta automatica di permessi)
navigator.serviceWorker.register('./sw.js');

// ✅ Richiesta permessi solo al click del pulsante
document.getElementById('enableNotifications').addEventListener('click', () => {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BPPxpHGNfsgIMIEacsv-RWaAHEnS4g698i51K8lP9n7VfLP0D13E2oHmGdCB7YOfchL9ssBeScdHJXIj3eOihvM'
        }).then(sub => {
          // Salva la subscription nel tuo Worker
          fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub })
          });
        });
      });
      // Nasconde il pulsante e mostra conferma
      document.getElementById('enableNotifications').style.display = 'none';
      document.getElementById('notifStatus').textContent = "Notifiche attivate ✅";
    } else {
      // Se rifiuta, pulsante resta visibile
      document.getElementById('notifStatus').textContent = "Permesso negato ❌";
    }
  });
});
