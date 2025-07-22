// file script.js

// Constants IDs
const titleText = document.getElementById("title-text");
const radioButton = document.getElementById("radio-button");
const auxButton = document.getElementById("aux-button");
const phonoButton = document.getElementById("phono-button");
const cdButton = document.getElementById("cd-button");
const tapeButton = document.getElementById("tape-button");
const mp3Button = document.getElementById("mp3-button");
const powerButton = document.getElementById("power-button");
const trackInfo = document.getElementById("track-info");
const clockInfo = document.getElementById("clock-info");
const infoLights = document.getElementById("info-lights");
const button = document.querySelector("button");

let isPoweredOn = false;
let clockInterval = null;
let lastSource = null;

// Bij het laden van de pagina: klokmodus aan
window.addEventListener("DOMContentLoaded", () => {
    isPoweredOn = false;
    showClock();
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

    try {
        radio.currentTime = 0; // optioneel: begin opnieuw
        radio.play().catch(err => {
            console.error("Radio kan niet afspelen:", err);
        });
    } catch (e) {
        console.error("Fout bij radio afspelen:", e);
    }
});

auxButton.addEventListener("click", () => {
    setSource("AUX");
    radio.pause(); // radio pauzeren als je wegschakelt
});

phonoButton.addEventListener("click", () => {
    setSource("PHONO");
    radio.pause(); // radio pauzeren als je wegschakelt
});

tapeButton.addEventListener("click", () => {
    setSource("TAPE");
    radio.pause(); // radio pauzeren als je wegschakelt
});

cdButton.addEventListener("click", () => {
    setSource("NO DISC");
    radio.pause(); // radio pauzeren als je wegschakelt
});

// Power-knop
powerButton.addEventListener("click", () => {
    isPoweredOn = !isPoweredOn;

    if (isPoweredOn) {
        stopClock();
        setSource("AUX");
        lastSource = { title: "AUX", track: "" };
    } else {
        showClock();
        radio.pause(); // radio pauzeren als je wegschakelt
    }
});



// mp3 player

mp3Button.addEventListener("click", () => {
    const fileInput = document.getElementById("audioFile");
    if (fileInput.files.length === 0) {
        alert("Selecteer eerst een MP3-bestand.");
        return;
    }

    const file = fileInput.files[0];
    const isMp3 = file.name.toLowerCase().endsWith(".mp3") || file.type === "audio/mpeg";
    if (!isMp3) {
        alert("Dit is geen geldig MP3-bestand.");
        return;
    }

    const url = URL.createObjectURL(file);
    const player = document.getElementById("audioPlayer");

    setSource("MP3", file.name);
    player.src = url;
    player.load();
    player.play().catch(err => {
        console.error("Kan MP3 niet afspelen:", err);
    });
});

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      if (mp3Audio) {
        mp3Audio.pause();
        mp3Audio.remove();
        mp3Audio = null;
      }

      mp3Audio = new Audio();
      mp3Audio.src = URL.createObjectURL(file);
      mp3Audio.controls = true;
      mp3Audio.style.marginTop = '20px';
      document.body.appendChild(mp3Audio);

      mp3Audio.addEventListener('play', () => {
        switchInput('mp3');
      });

      mp3Audio.load(); // Laat gebruiker zelf op play klikken
    });