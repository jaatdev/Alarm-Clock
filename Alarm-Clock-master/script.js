// DOM elements
const hour = document.querySelector('#hour'); // Selecting the hour input element
const minute = document.querySelector('#minute'); // Selecting the minute input element
const AmPm = document.querySelector('#ampm'); // Selecting the AM/PM input element
const setAlarmBtn = document.querySelector('#setBtn'); // Selecting the set alarm button element
const content = document.querySelector('#content'); // Selecting the content element
const ringTone = new Audio('files/ringtone.mp3'); // Creating an audio element for the ringtone
const secondBtn = document.querySelector('#secondBtn'); // Selecting the second button element
const body = document.querySelector('body'); // Selecting the body element
const resumeBtn = document.querySelector('#resumeBtn'); // Selecting the resume button element
const welcomeBackScreen = document.querySelector('#welcomeBack'); // Selecting the welcome back screen element
const alarmTimeIndicator = document.querySelector('#alarmText'); // Selecting the alarm time indicator element
let CurrentTime = document.querySelector('#currentTime'); // Selecting the current time element

// Check if user has exited webpage
if (!localStorage.getItem('userExited')) {
    localStorage.setItem('userExited', 'false'); // Setting the userExited flag to false if not already set
} else {
    // Check if user has returned to webpage and had previously set an alarm then show him resume button
    if (localStorage.getItem('userExited') == 'true' && localStorage.getItem('isAlarmSet') == 'true') {
        welcomeBackScreen.className = 'welcomeBack flex'; // Showing the welcome back screen if the user had previously set an alarm and exited the page
    }
}

// Play ringtone continuously on resume
if (!localStorage.getItem('wantToPlay')) {
    localStorage.setItem('wantToPlay', 'no'); // Setting the wantToPlay flag to 'no' if not already set
}

// Hide Alarm indicator if alarm is not set
if (localStorage.getItem('alarmTime') == "00:00:AM")
    alarmTimeIndicator.className = "d-none"; // Hiding the alarm time indicator if the alarm is not set

// Add class to content
if (!localStorage.getItem('contentClass')) {
    localStorage.setItem('contentClass', 'content flex'); // Setting the default class for the content element if not already set
    content.className = localStorage.getItem('contentClass'); // Adding the class to the content element
} else {
    content.className = localStorage.getItem('contentClass'); // Adding the class to the content element if already set
}

// Set button text
if (!localStorage.getItem('btnText')) {
    localStorage.setItem('btnText', 'Set Alarm'); // Setting the default button text if not already set
    setAlarmBtn.textContent = localStorage.getItem('btnText'); // Setting the button text
} else {
    setAlarmBtn.textContent = localStorage.getItem('btnText'); // Setting the button text if already set
}

// Set default isAlarm
if (!localStorage.getItem('isAlarmSet')) {
    localStorage.setItem('isAlarmSet', 'false'); // Setting the default value of isAlarm if not already set
}

// Set default alarm time
if (!localStorage.getItem('alarmTime')) {
    localStorage.setItem('alarmTime', '00:00:PM'); // Setting the default alarm time if not already set
}

// Set hour values
for (let i = 12; i > 0; i--) {
    i = i < 10 ? "0" + i : i; // Adding leading zero to single-digit numbers
    let option = ` <option value="${i}">${i}</option>`; // Creating an option element for each hour value
    hour.firstElementChild.insertAdjacentHTML("afterend", option); // Inserting the option element into the hour select element
}

// Set Minute values
for (let i = 59; i >= 0; i--) {
    i = i < 10 ? "0" + i : i; // Adding leading zero to single-digit numbers
    let option = ` <option value="${i}">${i}</option>`; // Creating an option element for each minute value
    minute.firstElementChild.insertAdjacentHTML("afterend", option); // Inserting the option element into the minute select element
}

// Set AM/PM values
for (let i = 2; i > 0; i--) {
    let am_pm = i == 1 ? "AM" : "PM"; // Assigning the value 'AM' or 'PM' based on the iteration
    let option = `<option value="${am_pm}">${am_pm}</option>`; // Creating an option element for each AM/PM value
    AmPm.firstElementChild.insertAdjacentHTML("afterend", option); // Inserting the option element into the AM/PM select element
}

// Play Alarm function
const playAlarm = () => {
    if ((localStorage.getItem('userExited') == 'xxx') || (localStorage.getItem('wantToPlay' == 'yes'))) {
        ringTone.play(); // Playing the ringtone if the conditions are met
    }
    // console.log(localStorage.getItem('userExited'));
    ringTone.loop = true; // Setting the ringtone to loop
}

// Update time every second
setInterval(() => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let ampm = "AM";

    // 12 Hour Format
    if (h > 11) {
        h = h - 12;
        ampm = 'PM';
    }

    h = h == 0 ? h = 12 : h; // Setting hour value to 12 if it is 0
    h = h < 10 ? "0" + h : h; // Adding leading zero to single-digit numbers
    m = m < 10 ? "0" + m : m; // Adding leading zero to single-digit numbers
    s = s < 10 ? "0" + s : s; // Adding leading zero to single-digit numbers

    currentTime.textContent = `${h}:${m}:${s} ${ampm}`; // Updating the current time element

    // Play ringtone if alarm time matches with current time
    if ((localStorage.getItem('alarmTime') == `${h}:${m}:${ampm}`) || (localStorage.getItem('wantToPlay') == 'yes')) {
        playAlarm(); // Playing the alarm if the conditions are met
    }
}, 1000);

// Set alarm 
const setAlarm = () => {

    // Clear alarm
    if (localStorage.getItem('isAlarmSet') == 'true') {
        // Reset Alarm time
        localStorage.setItem('alarmTime', "00:00:AM");
        ringTone.pause();
        // Enable selection of time
        localStorage.setItem('contentClass', 'content flex')
        content.className = localStorage.getItem('contentClass');
        // change button text to "Set alarm"
        localStorage.setItem('btnText', 'Set Alarm')
        setAlarmBtn.textContent = localStorage.getItem('btnText');
        // Hide resume button
        resumeBtn.hidden = true
        // Reset alarm indicator
        alarmTimeIndicator.textContent = "Alarm Time set to: ";
        alarmTimeIndicator.className = "d-none";
        // Set want to play to no to stop alarm
        localStorage.setItem('wantToPlay', 'no')
        // Return
        return localStorage.setItem('isAlarmSet', 'false');
    }

    // Getting alarm time from user
    let time = `${hour.value}:${minute.value}:${AmPm.value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        alert("Please select a valid time");
        return;
    }

    // Check if the selected time is in the future
    let selectedTime = new Date();
    let [selectedHour, selectedMinute] = time.split(":");
    selectedTime.setHours(AmPm.value === "PM" ? parseInt(selectedHour) + 12 : parseInt(selectedHour));
    selectedTime.setMinutes(parseInt(selectedMinute));
    selectedTime.setSeconds(0);

    let currentTime = new Date();
    if (selectedTime <= currentTime) {
        alert("Please select a future time for the alarm");
        return;
    }

    // Set alarm to true
    localStorage.setItem('isAlarmSet', 'true');
    // Set alarm time
    localStorage.setItem('alarmTime', time);
    // Disable selection of time when alarm is set
    localStorage.setItem('contentClass', 'content flex disable');
    content.className = localStorage.getItem('contentClass');
    // Set button text to "Clear Alarm";
    localStorage.setItem('btnText', 'Clear Alarm')
    setAlarmBtn.textContent = localStorage.getItem('btnText');
    // Set Alarm Time indicator
    alarmTimeIndicator.textContent = "Alarm Time set to: " + localStorage.getItem('alarmTime');
    alarmTimeIndicator.className = "";
    // Set user exited to false to avoid DOM exception
    localStorage.setItem('userExited', 'xxx');
}

// Snooze alarm
const snoozeAlarm = () => {
    // Check if the alarm is set
    if (localStorage.getItem('isAlarmSet') == 'true') {
        // Get the current time
        let currentTime = new Date();
        // Add 5 minutes to the current time for snooze duration
        currentTime.setMinutes(currentTime.getMinutes() + 5);
        // Format the snooze time
        let h = currentTime.getHours() % 12 || 12;
        let m = currentTime.getMinutes();
        let s = currentTime.getSeconds();
        let ampm = currentTime.getHours() < 12 ? 'AM' : 'PM';
        let snoozeTime = `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s} ${ampm}`;

        // Update alarm time to snooze time
        localStorage.setItem('alarmTime', snoozeTime);
        // Update alarm time indicator
        alarmTimeIndicator.textContent = 'Alarm Time set to: ' + localStorage.getItem('alarmTime');

        // Play alarm after snooze
        playAlarm();
    }
};

// Event listener for snooze button
snoozeBtn.addEventListener('click', snoozeAlarm);


// Hide Welcome Screen
const hideWelcomeScreen = () => {
    welcomeBackScreen.className = 'd-none'; // Hiding the welcome back screen
    alarmTimeIndicator.textContent = "Alarm Time set to: " + localStorage.getItem('alarmTime'); // Setting alarm time indicator
    localStorage.setItem('userExited', 'xxx'); // Setting userExited to xxx
    localStorage.setItem('wantToPlay', 'yes'); // Setting wantToPlay to 'yes' to play the ringtone even if the time has expired
}

// Event Listeners

// Set Button
setAlarmBtn.addEventListener('click', setAlarm);

// Resume Button
resumeBtn.addEventListener('click', hideWelcomeScreen);

// Check if user has exited the page or refreshed
const beforeUnloadListener = (event) => {
    localStorage.setItem('userExited', 'true'); // Setting userExited to true
};

window.addEventListener("beforeunload", beforeUnloadListener); // Adding the beforeunload event listener to the window object to detect when the user exits the page or refreshes
