/**
 * EDGETWIN DATA PULSE ENGINE
 * Simulates electrical telemetry pulses traveling along connection traces
 * from physical sensors to the ESP32 edge MCU, and upwards to the Digital Twin.
 * 
 * Strict Colors:
 * - Wires: Coffee Bean (#3A2418) / Deep Espresso (#24150F)
 * - Data Pulses: Butter Yellow (#F4D35E) / Soft Butter (#FFE89A)
 */

class DataPulseEngine {
  constructor(canvasSelector, physicsStage) {
    this.canvas = document.querySelector(canvasSelector);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.physicsStage = physicsStage;
    this.wireRoutes = [];
    this.pulses = [];
    this.isRunning = false;
    this.animationId = null;

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    if (this.isRunning) {
      this.buildWireRoutes();
    }
  }

  startAfterDelay(delayMs = 600) {
    setTimeout(() => {
      this.buildWireRoutes();
      this.isRunning = true;
      this.animate();
    }, delayMs);
  }

  buildWireRoutes() {
    this.wireRoutes = [];

    const getCoord = (id, offsetX = 0, offsetY = 0) => {
      const b = this.physicsStage.getComponentBounds(id);
      if (!b) return null;
      return { x: b.x + offsetX, y: b.y + offsetY };
    };

    const esp32 = getCoord('esp32', -20, 0);
    const esp32Right = getCoord('esp32', 30, 0);
    const mpu = getCoord('mpu6050', 10, -5);
    const dht = getCoord('dht22', 0, 15);
    const acs = getCoord('acs712', -10, 0);
    const l298n = getCoord('l298n', -20, 0);
    const motor = getCoord('motor', -35, 0);
    const oled = getCoord('oled', 0, -10);

    if (!esp32) return;

    // 1. MPU6050 -> ESP32 (I2C Bus)
    if (mpu) {
      this.wireRoutes.push({
        id: 'mpu-esp',
        from: mpu,
        to: esp32,
        cp1: { x: (mpu.x + esp32.x) / 2, y: mpu.y + 40 },
        cp2: { x: (mpu.x + esp32.x) / 2, y: esp32.y + 35 },
        speed: 0.016,
        color: '#F4D35E',
        label: 'I2C // GYRO+ACCEL'
      });
    }

    // 2. DHT22 -> ESP32 (1-Wire GPIO)
    if (dht) {
      this.wireRoutes.push({
        id: 'dht-esp',
        from: dht,
        to: esp32,
        cp1: { x: dht.x + 20, y: dht.y + 30 },
        cp2: { x: esp32.x - 20, y: esp32.y - 20 },
        speed: 0.012,
        color: '#FFE89A',
        label: 'GPIO4 // TEMP+RH'
      });
    }

    // 3. ACS712 -> ESP32 (ADC Current Channel)
    if (acs) {
      this.wireRoutes.push({
        id: 'acs-esp',
        from: acs,
        to: esp32Right,
        cp1: { x: (acs.x + esp32Right.x) / 2, y: acs.y + 40 },
        cp2: { x: (acs.x + esp32Right.x) / 2, y: esp32Right.y + 30 },
        speed: 0.02,
        color: '#F4D35E',
        label: 'ADC34 // 100mV/A'
      });
    }

    // 4. ESP32 -> L298N (Motor PWM)
    if (l298n) {
      this.wireRoutes.push({
        id: 'esp-l298n',
        from: esp32Right,
        to: l298n,
        cp1: { x: (esp32Right.x + l298n.x) / 2, y: esp32Right.y - 30 },
        cp2: { x: (esp32Right.x + l298n.x) / 2, y: l298n.y - 30 },
        speed: 0.018,
        color: '#F4D35E',
        label: 'PWM // DUAL H-BRIDGE'
      });
    }

    // 5. L298N -> DC Motor (Power Drive)
    if (l298n && motor) {
      this.wireRoutes.push({
        id: 'l298n-motor',
        from: l298n,
        to: motor,
        cp1: { x: (l298n.x + motor.x) / 2, y: l298n.y + 30 },
        cp2: { x: (l298n.x + motor.x) / 2, y: motor.y + 25 },
        speed: 0.024,
        color: '#FFE89A',
        label: '12V // MOTOR DRIVE'
      });
    }

    // 6. ESP32 -> OLED (Display Feed)
    if (oled) {
      this.wireRoutes.push({
        id: 'esp-oled',
        from: esp32Right,
        to: oled,
        cp1: { x: (esp32Right.x + oled.x) / 2, y: esp32Right.y - 20 },
        cp2: { x: (esp32Right.x + oled.x) / 2, y: oled.y + 20 },
        speed: 0.014,
        color: '#F4D35E',
        label: 'SSD1306 // 128x64'
      });
    }

    // 7. ESP32 -> Digital Twin (Upward Telemetry Vector)
    const twinApex = { x: esp32.x + 20, y: 80 };
    this.wireRoutes.push({
      id: 'esp-twin',
      from: esp32,
      to: twinApex,
      cp1: { x: esp32.x - 20, y: esp32.y - 100 },
      cp2: { x: twinApex.x - 20, y: twinApex.y + 120 },
      speed: 0.015,
      color: '#F4D35E',
      isTwinAscent: true,
      label: 'TINYSIM // BOUNDARY VEC'
    });

    // Spawn pulses along each route
    this.pulses = [];
    this.wireRoutes.forEach((route) => {
      // 2 staggered pulses per route
      this.pulses.push({
        route: route,
        progress: 0.1,
        size: 3.5,
        speed: route.speed
      });
      this.pulses.push({
        route: route,
        progress: 0.6,
        size: 2.8,
        speed: route.speed
      });
    });
  }

  animate() {
    if (!this.isRunning || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Physical DuPont Wires (Coffee Bean and Deep Espresso)
    this.wireRoutes.forEach(r => {
      this.drawWireTrace(r);
    });

    // 2. Draw Butter Yellow Electrical Data Pulses
    this.pulses.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
      }
      this.drawPulse(p);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawWireTrace(r) {
    const ctx = this.ctx;

    // Dark wire shadow on bench
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r.from.x, r.from.y + 4);
    ctx.bezierCurveTo(r.cp1.x, r.cp1.y + 6, r.cp2.x, r.cp2.y + 6, r.to.x, r.to.y + 4);
    ctx.strokeStyle = 'rgba(36, 21, 15, 0.2)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Main Coffee Bean DuPont Wire Body
    ctx.beginPath();
    ctx.moveTo(r.from.x, r.from.y);
    ctx.bezierCurveTo(r.cp1.x, r.cp1.y, r.cp2.x, r.cp2.y, r.to.x, r.to.y);
    ctx.strokeStyle = r.isTwinAscent ? 'rgba(58, 36, 24, 0.4)' : '#3A2418';
    ctx.lineWidth = r.isTwinAscent ? 1.5 : 2.4;
    if (r.isTwinAscent) {
      ctx.setLineDash([4, 4]);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Molded DuPont connector ends
    this.drawConnectorPin(r.from.x, r.from.y);
    this.drawConnectorPin(r.to.x, r.to.y);
    ctx.restore();
  }

  drawConnectorPin(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#24150F';
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = '#F4D35E';
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }

  drawPulse(p) {
    const ctx = this.ctx;
    const r = p.route;

    // Evaluate cubic bezier at t = progress
    const t = p.progress;
    const mt = 1 - t;

    const x = mt*mt*mt*r.from.x + 3*mt*mt*t*r.cp1.x + 3*mt*t*t*r.cp2.x + t*t*t*r.to.x;
    const y = mt*mt*mt*r.from.y + 3*mt*mt*t*r.cp1.y + 3*mt*t*t*r.cp2.y + t*t*t*r.to.y;

    // Outer subtle Butter Yellow halo
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, p.size * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 211, 94, 0.3)';
    ctx.fill();

    // Solid bright core pulse
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.route.color;
    ctx.fill();

    // Inner bright spark
    ctx.beginPath();
    ctx.arc(x, y, p.size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFDF5';
    ctx.fill();
    ctx.restore();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
