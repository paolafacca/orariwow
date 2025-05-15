// Function to get the day of the week in Italian
function getDayOfWeek(date) {
    const daysOfWeek = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    return daysOfWeek[date.getDay()];
}

// Function to get the number of the day (1 = Monday, ..., 7 = Sunday)
function getDayNumber(dayOfWeek) {
    switch (dayOfWeek) {
        case 'lunedì': return 1;
        case 'martedì': return 2;
        case 'mercoledì': return 3;
        case 'giovedì': return 4;
        case 'venerdì': return 5;
        case 'sabato': return 6;
        case 'domenica': return 7;
        default: return 0;
    }
}

// Function to create a day → timetable map
function mapTimetable(groups) {
    const map = {};
    groups.forEach(group => {
        const { days, time } = group;
        days.forEach(d => {
            map[d] = time;
        });
    });
    return map;
}

// Function to create a day → parent map
function mapParents(groups) {
    const map = {};
    groups.forEach(group => {
        const { days, parent } = group;
        days.forEach(d => {
            map[d] = parent;
        });
    });
    return map;
}

// Function to create a day → destination map
function mapDestinations(groups) {
    const map = {};
    groups.forEach(group => {
        const { days, destination } = group;
        days.forEach(d => {
            map[d] = destination;
        });
    });
    return map;
}

// Function to get the return time for a given day number
function getReturnTime(dayNumber, timetableMap) {
    return timetableMap[dayNumber] || 'xx:xx';
}

// Function to get the parent for a given day number
function getParentForDay(dayNumber, parentMap) {
    return parentMap[dayNumber] || 'nessuno, mi arrangio';
}

// Function to get the destination for a given day number
function getDestinationForDay(dayNumber, destinationMap) {
    return destinationMap[dayNumber] || 'nessuna parte.';
}

window.onload = async function() {
    const dateElement = document.getElementById("current-date");
    const returnTimeElement = document.getElementById("return-time");
    const parentElement = document.getElementById("who-returns");
    const destinationElement = document.getElementById("destination");

    const today = new Date();
    const dayOfWeek = getDayOfWeek(today);
    const dayNumber = getDayNumber(dayOfWeek);

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('it-IT', dateOptions);
    dateElement.textContent = `${dayOfWeek}, ${formattedDate}`;

    // Mapping default values
    const timetableMap = mapTimetable([
        { days: [1, 3], time: '19:20' },
        { days: [2, 4], time: '20:00' },
        { days: [5], time: '17:50' },
        { days: [6, 7], time: 'xx:xx' }
    ]);

    const parentMap = mapParents([
        { days: [1, 3], parent: 'papà' },
        { days: [2, 4], parent: 'mamma' },
        { days: [5], parent: 'Vanessa' }
    ]);

    const destinationMap = mapDestinations([
        { days: [1, 3, 5], destination: 'Trieste Airport' },
        { days: [2, 4], destination: 'Ronchi dei Legionari Nord' },
        { days: [6, 7], destination: 'nessuna parte' }
    ]);

    try {
        const res = await fetch("https://raw.githubusercontent.com/paolafacca/orariwow/main/data.json");
        const data = await res.json();

        if (data.bici === true) {
            returnTimeElement.textContent = "non so a che ora";
            destinationElement.textContent = "nessuna parte.";
            parentElement.textContent = "nessuno, mi arrangio";
        } else {
            returnTimeElement.textContent = data.time || getReturnTime(dayNumber, timetableMap);
            destinationElement.textContent = data.place || getDestinationForDay(dayNumber, destinationMap);
            parentElement.textContent = data.person || getParentForDay(dayNumber, parentMap);
        }
    } catch (e) {
        returnTimeElement.textContent = getReturnTime(dayNumber, timetableMap);
        destinationElement.textContent = getDestinationForDay(dayNumber, destinationMap);
        parentElement.textContent = getParentForDay(dayNumber, parentMap);
    }
};
