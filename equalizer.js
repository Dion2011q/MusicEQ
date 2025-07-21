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

    let audioCtx, analyser, source, dataArray, bufferLength;
    const previousValues = new Array(8).fill(0);
    const decayDown = 0.4;
    const decayUp = 0.7;

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.controls = true;
      audio.autoplay = false;
      document.body.appendChild(audio);

      audio.addEventListener('play', () => {
        // Start AudioContext pas na 'play'
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          source = audioCtx.createMediaElementSource(audio);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.6;

          source.connect(analyser);
          analyser.connect(audioCtx.destination);

          bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);

          draw();
        }
      });

      function getIndexFromFreq(freq) {
        const nyquist = audioCtx.sampleRate / 2;
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
    });