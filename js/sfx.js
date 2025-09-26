// Audio-elementen
const soundA = document.getElementById("poweron");   // bij inschakelen
const soundB = document.getElementById("amp");       // 5 sec later na A
const soundC = document.getElementById("poweroff");  // bij uitschakelen

// Helper: reset naar begin en speel af
function resetAndPlay(audio) {
  audio.currentTime = 0;
  audio.play();
}

// Toggle houdt bij of we 'aan' of 'uit' staan
let isOn = false;
let bTimeout = null;

function handlePowerClick() {
  // Stop geplande amp-geluid als er opnieuw geklikt wordt
  if (bTimeout) {
    clearTimeout(bTimeout);
    bTimeout = null;
  }

  if (!isOn) {
    // Zet aan: speel poweron
    resetAndPlay(soundA);

    // Na 5 sec automatisch amp
    bTimeout = setTimeout(() => {
      resetAndPlay(soundB);
    }, 4500); // 4500 ms = 4.5 sec na start poweron

    isOn = true;
  } else {
    // Zet uit: speel poweroff
    resetAndPlay(soundC);
    isOn = false;
  }
}

// Koppel de functie zodra de pagina geladen is
document.addEventListener("DOMContentLoaded", () => {
  const powerButton = document.getElementById("power-button");
  powerButton.addEventListener("click", handlePowerClick);
});
