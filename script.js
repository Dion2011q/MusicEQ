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

let isPoweredOn = false;
let clockInterval = null;
let lastSource = null; // <- Onthoudt de laatst gekozen bron

// Bij het laden van de pagina: standaard power uit
window.addEventListener("DOMContentLoaded", () => {
    isPoweredOn = false;

    // Direct klok tonen zonder vertraging
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    titleText.textContent = `${hours}:${minutes}`;
    trackInfo.textContent = "";
    clockInfo.textContent = "CLOCK";

    startClock(); // en daarna updaten per seconde
    radio.pause();
});

// Hulpfunctie om klok te starten
function startClock() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        titleText.textContent = `${hours}:${minutes}`;
        trackInfo.textContent = "";
        clockInfo.textContent = "CLOCK";
    }
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
}

// Hulpfunctie om klok te stoppen
function stopClock() {
    clearInterval(clockInterval);
    clockInterval = null;
}

// Hulpfunctie om een inputbron te kiezen
function setSource(title, track = "") {
    stopClock(); // klok stoppen bij power ON en bronselectie
    titleText.textContent = title;
    trackInfo.textContent = track;
    lastSource = { title, track }; // <- Sla de gekozen bron op
}

// Bron-knoppen
radioButton.addEventListener("click", () => {
    setSource("FM 88.10 MHz");
    toggleRadio();
    clockInfo.textContent = "";
});

auxButton.addEventListener("click", () => {
    setSource("AUX");
    radio.pause();
    clockInfo.textContent = "";
});

phonoButton.addEventListener("click", () => {
    setSource("PHONO");
    radio.pause();
    clockInfo.textContent = "";
});

tapeButton.addEventListener("click", () => {
    setSource("TAPE");
    radio.pause();
    clockInfo.textContent = "";
});

cdButton.addEventListener("click", () => {
    setSource("NO DISC");
    radio.pause();
    clockInfo.textContent = "";
});

// Power-knop
powerButton.addEventListener("click", () => {
    isPoweredOn = !isPoweredOn;

    if (isPoweredOn) {
        stopClock(); // klok uit als power aan

        if (lastSource) {
            setSource(lastSource.title, lastSource.track); // <- Ga terug naar vorige bron
            if (lastSource.title.startsWith("FM")) {
                toggleRadio();
            }
        } else {
            // Fallback naar AUX
            setSource("AUX");
            lastSource = { title: "AUX", track: "" };
            radio.pause();
        }

    } else {
        startClock(); // klok aan als power uit
        radio.pause();
    }
});

// Speel radio af
function toggleRadio() {
    radio.play();
}
