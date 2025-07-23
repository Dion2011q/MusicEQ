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
let currentAudio = null; // Houdt de actieve audiobron bij

// Bij het laden van de pagina: klokmodus aan
window.addEventListener("DOMContentLoaded", () => {
    isPoweredOn = false;
    showClock();
    // Zorg ervoor dat de audioPlayers initieel gepauzeerd zijn
    radio.pause();
    audioPlayer.pause();
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

    // Werk de huidige audiobron bij
    let newAudioSource = null;

    switch (type) {
        case 'radio':
            setSource("FM 88.10 MHz");
            stereoLight.textContent = "STEREO";
            tunedLight.textContent = "TUNED";
            // radio.currentTime = 0; // Optioneel: begin radio steeds opnieuw
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
            // De MP3 wordt afgespeeld wanneer een bestand is geselecteerd
            // Deze case wordt getriggerd wanneer een MP3-bestand is geladen en afgespeeld
            newAudioSource = audioPlayer;
            // setSource wordt al in de change event listener van audioFileInput gezet
            break;
        default:
            newAudioSource = null;
            break;
    }

    // Alleen setupVisualizer aanroepen als de bron daadwerkelijk verandert
    if (newAudioSource !== currentAudio) {
        currentAudio = newAudioSource;
        setupVisualizer(currentAudio);
    }
}

// Event listeners voor inputknoppen
radioButton.addEventListener("click", () => switchInput('radio'));
auxButton.addEventListener("click", () => switchInput('aux'));
phonoButton.addEventListener("click", () => switchInput('phono'));
tapeButton.addEventListener("click", () => switchInput('tape'));
cdButton.addEventListener("click", () => switchInput('cd'));
mp3Button.addEventListener("click", () => {
    // Alleen triggeren als we nog niet in de MP3-modus zitten of er geen bestand is
    if (currentAudio !== audioPlayer || !audioPlayer.src) {
        audioFileInput.click(); // Simuleer een klik op de file input
    }
});


// Power-knop
powerButton.addEventListener("click", () => {
    isPoweredOn = !isPoweredOn;

    if (isPoweredOn) {
        stopClock();
        // Na aanzetten, ga naar de laatst bekende bron of naar AUX als er geen is
        if (lastSource) {
            setSource(lastSource.title, lastSource.track);
            // Roep de juiste switchInput aan afhankelijk van lastSource
            if (lastSource.title.includes("FM")) {
                switchInput('radio');
            } else if (lastSource.title === "MP3") {
                 // Als de laatste bron MP3 was, controleer of er een bestand is geladen
                if (audioPlayer.src) {
                    audioPlayer.play().catch(err => console.error("Kan MP3 niet afspelen na power-on:", err));
                    switchInput('mp3'); // activeer de visualizer voor mp3
                } else {
                    setSource("AUX"); // Anders terug naar AUX
                    switchInput('aux');
                }
            }
             else {
                switchInput('aux'); // Standaard naar AUX
            }
        } else {
            setSource("AUX");
            switchInput('aux');
        }
    } else {
        showClock();
        // Pauzeer beide spelers bij uitschakelen
        if (radio) radio.pause();
        if (audioPlayer) audioPlayer.pause();
        stereoLight.textContent = "";
        tunedLight.textContent = "";
        setupVisualizer(null); // Visualizer uitschakelen bij uitzetten
        currentAudio = null; // Reset de huidige audiobron
    }
});

// Event listener voor het kiezen van een MP3-bestand
audioFileInput.addEventListener('change', () => {
    const file = audioFileInput.files[0];
    if (!file) {
        setSource("GEEN BESTAND");
        switchInput('aux'); // Ga terug naar AUX als geen bestand is geselecteerd
        return;
    }

    const isMp3 = file.name.toLowerCase().endsWith('.mp3') || file.type === 'audio/mpeg';

    if (!isMp3) {
        alert("Dit is geen geldig MP3-bestand.");
        setSource("ONGELDIG BESTAND");
        switchInput('aux'); // Ga terug naar AUX bij ongeldig bestand
        return;
    }

    const url = URL.createObjectURL(file);
    audioPlayer.src = url;
    audioPlayer.load();

    setSource("MP3", "");

    // Speel de MP3 af en activeer de visualizer
    audioPlayer.play().then(() => {
        // Alleen de switchInput oproepen als het afspelen succesvol is
        switchInput('mp3');
    }).catch(err => {
        console.error("Kan MP3 niet afspelen:", err);
        setSource("SPEELFOUT MP3");
        switchInput('aux'); // Ga terug naar AUX bij afspeelfout
    });
});