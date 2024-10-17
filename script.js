// Funzione per ottenere il giorno della settimana in italiano
function getDayOfWeek(date) {
    const daysOfWeek = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    return daysOfWeek[date.getDay()];
}

// Funzione per ottenere l'orario di ritorno in base al giorno della settimana
function getReturnTime(dayOfWeek) {
    const returnTimes = {
        'lunedì': '19:45',
        'martedì': '18:45',
        'mercoledì': '18:45',
        'giovedì': '18:45',
        'venerdì': '18:45',
        'sabato': 'xx:xx',
        'domenica': 'xx:xx'
    };
    return returnTimes[dayOfWeek] || 'xx:xx';  // Orario predefinito se non specificato
}

window.onload = function() {
    const dateElement = document.getElementById("current-date");
    const returnTimeElement = document.getElementById("return-time");
    
    const today = new Date();
    
    // Ottieni il giorno della settimana
    const dayOfWeek = getDayOfWeek(today);
    
    // Ottieni la data formattata
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString('it-IT', options);
    
    // Mostra il giorno della settimana e la data
    dateElement.textContent = `${dayOfWeek}, ${currentDate}`;
    
    // Mostra l'orario di ritorno in base al giorno della settimana
    const returnTime = getReturnTime(dayOfWeek);
    returnTimeElement.textContent = returnTime;
};
