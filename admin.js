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
        document.getElementById('torniSelect').value = data.torniOggi || 'Sì';
      });
}

function saveData() {
    const timeSelect = document.getElementById('timeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const personSelect = document.getElementById('personSelect');
    const torniSelect = document.getElementById('torniSelect');

    let arrivalTime = timeSelect.value === 'custom' ? document.getElementById('customTime').value.trim() : timeSelect.value;
    let location = locationSelect.value === 'custom' ? document.getElementById('customLocation').value.trim() : locationSelect.value;
    let person = personSelect.value === 'custom' ? document.getElementById('customPerson').value.trim() : personSelect.value;
    let torniOggi = torniSelect.value;

    fetch("https://orariwow.paola-milalove.workers.dev/api/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalTime, location, person, bikeMode:false, torniOggi })
    }).then(res => res.json())
      .then(() => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Dati salvati con successo!';
        successMessage.style.color = '#27ae60';
        setTimeout(() => { successMessage.textContent = ''; }, 3000);
    });
}

function goToMain() {
    window.location.href = 'index.html';
}

document.getElementById('password').addEventListener('keypress', e => { if(e.key === 'Enter') login(); });
