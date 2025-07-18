  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');
  const fileInput = document.getElementById('audioFile');

  const bandSettings = [
    { range: [25, 99], gain: 0.8 },
    { range: [100, 249], gain: 0.9 },
    { range: [250, 649], gain: 1.0 },
    { range: [650, 1599], gain: 1.1 },
    { range: [1600, 4499], gain: 1.2 },
    { range: [4500, 11999], gain: 1.5 },
    { range: [12000, 20000], gain: 1.9 }
  ];

  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.controls = true;
    document.body.appendChild(audio);
    audio.play();

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const sampleRate = audioCtx.sampleRate;
    const dataArray = new Uint8Array(bufferLength);

    function getIndexFromFreq(freq) {
      const nyquist = sampleRate / 2;
      return Math.floor(freq / nyquist * bufferLength);
    }

    function averageInRange(minFreq, maxFreq) {
      const start = getIndexFromFreq(minFreq);
      const end = getIndexFromFreq(maxFreq);
      let sum = 0;
      let count = 0;
      for (let i = start; i <= end; i++) {
        sum += dataArray[i];
        count++;
      }
      return count > 0 ? sum / count : 0;
    }

    const previousValues = new Array(8).fill(0);
    const decayDown = 0.4; // snelheid naar beneden
    const decayUp = 0.7;   // snelheid naar boven

    function draw() {
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
          value = (sum / dataArray.length) * 4.2;
        }

        const targetSteps = Math.floor((value / 255) * maxSteps);

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

    draw();
  });