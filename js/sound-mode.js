const modes = document.querySelectorAll('.sound-mode');
let index = 0; // Standaardwaarde, overschreven door localStorage
let soundEffectsEnabled = true; // Nieuwe variabele om de status bij te houden

// Functie om de geselecteerde modus bij te werken
function updateSelected() {
    modes.forEach((mode, i) => {
        // De 'selected' klasse wordt alleen toegevoegd als soundEffectsEnabled true is
        mode.classList.toggle('selected', i === index && soundEffectsEnabled);
    });
    // Sla de geselecteerde index en de status op in localStorage
    localStorage.setItem('selectedSoundModeIndex', index);
    localStorage.setItem('soundEffectsEnabled', soundEffectsEnabled);
}

// Controleer of er eerder opgeslagen waarden zijn bij het laden
const storedIndex = localStorage.getItem('selectedSoundModeIndex');
const storedEnabled = localStorage.getItem('soundEffectsEnabled');

if (storedIndex !== null) {
    index = parseInt(storedIndex, 10);
} else {
    index = 0; // Standaardmodus is de eerste
}

if (storedEnabled !== null) {
    // Converteer de opgeslagen string "true" of "false" naar een boolean
    soundEffectsEnabled = storedEnabled === 'true';
}

// Initialiseer de selectie bij het laden van de pagina
updateSelected();

// Event listeners voor 'prev' en 'next' knoppen
document.getElementById('prev').addEventListener('click', () => {
    // Navigeer alleen als de effecten zijn ingeschakeld
    if (soundEffectsEnabled) {
        index = (index - 1 + modes.length) % modes.length;
        updateSelected();
    }
});

document.getElementById('next').addEventListener('click', () => {
    // Navigeer alleen als de effecten zijn ingeschakeld
    if (soundEffectsEnabled) {
        index = (index + 1) % modes.length;
        updateSelected();
    }
});

// Klik op een modus om deze te selecteren
modes.forEach((mode, i) => {
    mode.addEventListener('click', () => {
        // Selecteer alleen als de effecten zijn ingeschakeld
        if (soundEffectsEnabled) {
            index = i;
            updateSelected();
        }
    });
});

// Event listener voor de 'sound-effect' button om de selectie aan/uit te zetten
document.getElementById('sound-effect').addEventListener('click', () => {
    // Wissel de status
    soundEffectsEnabled = !soundEffectsEnabled;

    // Pas de weergave aan op basis van de nieuwe status
    updateSelected();
    }
);