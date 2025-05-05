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

// Function to get the return time for a given day number
function getReturnTime(dayNumber, timetableMap) {
    return timetableMap[dayNumber] || 'xx:xx';
}

// Function to get the parent for a given day number
function getParentForDay(dayNumber, parentMap) {
    return parentMap[dayNumber] || 'nessuno, mi arrangio';
}

window.onload = function() {
    const dateElement = document.getElementById("current-date");
    const returnTimeElement = document.getElementById("return-time");
    const parentElement = document.getElementById("who-returns");

    const today = new Date();
    const dayOfWeek = getDayOfWeek(today);
    const dayNumber = getDayNumber(dayOfWeek);

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('it-IT', dateOptions);
    dateElement.textContent = `${dayOfWeek}, ${formattedDate}`;

    const timetableMap = mapTimetable([
        { days: [1, 2, 3, 4], time: '19:20' },  // da lunedì a giovedì
        { days: [5], time: '17:50' },          // venerdì
        { days: [6, 7], time: 'xx:xx' }          // sabato e domenica
    ]);

    const parentMap = mapParents([
        { days: [1, 3], parent: 'papà' },  // lun, mer
        { days: [2, 4], parent: 'mamma'}, // mar, gio
        { days: [5], parent: 'Vanessa' }  //ven
    ]);

    const returnTime = getReturnTime(dayNumber, timetableMap);
    const whoReturns = getParentForDay(dayNumber, parentMap);

    returnTimeElement.textContent = returnTime;
    parentElement.textContent = whoReturns;
};
