const ADMIN_PASSWORD = 'Culettobello';

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

function loadCurrentData() {
    fetch("https://orariwow.paola-milalove.workers.dev/api/get")
      .then(res => res.json())
      .then(data => {
        document.getElementById('timeSelect').value = data.arrivalTime || '';
        document.getElementById('locationSelect').value = data.location || '';
        document.getElementById('personSelect').value = data.person || '';
        document.getElementById('backTodaySelect').value = data.backToday || '';
      });
}

function saveData() {
    const timeSelect = document.getElementById('timeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const personSelect = document.getElementById('personSelect');
    const backTodaySelect = document.getElementById('backTodaySelect');

    let arrivalTime = timeSelect.value === 'custom' 
        ? (document.getElementById('customTime').value.trim() || 'Altro') 
        : timeSelect.value;
    let location = locationSelect.value === 'custom' 
        ? (document.getElementById('customLocation').value.trim() || 'Altro') 
        : locationSelect.value;
    let person = personSelect.value === 'custom' 
        ? (document.getElementById('customPerson').value.trim() || 'Altro') 
        : personSelect.value;
    let backToday = backTodaySelect.value;

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalTime, location, person, bikeMode:false, backToday })
    })
    .then(res => res.json())
    .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Dati salvati con successo!';
        successMessage.style.color = '#27ae60';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);

        navigator.serviceWorker.ready.then(sw => {
            sw.sync.register('check-updates');
        });
    });
}

function setBikeMode() {
    let arrivalTime = "";
    let location = "Trieste";
    let person = "";
    let backToday = "Sì";
    let bikeMode = true;

    document.getElementById('timeSelect').value = arrivalTime;
    document.getElementById('locationSelect').value = location;
    document.getElementById('personSelect').value = person;
    document.getElementById('backTodaySelect').value = backToday;

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalTime, location, person, backToday, bikeMode })
    })
    .then(res => res.json())
    .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Modalità bici attivata!';
        successMessage.style.color = '#27ae60';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);

        navigator.serviceWorker.ready.then(sw => {
            sw.sync.register('check-updates');
        });
    });
}

function setAmorinoMode() {
    let arrivalTime = "";
    let location = "Trieste";
    let person = "Amorino";
    let backToday = "No";
    let bikeMode = false;

    document.getElementById('timeSelect').value = arrivalTime;
    document.getElementById('locationSelect').value = location;
    document.getElementById('personSelect').value = person;
    document.getElementById('backTodaySelect').value = backToday;

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalTime, location, person, backToday, bikeMode })
    })
    .then(res => res.json())
    .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Modalità Amorino attivata!';
        successMessage.style.color = '#e91e63';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);

        navigator.serviceWorker.ready.then(sw => {
            sw.sync.register('check-updates');
        });
    });
}

// Mostra input manuale quando selezioni "Altro"
document.getElementById('timeSelect').addEventListener('change', function() {
    document.getElementById('customTime').style.display = this.value === 'custom' ? 'inline-block' : 'none';
});
document.getElementById('locationSelect').addEventListener('change', function() {
    document.getElementById('customLocation').style.display = this.value === 'custom' ? 'inline-block' : 'none';
});
document.getElementById('personSelect').addEventListener('change', function() {
    document.getElementById('customPerson').style.display = this.value === 'custom' ? 'inline-block' : 'none';
});
