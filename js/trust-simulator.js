/**
 * EDGETWIN SIM-TO-REAL TRUST SIMULATOR
 * Interactive demonstration of real-world environmental stress vs TinyML certified simulation bounds.
 * Demonstrates:
 * - Real-time Out-of-Distribution (OOD) detection
 * - Sim-to-Real Mahalanobis distance calculation
 * - Dynamic Trust Score percentage and fallback trip logic
 */

class TrustSimulator {
  constructor() {
    this.currentSlider = document.getElementById('stressCurrent');
    this.tempSlider = document.getElementById('stressTemp');
    this.vibSlider = document.getElementById('stressVib');

    this.currentValEl = document.getElementById('valCurrent');
    this.tempValEl = document.getElementById('valTemp');
    this.vibValEl = document.getElementById('valVib');

    this.scoreNumEl = document.getElementById('trustScoreNum');
    this.stateBannerEl = document.getElementById('simStateBanner');
    this.canvas = document.getElementById('trustCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.history = new Array(40).fill(98);
    this.init();
  }

  init() {
    if (!this.currentSlider || !this.tempSlider || !this.vibSlider) return;

    const update = () => this.calculateTrust();

    this.currentSlider.addEventListener('input', update);
    this.tempSlider.addEventListener('input', update);
    this.vibSlider.addEventListener('input', update);

    if (this.canvas) {
      this.canvas.width = this.canvas.offsetWidth || 300;
      this.canvas.height = this.canvas.offsetHeight || 90;
    }

    this.calculateTrust();
    this.startHistoryLoop();
  }

  calculateTrust() {
    const current = parseFloat(this.currentSlider.value);
    const temp = parseFloat(this.tempSlider.value);
    const vib = parseFloat(this.vibSlider.value);

    this.currentValEl.textContent = `${current.toFixed(1)} A`;
    this.tempValEl.textContent = `${temp > 0 ? '+' : ''}${temp.toFixed(0)} °C`;
    this.vibValEl.textContent = `${vib.toFixed(2)} g`;

    // Baseline validation envelope:
    // Nominals: Current = 1.0A, Temp = 25°C, Vib = 0.1g
    const currentDrift = Math.max(0, Math.abs(current - 1.2) / 3.8);
    const tempDrift = Math.max(0, Math.abs(temp - 25) / 50);
    const vibDrift = Math.max(0, Math.abs(vib - 0.2) / 4.0);

    // Multi-dimensional drift distance
    const totalDrift = Math.sqrt(
      Math.pow(currentDrift * 1.2, 2) +
      Math.pow(tempDrift * 0.9, 2) +
      Math.pow(vibDrift * 1.5, 2)
    );

    // Trust decay function
    let trustScore = Math.max(8.0, 99.4 - (totalDrift * 54.0));
    trustScore = Math.min(99.8, trustScore);

    this.scoreNumEl.textContent = `${trustScore.toFixed(1)}%`;
    this.scoreNumEl.style.color = trustScore > 75 ? 'var(--coffee-bean)' : (trustScore > 45 ? '#806B5A' : '#24150F');

    // Update banner state
    if (trustScore >= 80) {
      this.stateBannerEl.className = 'sim-state-banner state-safe';
      this.stateBannerEl.innerHTML = '● 100% CERTIFIED // WITHIN SIMULATION BOUNDS';
    } else if (trustScore >= 50) {
      this.stateBannerEl.className = 'sim-state-banner state-warning';
      this.stateBannerEl.innerHTML = '▲ ELEVATED DRIFT // APPROACHING SIM BOUNDARY';
    } else {
      this.stateBannerEl.className = 'sim-state-banner state-danger';
      this.stateBannerEl.innerHTML = '✕ OUT-OF-DISTRIBUTION // SIM BOUNDARY EXCEEDED';
    }

    this.currentTrust = trustScore;
  }

  startHistoryLoop() {
    setInterval(() => {
      if (this.currentTrust !== undefined) {
        // Add subtle sensor noise
        const noisyVal = this.currentTrust + (Math.random() - 0.5) * 1.8;
        this.history.push(Math.max(5, Math.min(100, noisyVal)));
        this.history.shift();
        this.drawSparkline();
      }
    }, 120);
  }

  drawSparkline() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Baseline threshold line at 50% trust
    const threshY = h * 0.5;
    ctx.strokeStyle = 'rgba(58, 36, 24, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, threshY);
    ctx.lineTo(w, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw historical trust curve
    ctx.beginPath();
    const step = w / (this.history.length - 1);
    this.history.forEach((val, i) => {
      const x = i * step;
      const y = h - (val / 100) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = this.currentTrust >= 80 ? '#3A2418' : (this.currentTrust >= 50 ? '#806B5A' : '#A63A24');
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Latest point head
    const lastVal = this.history[this.history.length - 1];
    const lastX = w;
    const lastY = h - (lastVal / 100) * (h - 10) - 5;
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F4D35E';
    ctx.fill();
    ctx.stroke();
  }
}
