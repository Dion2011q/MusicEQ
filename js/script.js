// script.js

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
const stereoLight = document.getElementById("stereo-light");
const tunedLight = document.getElementById("tuned-light");

// Audio elementen
const radio = document.getElementById("radio");
const audioPlayer = document.getElementById("audioPlayer"); // Dit is de speler voor MP3-bestanden

// MP3-bestandsinput
const audioFileInput = document.getElementById("audioFile");

let isPoweredOn = false;
let clockInterval = null;
let lastSource = null;

// MAAK currentAudio GLOBAAL TOEGANKELIJK
window.currentAudio = null; // Houdt de actieve audiobron bij

// Bij het laden van de pagina: klokmodus aan
window.addEventListener("DOMContentLoaded", () => {
    isPoweredOn = false;
    showClock();
    // Zorg ervoor dat de audioPlayers initieel gepauzeerd zijn
    radio.pause();
    audioPlayer.pause();
    window.currentAudio = null; // Zorg dat deze ook gereset is
});

// Start klokmodus
function showClock() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        titleText.textContent = `${hours}:${minutes}`;
    }

    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    trackInfo.textContent = "";
    clockInfo.textContent = "CLOCK";
    infoLights.style.marginRight = "128px";
}

// Stop klokmodus
function stopClock() {
    clearInterval(clockInterval);
    clockInterval = null;
    clockInfo.textContent = "";
    infoLights.style.marginRight = "24px";
}

// Inputbron selecteren
function setSource(title, track = "") {
    stopClock();
    titleText.textContent = title;
    trackInfo.textContent = track;
    lastSource = { title, track };
}

// Functie om de audio-input te schakelen
function switchInput(type) {
    // Pauzeer *alle* potentiële audiobronnen voordat we een nieuwe starten
    if (radio) radio.pause();
    if (audioPlayer) audioPlayer.pause();

    // Reset lichten
    stereoLight.textContent = "";
    tunedLight.textContent = "";

    // Werk de huidige audiobron bij (nu via window.currentAudio)
    let newAudioSource = null;

    switch (type) {
        case 'radio':
            setSource("FM 88.10 MHz");
            stereoLight.textContent = "STEREO";
            tunedLight.textContent = "TUNED";
            radio.play().catch(err => {
                console.error("Radio kan niet afspelen:", err);
            });
            newAudioSource = radio;
            break;
        case 'aux':
            setSource("AUX");
            newAudioSource = null; // Geen actieve audio voor AUX tenzij extern aangesloten
            break;
        case 'phono':
            setSource("PHONO");
            newAudioSource = null;
            break;
        case 'tape':
            setSource("TAPE");
            newAudioSource = null;
            break;
        case 'cd':
            setSource("NO DISC");
            newAudioSource = null;
            break;
        case 'mp3':
            newAudioSource = audioPlayer;
            break;
        default:
            newAudioSource = null;
            break;
    }

    // Alleen setupVisualizer aanroepen als de bron daadwerkelijk verandert
    if (newAudioSource !== window.currentAudio) { // Vergelijk met window.currentAudio
        window.currentAudio = newAudioSource; // Update de globale variabele
        setupVisualizer(window.currentAudio);
    }
}

// Event listeners voor inputknoppen
radioButton.addEventListener("click", () => switchInput('radio'));
auxButton.addEventListener("click", () => switchInput('aux'));
phonoButton.addEventListener("click", () => switchInput('phono'));
tapeButton.addEventListener("click", () => switchInput('tape'));
cdButton.addEventListener("click", () => setSource("NO DISC")); // CD heeft geen switchInput nodig als er geen audio is
mp3Button.addEventListener("click", () => {
    // Alleen triggeren als we nog niet in de MP3-modus zitten of er geen bestand is
    if (window.currentAudio !== audioPlayer || !audioPlayer.src) { // Vergelijk met window.currentAudio
        audioFileInput.click(); // Simuleer een klik op de file input
    }
});


// Power-knop
powerButton.addEventListener("click", () => {
    isPoweredOn = !isPoweredOn;

    if (isPoweredOn) {
        stopClock();
        if (lastSource) {
            setSource(lastSource.title, lastSource.track);
            if (lastSource.title.includes("FM")) {
                switchInput('radio');
            } else if (lastSource.title === "MP3") {
                 if (audioPlayer.src) {
                    audioPlayer.play().catch(err => console.error("Kan MP3 niet afspelen na power-on:", err));
                    switchInput('mp3');
                } else {
                    setSource("AUX");
                    switchInput('aux');
                }
            }
             else {
                switchInput('aux');
            }
        } else {
            setSource("AUX");
            switchInput('aux');
        }
    } else {
        showClock();
        if (radio) radio.pause();
        if (audioPlayer) audioPlayer.pause();
        stereoLight.textContent = "";
        tunedLight.textContent = "";
        setupVisualizer(null);
        window.currentAudio = null; // Reset de globale variabele bij uitzetten
    }
});

// Event listener voor het kiezen van een MP3-bestand
audioFileInput.addEventListener('change', () => {
    const file = audioFileInput.files[0];
    if (!file) {
        setSource("GEEN BESTAND");
        switchInput('aux');
        return;
    }

    const isMp3 = file.name.toLowerCase().endsWith('.mp3') || file.type === 'audio/mpeg';

    if (!isMp3) {
        alert("Dit is geen geldig MP3-bestand.");
        setSource("ONGELDIG BESTAND");
        switchInput('aux');
        return;
    }

    const url = URL.createObjectURL(file);
    audioPlayer.src = url;
    audioPlayer.load();

    setSource("MP3", file.name); // Toon de bestandsnaam als trackinfo

    audioPlayer.play().then(() => {
        switchInput('mp3');
    }).catch(err => {
        console.error("Kan MP3 niet afspelen:", err);
        setSource("SPEELFOUT MP3");
        switchInput('aux');
    });
});