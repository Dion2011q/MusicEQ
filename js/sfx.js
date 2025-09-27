// Verzamel alle audio in een object voor overzicht
const sounds = {
  powerOn: document.getElementById("poweron"),
  amp: document.getElementById("amp"),
  powerOff: document.getElementById("poweroff"),
  fm: document.getElementById("fm"),
  aux: document.getElementById("aux"),
  phono: document.getElementById("phono"),
  abass: document.getElementById("abass"),
};

// Helper: reset naar begin en speel af
function resetAndPlay(audio) {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
}

// Toggle bijhouden of power aan of uit is
let isOn = false;
let ampTimeout = null;

function handlePowerClick() {
  // Stop geplande amp sound als opnieuw geklikt wordt
  if (ampTimeout) {
    clearTimeout(ampTimeout);
    ampTimeout = null;
  }

  if (!isOn) {
    resetAndPlay(sounds.powerOn);

    // na 4.5 sec automatisch amp
    ampTimeout = setTimeout(() => {
      resetAndPlay(sounds.amp);
    }, 4500);

    isOn = true;
  } else {
    resetAndPlay(sounds.powerOff);
    isOn = false;
  }
}

// Input source handlers → altijd afspelen, ook al is power uit
function handleInputClick(source) {
  resetAndPlay(sounds[source]);
}

// Extra knop handler → alleen bij power aan
function handleABassClick() {
  if (!isOn) return;
  resetAndPlay(sounds.abass);
}

// Event listeners koppelen zodra de pagina geladen is
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("power-button")
    .addEventListener("click", handlePowerClick);

  document.getElementById("radio-button")
    .addEventListener("click", () => handleInputClick("fm"));

  document.getElementById("aux-button")
    .addEventListener("click", () => handleInputClick("aux"));

  document.getElementById("phono-button")
    .addEventListener("click", () => handleInputClick("phono"));

  document.querySelector(".a-bass")
    .addEventListener("click", handleABassClick);
});
