// controls.js

function makeVerticalRotatable(elementId, minDeg = 0, maxDeg = 360, onRotateCallback = null) {
  const knob = document.getElementById(elementId);
  let isDragging = false;
  let startY = 0;

  const rotationRange = maxDeg - minDeg;

  let savedRotation = localStorage.getItem("rotation-" + elementId);
  let currentRotation = savedRotation ? parseFloat(savedRotation) : minDeg;
  currentRotation = Math.max(minDeg, Math.min(maxDeg, currentRotation));

  knob.style.transform = `rotate(${currentRotation}deg)`;

  if (onRotateCallback) {
    const percentage = (currentRotation - minDeg) / rotationRange;
    onRotateCallback(percentage);
  }

  knob.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startY = e.clientY;
    knob.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaY = startY - e.clientY;
    const sensitivity = 1.5;
    let newRotation = currentRotation + deltaY * sensitivity;

    newRotation = Math.max(minDeg, Math.min(maxDeg, newRotation));

    knob.style.transform = `rotate(${newRotation}deg)`;
    currentRotation = newRotation;
    startY = e.clientY;

    localStorage.setItem("rotation-" + elementId, currentRotation);

    if (onRotateCallback) {
      const percentage = (currentRotation - minDeg) / rotationRange;
      onRotateCallback(percentage);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    knob.style.cursor = "grab";
  });
}

// Functie om het volume van de *actieve* audio-element in te stellen
function setAudioVolume(volumePercentage) {
  // Controleer of er een actieve audiobron is ingesteld
  if (window.currentAudio) {
    window.currentAudio.volume = Math.max(0, Math.min(1, volumePercentage));
  }
}

// Volume-knop:
// Geen audioIdToControl meer nodig, we gebruiken window.currentAudio
makeVerticalRotatable("volume-knob", 25, 335, (percentage) => {
  setAudioVolume(percentage); // Roep setAudioVolume aan zonder specifieke ID
});