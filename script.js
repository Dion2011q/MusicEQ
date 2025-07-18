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
const button = document.querySelector("button");

let isPoweredOn = false;
let clockInterval = null;

// Hulpfunctie om klok te starten
function startClock() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        titleText.textContent = `${hours}:${minutes}`;
        trackInfo.textContent = "";
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
    if (!isPoweredOn) return;
    stopClock(); // klok stoppen bij power ON en bronselectie
    titleText.textContent = title;
    trackInfo.textContent = track;
}

// Bron-knoppen
radioButton.addEventListener("click", () => {
    setSource("FM 88.10 MHz");
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
        stopClock(); // klok uit als power aan
        titleText.textContent = "";
        trackInfo.textContent = "";
    } else {
        startClock(); // klok aan als power uit
    }
});

function toggleRadio() {
        radio.play();
}