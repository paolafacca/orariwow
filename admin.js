// JavaScript per la pagina admin
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pagina admin caricata');
    loadCurrentData();

    // Imposta i valori di default se non esistono
    if (!localStorage.getItem('arrivalTime')) {
        localStorage.setItem('arrivalTime', '19:45');
    }
    if (!localStorage.getItem('location')) {
        localStorage.setItem('location', 'Trieste Airport');
    }
    if (!localStorage.getItem('person')) {
        localStorage.setItem('person', 'Papino');
    }
});

const ADMIN_PASSWORD = 'Culettobello'; // Password per l'accesso admin

function login() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        errorMessage.textContent = '';
        loadCurrentData();
    } else {
        errorMessage.textContent = 'Password non corretta!';
        document.getElementById('password').value = '';
    }
}

function setBikeMode() {
    // Imposta la modalità bici con messaggio speciale
    localStorage.setItem('bikeMode', 'true');
    localStorage.setItem('arrivalTime', 'Non lo so');
    localStorage.setItem('location', 'Mi arrangio');
    localStorage.setItem('person', 'Nessuno ');

    // Mostra messaggio di conferma
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = 'Modalità Bici attivata';
    successMessage.style.color = '#27ae60';

    // Reset dei campi del form
    resetFormFields();

    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
        successMessage.textContent = '';
    }, 3000);
}

function resetFormFields() {
    document.getElementById('timeSelect').value = '';
    document.getElementById('locationSelect').value = '';
    document.getElementById('personSelect').value = '';
    document.getElementById('customTime').style.display = 'none';
    document.getElementById('customLocation').style.display = 'none';
    document.getElementById('customPerson').style.display = 'none';
    document.getElementById('customTime').value = '';
    document.getElementById('customLocation').value = '';
    document.getElementById('customPerson').value = '';
}

function loadCurrentData() {
    // Se è in modalità bici, non caricare i dati nei form
    if (localStorage.getItem('bikeMode') === 'true') {
        resetFormFields();
        return;
    }

    // Carica i dati attuali nei campi del form
    const currentTime = localStorage.getItem('arrivalTime') || '19:45';
    const currentLocation = localStorage.getItem('location') || 'Trieste Airport';
    const currentPerson = localStorage.getItem('person') || 'Papino';

    // Imposta i valori nei select se corrispondono alle opzioni predefinite
    if (currentTime && currentTime !== 'Non impostato') {
        const timeSelect = document.getElementById('timeSelect');
        const timeOptions = Array.from(timeSelect.options).map(option => option.value);
        if (timeOptions.includes(currentTime)) {
            timeSelect.value = currentTime;
        } else {
            timeSelect.value = 'custom';
            document.getElementById('customTime').style.display = 'block';
            document.getElementById('customTime').value = currentTime;
        }
    }

    if (currentLocation && currentLocation !== 'Non impostato') {
        const locationSelect = document.getElementById('locationSelect');
        const locationOptions = Array.from(locationSelect.options).map(option => option.value);
        if (locationOptions.includes(currentLocation)) {
            locationSelect.value = currentLocation;
        } else {
            locationSelect.value = 'custom';
            document.getElementById('customLocation').style.display = 'block';
            document.getElementById('customLocation').value = currentLocation;
        }
    }

    if (currentPerson && currentPerson !== 'Non impostato') {
        const personSelect = document.getElementById('personSelect');
        const personOptions = Array.from(personSelect.options).map(option => option.value);
        if (personOptions.includes(currentPerson)) {
            personSelect.value = currentPerson;
        } else {
            personSelect.value = 'custom';
            document.getElementById('customPerson').style.display = 'block';
            document.getElementById('customPerson').value = currentPerson;
        }
    }
}

function handleTimeChange() {
    const select = document.getElementById('timeSelect');
    const customInput = document.getElementById('customTime');

    if (select.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

function handleLocationChange() {
    const select = document.getElementById('locationSelect');
    const customInput = document.getElementById('customLocation');

    if (select.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

function handlePersonChange() {
    const select = document.getElementById('personSelect');
    const customInput = document.getElementById('customPerson');

    if (select.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

function saveData() {
    const successMessage = document.getElementById('successMessage');

    // Disattiva la modalità bici quando si salvano dati manuali
    localStorage.removeItem('bikeMode');

    // Ottieni i valori dai campi
    const timeSelect = document.getElementById('timeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const personSelect = document.getElementById('personSelect');

    let arrivalTime = timeSelect.value;
    let location = locationSelect.value;
    let person = personSelect.value;

    // Se è selezionato "custom", usa il valore del campo di testo
    if (arrivalTime === 'custom') {
        arrivalTime = document.getElementById('customTime').value.trim();
    }
    if (location === 'custom') {
        location = document.getElementById('customLocation').value.trim();
    }
    if (person === 'custom') {
        person = document.getElementById('customPerson').value.trim();
    }

    // Valida che almeno un campo sia compilato
    if (!arrivalTime && !location && !person) {
        successMessage.textContent = 'Compila almeno un campo!';
        successMessage.style.color = '#e74c3c';
        return;
    }

    // Salva i dati nel localStorage
    if (arrivalTime) {
        localStorage.setItem('arrivalTime', arrivalTime);
    }
    if (location) {
        localStorage.setItem('location', location);
    }
    if (person) {
        localStorage.setItem('person', person);
    }

    // Mostra messaggio di successo
    successMessage.textContent = 'Dati salvati con successo!';
    successMessage.style.color = '#27ae60';
    
    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
        successMessage.textContent = '';
    }, 3000);
}

function goToMain() {
    window.location.href = 'index.html';
}

// Gestione dell'invio del form con Enter
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});

// Gestione dell'invio dei campi custom con Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('custom-input')) {
        saveData();
    }
});