document.addEventListener('DOMContentLoaded', function() {
    displayCurrentDate();

    fetch("https://orariwow.paola-milalove.workers.dev/api/get")
      .then(res => res.json())
      .then(dati => {
        if (dati.bikeMode === true) {
          document.getElementById('arrivalTime').textContent = 'Non lo so';
          document.getElementById('location').textContent = 'Mi arrangio';
          document.getElementById('person').textContent = 'Nessuno';
        } else {
          document.getElementById('arrivalTime').textContent = dati.arrivalTime || '19:45';
          document.getElementById('location').textContent = dati.location || 'Trieste Airport';
          document.getElementById('person').textContent = dati.person || 'Papino';
        }
        const torni = dati.backToday === "Sì" ? "Paola torna oggi" : "Paola non torna oggi";
        document.getElementById('torniOggi').textContent = torni;
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

navigator.serviceWorker.register('/sw.js').then(reg => {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BPPxpHGNfsgIMIEacsv-RWaAHEnS4g698i51K8lP9n7VfLP0D13E2oHmGdCB7YOfchL9ssBeScdHJXIj3eOihvM'
      }).then(sub => {
        fetch('/api/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub })
        });
      });
    }
  });
});
