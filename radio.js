const button = document.querySelector("button");

function toggleRadio() {
    if (radio.paused) {
        radio.play();
    } else {
        radio.pause();
    }
}