// Main JavaScript file per la pagina principale
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pagina principale caricata');
    loadArrivalInfo();
    displayCurrentDate();

    // Imposta i valori di default se non esistono
    if (!localStorage.getItem('arrivalTime')) {
        localStorage.setItem('arrivalTime', '19:45');
    }
    if (!localStorage.getItem('location')) {
        localStorage.setItem('location', 'Trieste Airport');
    }
    if (!localStorage.getItem('person')) {
        localStorage.setItem('person', 'papino');
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

    const dateString = now.toLocaleDateString('it-IT', options);
    document.getElementById('currentDate').textContent = dateString;
}

function loadArrivalInfo() {
    // Controlla se è attiva la modalità bici
    const bikeMode = localStorage.getItem('bikeMode');

    if (bikeMode === 'true') {
        // Modalità bici: mostra il messaggio speciale
        document.getElementById('arrivalTime').textContent = 'Non lo so';
        document.getElementById('location').textContent = 'Mi arrangio';
        document.getElementById('person').textContent = 'Nessuno';

        // Aggiungi una classe speciale per lo stile della modalità bici
        document.querySelectorAll('.info-item').forEach(item => {
            item.classList.add('bike-mode');
        });
    } else {
        // Modalità normale: carica i dati salvati dal localStorage
        const arrivalTime = localStorage.getItem('arrivalTime') || '19:45';
        const location = localStorage.getItem('location') || 'Trieste Airport';
        const person = localStorage.getItem('person') || 'papino';
        
        // Aggiorna gli elementi della pagina
        document.getElementById('arrivalTime').textContent = arrivalTime;
        document.getElementById('location').textContent = location;
        document.getElementById('person').textContent = person;
        
        // Rimuovi la classe bike-mode se presente
        document.querySelectorAll('.info-item').forEach(item => {
            item.classList.remove('bike-mode');
        });
    }
}

function goToAdmin() {
    // Reindirizza alla pagina admin
    window.location.href = 'admin.html';
}

// Aggiorna automaticamente i dati se cambiano (per quando si torna dalla pagina admin)
window.addEventListener('storage', function(e) {
    if (e.key === 'arrivalTime' || e.key === 'location' || e.key === 'person' || e.key === 'bikeMode') {
        loadArrivalInfo();
    }
});

// Ricarica i dati quando la pagina diventa visibile (per quando si torna dalla pagina admin)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadArrivalInfo();
        displayCurrentDate(); // Aggiorna anche la data
    }
});

// Aggiorna la data ogni minuto
setInterval(displayCurrentDate, 60000);