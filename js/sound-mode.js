    const modes = document.querySelectorAll('.sound-mode');
    let index = 0;

    function updateSelected() {
        modes.forEach((mode, i) => {
            mode.classList.toggle('selected', i === index);
        });
    }

    document.getElementById('prev').addEventListener('click', () => {
        index = (index - 1 + modes.length) % modes.length;
        updateSelected();
    });

    document.getElementById('next').addEventListener('click', () => {
        index = (index + 1) % modes.length;
        updateSelected();
    });