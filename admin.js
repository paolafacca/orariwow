// JavaScript per la pagina admin
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pagina admin caricata');
    loadCurrentData();

    db.ref('orariwow').get().then(snapshot => {
        if (!snapshot.exists()) {
            db.ref('orariwow').set({
                arrivalTime: '19:45',
                location: 'Trieste Airport',
                person: 'Papino',
                bikeMode: false
            });
        }
    });
});

const ADMIN_PASSWORD = 'Culettobello'; // Password admin

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
    db.ref('orariwow').set({
        bikeMode: true,
        arrivalTime: 'Non lo so',
        location: 'Mi arrangio',
        person: 'Nessuno'
    }).then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Modalità Bici attivata 🚲';
        successMessage.style.color = '#27ae60';
        resetFormFields();
        setTimeout(() => { successMessage.textContent = ''; }, 3000);
    }).catch(err => console.error(err));
}

function setAmorinoMode() {
    const dati = {
        bikeMode: false,
        arrivalTime: 'Oggi non torno',
        location: '',
        person: 'Nessuno'
    };

    db.ref('orariwow').set(dati)
        .then(() => {
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = 'Modalità Amorino attivata 💗';
            successMessage.style.color = '#e91e63';
            resetFormFields();
            setTimeout(() => { successMessage.textContent = ''; }, 3000);
        })
        .catch(err => console.error(err));
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
    db.ref('orariwow').get().then(snapshot => {
        const data = snapshot.val() || {};

        if (data.bikeMode) {
            resetFormFields();
            return;
        }

        const currentTime = data.arrivalTime || '19:45';
        const currentLocation = data.location || 'Trieste Airport';
        const currentPerson = data.person || 'Papino';

        const timeSelect = document.getElementById('timeSelect');
        const timeOptions = Array.from(timeSelect.options).map(option => option.value);
        if (timeOptions.includes(currentTime)) {
            timeSelect.value = currentTime;
        } else if (currentTime) {
            timeSelect.value = 'custom';
            document.getElementById('customTime').style.display = 'block';
            document.getElementById('customTime').value = currentTime;
        }

        const locationSelect = document.getElementById('locationSelect');
        const locationOptions = Array.from(locationSelect.options).map(option => option.value);
        if (locationOptions.includes(currentLocation)) {
            locationSelect.value = currentLocation;
        } else if (currentLocation) {
            locationSelect.value = 'custom';
            document.getElementById('customLocation').style.display = 'block';
            document.getElementById('customLocation').value = currentLocation;
        }

        const personSelect = document.getElementById('personSelect');
        const personOptions = Array.from(personSelect.options).map(option => option.value);
        if (personOptions.includes(currentPerson)) {
            personSelect.value = currentPerson;
        } else if (currentPerson) {
            personSelect.value = 'custom';
            document.getElementById('customPerson').style.display = 'block';
            document.getElementById('customPerson').value = currentPerson;
        }
    }).catch(err => console.error(err));
}

function handleTimeChange() {
    const select = document.getElementById('timeSelect');
    const customInput = document.getElementById('customTime');
    customInput.style.display = select.value === 'custom' ? 'block' : 'none';
    if (select.value !== 'custom') customInput.value = '';
}

function handleLocationChange() {
    const select = document.getElementById('locationSelect');
    const customInput = document.getElementById('customLocation');
    customInput.style.display = select.value === 'custom' ? 'block' : 'none';
    if (select.value !== 'custom') customInput.value = '';
}

function handlePersonChange() {
    const select = document.getElementById('personSelect');
    const customInput = document.getElementById('customPerson');
    customInput.style.display = select.value === 'custom' ? 'block' : 'none';
    if (select.value !== 'custom') customInput.value = '';
}

function saveData() {
    const successMessage = document.getElementById('successMessage');
    const timeSelect = document.getElementById('timeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const personSelect = document.getElementById('personSelect');

    let arrivalTime = timeSelect.value === 'custom' ? document.getElementById('customTime').value.trim() : timeSelect.value;
    let location = locationSelect.value === 'custom' ? document.getElementById('customLocation').value.trim() : locationSelect.value;
    let person = personSelect.value === 'custom' ? document.getElementById('customPerson').value.trim() : personSelect.value;

    if (!arrivalTime && !location && !person) {
        successMessage.textContent = 'Compila almeno un campo!';
        successMessage.style.color = '#e74c3c';
        return;
    }

    db.ref('orariwow').set({ arrivalTime, location, person, bikeMode: false })
        .then(() => {
            successMessage.textContent = 'Dati salvati con successo!';
            successMessage.style.color = '#27ae60';
            setTimeout(() => { successMessage.textContent = ''; }, 3000);
        })
        .catch(err => console.error(err));
}

function goToMain() {
    window.location.href = 'index.html';
}

document.getElementById('password').addEventListener('keypress', e => { if (e.key === 'Enter') login(); });
document.addEventListener('keypress', e => { if (e.key === 'Enter' && e.target.classList.contains('custom-input')) saveData(); });
