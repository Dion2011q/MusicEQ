// eq-new.js

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

const bandSettings = [
  { range: [25, 99], gain: 0.8 },
  { range: [100, 249], gain: 0.9 },
  { range: [250, 649], gain: 1.0 },
  { range: [650, 1599], gain: 1.1 },
  { range: [1600, 4499], gain: 1.2 },
  { range: [4500, 11999], gain: 1.5 },
  { range: [12000, 20000], gain: 1.9 }
];

let audioCtx;
let analyser;
let sourceRadio = null; // Specifieke source node voor de radio
let sourceAudioPlayer = null; // Specifieke source node voor de audioplayer (MP3)
let currentConnectedSource = null; // Houdt bij welke source node nu verbonden is

let dataArray;
let bufferLength;

const previousValues = new Array(8).fill(0);
const decayDown = 0.4;
const decayUp = 0.7;

function setupVisualizer(audioElement) {
  if (audioCtx?.state === 'closed' || !audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Als er geen audioElement is, stop de visualizer en leeg het canvas
  if (!audioElement) {
    if (analyser) analyser.disconnect();
    if (sourceRadio) sourceRadio.disconnect(); // Ontkoppel radio source
    if (sourceAudioPlayer) sourceAudioPlayer.disconnect(); // Ontkoppel audioplayer source
    currentConnectedSource = null; // Reset de huidige verbonden source
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Leeg het canvas
    analyser = null; // Zet analyser op null om draw loop te stoppen
    return;
  }

  // Bepaal welke source node we moeten gebruiken/maken
  let newSourceNode = null;
  if (audioElement.id === 'radio') {
    if (!sourceRadio) {
      sourceRadio = audioCtx.createMediaElementSource(audioElement);
    }
    newSourceNode = sourceRadio;
  } else if (audioElement.id === 'audioPlayer') {
    if (!sourceAudioPlayer) {
      sourceAudioPlayer = audioCtx.createMediaElementSource(audioElement);
    }
    newSourceNode = sourceAudioPlayer;
  } else {
    // Dit zou niet moeten gebeuren met de huidige logica, maar voor de zekerheid
    console.warn("Onbekend audio-element voor visualizer:", audioElement.id);
    return;
  }

  // Alleen opnieuw verbinden als de source node verandert
  if (newSourceNode !== currentConnectedSource) {
    // Koppel de oude source los als die bestond
    if (currentConnectedSource) {
      currentConnectedSource.disconnect();
    }

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;

    newSourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    currentConnectedSource = newSourceNode; // Stel de nieuwe verbonden source in
  }

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  draw(); // Start de tekenlus
}

function draw() {
  if (!analyser) {
    // Stop de animatie als er geen analyser is (bijvoorbeeld als visualizer is uitgezet)
    return;
  }
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = 40;
  const gap = 10;
  const stepHeight = 16;
  const maxSteps = 14;

  for (let i = 0; i < 8; i++) {
    let value;
    if (i < 7) {
      const { range: [minF, maxF], gain } = bandSettings[i];
      value = averageInRange(minF, maxF) * gain;
    } else {
      const sum = dataArray.reduce((a, b) => a + b, 0);
      value = (sum / dataArray.length) * 3;
    }

    const targetSteps = Math.floor((value / 255) * maxSteps);

    // Vloeiende overgang van de bars
    if (targetSteps > previousValues[i]) {
      previousValues[i] += decayUp;
      if (previousValues[i] > targetSteps) previousValues[i] = targetSteps;
    } else {
      previousValues[i] -= decayDown;
      if (previousValues[i] < targetSteps) previousValues[i] = targetSteps;
    }

    const steps = Math.floor(previousValues[i]);
    const x = i * (barWidth + gap);

    for (let s = 0; s < steps; s++) {
      const y = canvas.height - (s + 1) * stepHeight;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, barWidth, stepHeight - 2);
    }
  }
}

function getIndexFromFreq(freq) {
  if (!audioCtx || !analyser) return 0;
  const nyquist = audioCtx.sampleRate / 2;
  return Math.floor(freq / nyquist * bufferLength);
}

function averageInRange(minFreq, maxFreq) {
  if (!dataArray || !bufferLength) return 0;
  const start = getIndexFromFreq(minFreq);
  const end = getIndexFromFreq(maxFreq);
  let sum = 0, count = 0;
  for (let i = start; i <= end; i++) {
    sum += dataArray[i];
    count++;
  }
  return count > 0 ? sum / count : 0;
}