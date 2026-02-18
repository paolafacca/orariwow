const ADMIN_PASSWORD = 'Culettobello';

function setSelectValueOrCustom(selectEl, customInputEl, value) {
    const exists = Array.from(selectEl.options).some(o => o.value === value);
    if (exists) {
        selectEl.value = value;
        // trigger change handlers to hide custom input
        selectEl.dispatchEvent(new Event('change'));
        return;
    }
    // valore non presente tra le opzioni → usa "custom"
    selectEl.value = 'custom';
    selectEl.dispatchEvent(new Event('change'));
    customInputEl.value = value || '';
}

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
        const timeSelect = document.getElementById('timeSelect');
        const locationSelect = document.getElementById('locationSelect');
        const personSelect = document.getElementById('personSelect');
        const backTodaySelect = document.getElementById('backTodaySelect');

        setSelectValueOrCustom(timeSelect, document.getElementById('customTime'), data.arrivalTime || '');
        setSelectValueOrCustom(locationSelect, document.getElementById('customLocation'), data.location || '');
        setSelectValueOrCustom(personSelect, document.getElementById('customPerson'), data.person || '');

        // backToday non ha input custom, quindi se non matcha mettiamo "Altro"
        const backValue = data.backToday || 'Sì';
        const backExists = Array.from(backTodaySelect.options).some(o => o.value === backValue);
        backTodaySelect.value = backExists ? backValue : 'Altro';
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

    // Allinea UI anche se i valori non sono nelle opzioni
    setSelectValueOrCustom(document.getElementById('timeSelect'), document.getElementById('customTime'), arrivalTime);
    setSelectValueOrCustom(document.getElementById('locationSelect'), document.getElementById('customLocation'), location);
    setSelectValueOrCustom(document.getElementById('personSelect'), document.getElementById('customPerson'), person);
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
    const backToday = "No, domani";
    const bikeMode = false;

    setSelectValueOrCustom(document.getElementById('timeSelect'), document.getElementById('customTime'), arrivalTime);
    setSelectValueOrCustom(document.getElementById('locationSelect'), document.getElementById('customLocation'), location);
    setSelectValueOrCustom(document.getElementById('personSelect'), document.getElementById('customPerson'), person);
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
