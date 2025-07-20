// Constants IDs
const titleText = document.getElementById("title-text");
const radioButton = document.getElementById("radio-button");
const auxButton = document.getElementById("aux-button");
const phonoButton = document.getElementById("phono-button");
const cdButton = document.getElementById("cd-button");
const tapeButton = document.getElementById("tape-button");
const powerButton = document.getElementById("power-button");
const trackInfo = document.getElementById("track-info");
const radio = document.getElementById("radio");
const clockInfo = document.getElementById("clock-info");
const infoLights = document.getElementById("info-lights"); // ← toegevoegd

let isPoweredOn = false;
let clockInterval = null;
let lastSource = null;

// Bij het laden van de pagina: klokmodus aan
window.addEventListener("DOMContentLoaded", () => {
    isPoweredOn = false;
    showClock();
    radio.pause();
});

// Start klokmodus
function showClock() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString(); // ← geen padStart
        const minutes = now.getMinutes().toString().padStart(2, '0');
        titleText.textContent = `${hours}:${minutes}`;
    }

    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    trackInfo.textContent = "";
    clockInfo.textContent = "CLOCK";
    infoLights.style.marginRight = "128px"; // ← aangepaste marge bij klokmodus
}

// Stop klokmodus
function stopClock() {
    clearInterval(clockInterval);
    clockInterval = null;
    clockInfo.textContent = "";
    infoLights.style.marginRight = "24px"; // ← normale marge buiten klokmodus
}

// Inputbron selecteren
function setSource(title, track = "") {
    stopClock();
    titleText.textContent = title;
    trackInfo.textContent = track;
    lastSource = { title, track };
}

// Bronknoppen
radioButton.addEventListener("click", () => {
    setSource("FM 88.10 MHz");
    toggleRadio();
});

auxButton.addEventListener("click", () => {
    setSource("AUX");
    radio.pause();
});

phonoButton.addEventListener("click", () => {
    setSource("PHONO");
    radio.pause();
});

tapeButton.addEventListener("click", () => {
    setSource("TAPE");
    radio.pause();
});

cdButton.addEventListener("click", () => {
    setSource("NO DISC");
    radio.pause();
});

// Power-knop
powerButton.addEventListener("click", () => {
    isPoweredOn = !isPoweredOn;

    if (isPoweredOn) {
        stopClock();

        if (lastSource) {
            setSource(lastSource.title, lastSource.track);
            if (lastSource.title.startsWith("FM")) {
                toggleRadio();
            }
        } else {
            setSource("AUX");
            lastSource = { title: "AUX", track: "" };
            radio.pause();
        }

    } else {
        showClock();
        radio.pause();
    }
});

// Speel radio af
function toggleRadio() {
    radio.play();
}
