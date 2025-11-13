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
      .then(res => {
        if (!res.ok) throw new Error('Errore nel recupero dati');
        return res.json();
      })
      .then(data => {
        document.getElementById('timeSelect').value = data.arrivalTime || '';
        document.getElementById('locationSelect').value = data.location || '';
        document.getElementById('personSelect').value = data.person || '';
        document.getElementById('backTodaySelect').value = data.backToday || '';
      })
      .catch(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Impossibile caricare i dati attuali.';
        successMessage.style.color = '#c0392b';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);
      });
}

function saveData() {
    const timeSelect = document.getElementById('timeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const personSelect = document.getElementById('personSelect');
    const backTodaySelect = document.getElementById('backTodaySelect');

    const arrivalTime = timeSelect.value === 'custom'
        ? (document.getElementById('customTime').value.trim() || 'Altro')
        : timeSelect.value;
    const location = locationSelect.value === 'custom'
        ? (document.getElementById('customLocation').value.trim() || 'Altro')
        : locationSelect.value;
    const person = personSelect.value === 'custom'
        ? (document.getElementById('customPerson').value.trim() || 'Altro')
        : personSelect.value;
    const backToday = backTodaySelect.value;
    const payload = { arrivalTime, location, person, bikeMode: false, backToday };

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error('Errore nel salvataggio');
        return res.json();
    })
    .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Dati aggiornati con successo!';
        successMessage.style.color = '#27ae60';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);

        loadCurrentData();

        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(sw => {
                if (sw.sync) sw.sync.register('check-updates').catch(() => {});
            }).catch(() => {});
        }
    })
    .catch(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Errore: non è stato possibile salvare.';
        successMessage.style.color = '#c0392b';
        setTimeout(() => { successMessage.textContent = ''; }, 4000);
    });
}

function setBikeMode() {
    const arrivalTime = "";
    const location = "Trieste";
    const person = "";
    const backToday = "Sì";
    const bikeMode = true;

    document.getElementById('timeSelect').value = arrivalTime;
    document.getElementById('locationSelect').value = location;
    document.getElementById('personSelect').value = person;
    document.getElementById('backTodaySelect').value = backToday;

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalTime, location, person, backToday, bikeMode })
    })
    .then(res => {
        if (!res.ok) throw new Error('Errore modalità bici');
        return res.json();
    })
    .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Modalità bici attivata!';
        successMessage.style.color = '#27ae60';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);
        loadCurrentData();
    })
    .catch(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Errore: non è stato possibile attivare modalità bici.';
        successMessage.style.color = '#c0392b';
        setTimeout(() => { successMessage.textContent = ''; }, 4000);
    });
}

function setAmorinoMode() {
    const arrivalTime = "";
    const location = "Trieste";
    const person = "Amorino";
    const backToday = "No";
    const bikeMode = false;

    document.getElementById('timeSelect').value = arrivalTime;
    document.getElementById('locationSelect').value = location;
    document.getElementById('personSelect').value = person;
    document.getElementById('backTodaySelect').value = backToday;

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalTime, location, person, backToday, bikeMode })
    })
    .then(res => {
        if (!res.ok) throw new Error('Errore modalità Amorino');
        return res.json();
    })
    .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Modalità Amorino attivata!';
        successMessage.style.color = '#e91e63';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);
        loadCurrentData();
    })
    .catch(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Errore: non è stato possibile attivare modalità Amorino.';
        successMessage.style.color = '#c0392b';
        setTimeout(() => { successMessage.textContent = ''; }, 4000);
    });
}

function goToMain() {
    // Assicurati che il path sia corretto rispetto a admin.html
    // Se admin.html è nella stessa cartella di index.html:
    window.location.href = 'index.html';
    // Se è in una sottocartella, usa: window.location.href = '../index.html';
}

// Login con Enter
document.getElementById('password').addEventListener('keypress', e => {
    if (e.key === 'Enter') login();
});

// Mostra input manuale quando selezioni "Altro"
document.getElementById('timeSelect').addEventListener('change', function() {
    const input = document.getElementById('customTime');
    input.style.display = this.value === 'custom' ? 'inline-block' : 'none';
    if (this.value !== 'custom') input.value = '';
});
document.getElementById('locationSelect').addEventListener('change', function() {
    const input = document.getElementById('customLocation');
    input.style.display = this.value === 'custom' ? 'inline-block' : 'none';
    if (this.value !== 'custom') input.value = '';
});
document.getElementById('personSelect').addEventListener('change', function() {
    const input = document.getElementById('customPerson');
    input.style.display = this.value === 'custom' ? 'inline-block' : 'none';
    if (this.value !== 'custom') input.value = '';
});
