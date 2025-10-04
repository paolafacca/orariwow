document.addEventListener('DOMContentLoaded', function() {
    console.log('Pagina principale caricata');
    displayCurrentDate();

    // Legge i dati in tempo reale da Firebase
    db.ref('orariwow').on('value', snapshot => {
        const dati = snapshot.val();

        if (dati) {
            if (dati.bikeMode === 'true') {
                document.getElementById('arrivalTime').textContent = 'Non lo so';
                document.getElementById('location').textContent = 'Mi arrangio';
                document.getElementById('person').textContent = 'Nessuno';
                document.querySelectorAll('.info-item').forEach(item => item.classList.add('bike-mode'));
            } else {
                document.getElementById('arrivalTime').textContent = dati.arrivalTime || '19:45';
                document.getElementById('location').textContent = dati.location || 'Trieste Airport';
                document.getElementById('person').textContent = dati.person || 'Papino';
                document.querySelectorAll('.info-item').forEach(item => item.classList.remove('bike-mode'));
            }
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

    const dateString = now.toLocaleDateString('it-IT', options);
    document.getElementById('currentDate').textContent = dateString;
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

// Aggiorna la data ogni minuto
setInterval(displayCurrentDate, 60000);
