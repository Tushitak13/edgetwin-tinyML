/**
 * EDGETWIN DIGITAL TWIN PROJECTION ENGINE
 * Generates an engineering wireframe visualization floating above the physical hardware:
 * - Thin Butter Yellow lines & isometric perspective geometry
 * - Sim-to-Real Trust Envelope (certified simulation boundaries)
 * - Kinematic motor rotor wireframe with subtle rotation
 * - Dimension calipers & telemetry coordinates
 * 
 * Strict Colors:
 * - Butter Yellow (#F4D35E)
 * - Soft Butter (#FFE89A)
 * - Muted Coffee (#806B5A)
 */

class DigitalTwinEngine {
  constructor(canvasSelector, hudSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.hud = document.querySelector(hudSelector);
    this.isVisible = false;
    this.phase = 0;
    this.animationId = null;
    this.angle = 0;
    this.pulseT = 0;

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  activate() {
    if (!this.canvas) return;
    this.canvas.classList.add('visible');
    this.isVisible = true;

    if (this.hud) {
      setTimeout(() => {
        this.hud.classList.add('visible');
      }, 400);
    }

    // Trigger status bar online indicator
    const statusIndicator = document.querySelector('.system-status-indicator');
    if (statusIndicator) {
      statusIndicator.innerHTML = `
        <span class="status-dot-active"></span>
        <span>● PHYSICAL SYSTEM ONLINE</span>
      `;
      statusIndicator.style.borderColor = 'var(--butter-yellow)';
    }

    const tagStatement = document.querySelector('.stage-statement-tag');
    if (tagStatement) {
      tagStatement.innerHTML = `SIM-TO-REAL TRUST LAYER`;
      tagStatement.style.color = 'var(--butter-yellow)';
    }

    this.animate();
  }

  animate() {
    if (!this.isVisible || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.angle += 0.015;
    this.pulseT += 0.04;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerX = w * 0.58;
    const centerY = h * 0.32;

    this.drawEngineeringPlanes(centerX, centerY);
    this.drawSimToRealEnvelope(centerX, centerY);
    this.drawKinematicRotorTwin(centerX, centerY);
    this.drawTelemetryCallouts(centerX, centerY);

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawEngineeringPlanes(cx, cy) {
    const ctx = this.ctx;
    ctx.save();

    // Projected isometric ground plane for the digital twin
    ctx.strokeStyle = 'rgba(244, 211, 94, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    const gridSize = 140;
    const steps = 6;
    for (let i = -steps; i <= steps; i++) {
      // Iso X grid
      const x1 = cx + (i * 20) - gridSize;
      const y1 = cy + (gridSize * 0.45);
      const x2 = cx + (i * 20) + gridSize;
      const y2 = cy - (gridSize * 0.45);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Iso Y grid
      const y3 = cy - (gridSize * 0.45);
      const y4 = cy + (gridSize * 0.45);
      ctx.beginPath();
      ctx.moveTo(cx - (i * 20) - gridSize, y3);
      ctx.lineTo(cx - (i * 20) + gridSize, y4);
      ctx.stroke();
    }

    // Origin Datum Marker
    ctx.setLineDash([]);
    ctx.strokeStyle = '#F4D35E';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  drawSimToRealEnvelope(cx, cy) {
    const ctx = this.ctx;
    ctx.save();

    // Convex bounding polygon representing the Sim-to-Real Safe Verification Envelope
    const pulse = 1 + Math.sin(this.pulseT) * 0.03;
    const rx = 160 * pulse;
    const ry = 80 * pulse;

    ctx.strokeStyle = '#F4D35E';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 3]);

    // Bounding Box Frame
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Corner Calipers
    ctx.setLineDash([]);
    ctx.strokeStyle = '#FFE89A';
    ctx.lineWidth = 2;

    const corners = [
      { x: cx - rx, y: cy },
      { x: cx + rx, y: cy },
      { x: cx, y: cy - ry },
      { x: cx, y: cy + ry }
    ];

    corners.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F4D35E';
      ctx.fill();
    });

    // Technical Label
    ctx.font = '7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFE89A';
    ctx.fillText('SIM-TO-REAL TRUST ENVELOPE [CERTIFIED REGION]', cx - 110, cy - ry - 8);

    ctx.restore();
  }

  drawKinematicRotorTwin(cx, cy) {
    const ctx = this.ctx;
    ctx.save();

    // Wireframe Motor Cylinder
    const cylW = 75;
    const cylH = 45;
    const offsetZ = -15;

    ctx.strokeStyle = '#F4D35E';
    ctx.lineWidth = 1.2;

    // Rear Oval
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy + offsetZ, 14, 28, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Front Oval
    ctx.beginPath();
    ctx.ellipse(cx + 45, cy + offsetZ, 14, 28, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Cylinder connecting lines
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + offsetZ - 28);
    ctx.lineTo(cx + 45, cy + offsetZ - 28);
    ctx.moveTo(cx - 30, cy + offsetZ + 28);
    ctx.lineTo(cx + 45, cy + offsetZ + 28);
    ctx.stroke();

    // Rotating Shaft & Vector Axis
    const shaftX = cx + 45;
    const shaftY = cy + offsetZ;
    const shaftLen = 40;

    ctx.strokeStyle = '#FFE89A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shaftX, shaftY);
    ctx.lineTo(shaftX + shaftLen, shaftY);
    ctx.stroke();

    // Rotating Vector Spokes (representing real-time sensor angle)
    ctx.strokeStyle = '#F4D35E';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const a = this.angle + (i * Math.PI / 2);
      const spY = Math.sin(a) * 22;
      const spZ = Math.cos(a) * 8;
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy + offsetZ);
      ctx.lineTo(cx + 10 + spZ, cy + offsetZ + spY);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawTelemetryCallouts(cx, cy) {
    const ctx = this.ctx;
    ctx.save();

    ctx.font = '7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#806B5A';

    // Callout 1: Angular Velocity
    const rotSpeed = (248.4 + Math.sin(this.angle * 2) * 1.8).toFixed(1);
    ctx.fillText(`ROT_VEL // ${rotSpeed} rad/s`, cx + 92, cy - 24);
    ctx.strokeStyle = 'rgba(244, 211, 94, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cx + 75, cy - 15);
    ctx.lineTo(cx + 90, cy - 26);
    ctx.stroke();

    // Callout 2: TinyML Residual Drift
    const drift = (0.014 + Math.sin(this.pulseT) * 0.003).toFixed(3);
    ctx.fillText(`DRIFT_RESIDUAL // Δ ${drift}`, cx - 145, cy + 50);
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy + 35);
    ctx.lineTo(cx - 85, cy + 46);
    ctx.stroke();

    ctx.restore();
  }

  reset() {
    this.isVisible = false;
    if (this.canvas) {
      this.canvas.classList.remove('visible');
    }
    if (this.hud) {
      this.hud.classList.remove('visible');
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
