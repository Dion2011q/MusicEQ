const modes = document.querySelectorAll('.sound-mode');
    let index = 0; // Standaardwaarde, overschreven door localStorage

    // Functie om de geselecteerde modus bij te werken
    function updateSelected() {
        modes.forEach((mode, i) => {
            mode.classList.toggle('selected', i === index);
        });
        // Sla de geselecteerde index op in localStorage
        localStorage.setItem('selectedSoundModeIndex', index);
    }

    // Controleer of er een eerder opgeslagen index is bij het laden van de pagina
    const storedIndex = localStorage.getItem('selectedSoundModeIndex');
    if (storedIndex !== null) {
        index = parseInt(storedIndex, 10); // Converteer de string terug naar een nummer
    } else {
        // Als er nog niets is opgeslagen, stel "D.CLUB" in als standaard
        // Dit is de eerste modus (index 0) in je lijst
        index = 0;
    }

    // Initialiseer de selectie bij het laden van de pagina
    updateSelected();

    // Event listeners voor 'prev' en 'next' knoppen
    // Zorg ervoor dat je deze knoppen in je HTML hebt (id="prev" en id="next")
    document.getElementById('prev').addEventListener('click', () => {
        index = (index - 1 + modes.length) % modes.length;
        updateSelected();
    });

    document.getElementById('next').addEventListener('click', () => {
        index = (index + 1) % modes.length;
        updateSelected();
    });

    // Optioneel: Klik op een modus om deze te selecteren
    modes.forEach((mode, i) => {
        mode.addEventListener('click', () => {
            index = i;
            updateSelected();
        });
    });