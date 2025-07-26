function makeVerticalRotatable(elementId, minDeg = 0, maxDeg = 360) {
  const knob = document.getElementById(elementId);
  let isDragging = false;
  let startY = 0;

  // Laad vorige rotatie uit localStorage
  let saved = localStorage.getItem("rotation-" + elementId);
  let currentRotation = saved ? parseFloat(saved) : minDeg;

  knob.style.transform = `rotate(${currentRotation}deg)`;

  knob.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startY = e.clientY;
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

    // Save in localStorage
    localStorage.setItem("rotation-" + elementId, currentRotation);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// Volume-knop:
makeVerticalRotatable("volume-knob", 25, 335);