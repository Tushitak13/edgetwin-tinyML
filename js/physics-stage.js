/**
 * EDGETWIN PHYSICS & STAGE SIMULATOR
 * Realistic procedural multi-body drop-in physics for prototype electronic components.
 * 
 * Features:
 * - Staggered high-altitude entry
 * - Gravitational acceleration & aerodynamic drag
 * - Angular rotation & torque damping
 * - Elastic restitution & bounce onto Coffee Bean workbench
 * - Dynamic ground shadows expanding & sharpening on proximity
 * - Transition event triggers: onHardwareSettled()
 */

class HardwarePhysicsStage {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvasContainer = document.querySelector('.stage-canvas-container');
    this.physicsLayer = document.querySelector('.hardware-physics-layer');
    this.workbench = document.querySelector('.physical-workbench');
    
    this.components = [];
    this.isSettled = false;
    this.animationFrameId = null;
    this.lastTime = null;
    this.settledCallbacks = [];
    this.activeInspector = null;

    this.init();
  }

  init() {
    this.setupBackgroundGrid();
    this.spawnComponents();
    this.setupInteractivity();
    this.startSimulation();
  }

  setupBackgroundGrid() {
    const gridCanvas = document.querySelector('.stage-grid-canvas');
    if (!gridCanvas) return;

    const ctx = gridCanvas.getContext('2d');
    const resize = () => {
      gridCanvas.width = gridCanvas.offsetWidth;
      gridCanvas.height = gridCanvas.offsetHeight;
      this.drawCalibrationGrid(ctx, gridCanvas.width, gridCanvas.height);
    };
    resize();
    window.addEventListener('resize', resize);
  }

  drawCalibrationGrid(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(58, 36, 24, 0.05)';
    ctx.lineWidth = 1;

    // Technical 30px grid
    const step = 32;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Dimension crosshairs
    ctx.strokeStyle = 'rgba(58, 36, 24, 0.15)';
    ctx.lineWidth = 1.2;
    const crosshairs = [
      { x: 60, y: 60 },
      { x: w - 60, y: 60 },
      { x: 140, y: h - 170 },
      { x: w - 140, y: h - 170 }
    ];

    crosshairs.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.x - 8, c.y);
      ctx.lineTo(c.x + 8, c.y);
      ctx.moveTo(c.x, c.y - 8);
      ctx.lineTo(c.x, c.y + 8);
      ctx.stroke();
      ctx.strokeRect(c.x - 4, c.y - 4, 8, 8);
    });

    // Millimeter gauge line at workbench boundary
    const wbY = h - 140;
    ctx.fillStyle = 'rgba(58, 36, 24, 0.4)';
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillText('REF://DATUM-0.00MM [BENCH SURFACE]', 24, wbY - 8);
  }

  spawnComponents() {
    this.physicsLayer.innerHTML = '';
    this.components = [];
    this.isSettled = false;

    const w = this.canvasContainer.offsetWidth;
    const h = this.canvasContainer.offsetHeight;
    const workbenchY = h - 140;

    // Stagger definitions & realistic relative layout on the workbench
    // Scaling positions proportionally across width
    const scaleFactor = Math.min(1, Math.max(0.65, w / 1100));

    const layout = [
      // 1. Breadboard (drops first as foundation)
      {
        model: HARDWARE_MODELS.breadboard,
        targetX: w * 0.46 - (HARDWARE_MODELS.breadboard.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.breadboard.height * scaleFactor) + 24,
        dropDelay: 100,
        startVy: 60,
        startAngle: -4,
        scale: scaleFactor
      },
      // 2. ESP32 DevKit (mounts into breadboard)
      {
        model: HARDWARE_MODELS.esp32,
        targetX: w * 0.44 - (HARDWARE_MODELS.esp32.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.breadboard.height * scaleFactor) - 6,
        dropDelay: 450,
        startVy: 80,
        startAngle: 7,
        scale: scaleFactor
      },
      // 3. MPU6050 (left of breadboard)
      {
        model: HARDWARE_MODELS.mpu6050,
        targetX: w * 0.22 - (HARDWARE_MODELS.mpu6050.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.mpu6050.height * scaleFactor) + 6,
        dropDelay: 600,
        startVy: 100,
        startAngle: -8,
        scale: scaleFactor
      },
      // 4. DHT22 (upper left breadboard)
      {
        model: HARDWARE_MODELS.dht22,
        targetX: w * 0.31 - (HARDWARE_MODELS.dht22.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.dht22.height * scaleFactor) - 10,
        dropDelay: 750,
        startVy: 90,
        startAngle: 12,
        scale: scaleFactor
      },
      // 5. ACS712 Current Sensor (right of breadboard)
      {
        model: HARDWARE_MODELS.acs712,
        targetX: w * 0.62 - (HARDWARE_MODELS.acs712.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.acs712.height * scaleFactor) + 4,
        dropDelay: 850,
        startVy: 110,
        startAngle: -6,
        scale: scaleFactor
      },
      // 6. L298N Motor Driver (power driver stage right)
      {
        model: HARDWARE_MODELS.l298n,
        targetX: w * 0.76 - (HARDWARE_MODELS.l298n.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.l298n.height * scaleFactor) + 12,
        dropDelay: 1000,
        startVy: 70,
        startAngle: 9,
        scale: scaleFactor
      },
      // 7. DC Motor (far right load)
      {
        model: HARDWARE_MODELS.motor,
        targetX: w * 0.88 - (HARDWARE_MODELS.motor.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.motor.height * scaleFactor) + 10,
        dropDelay: 1150,
        startVy: 130,
        startAngle: -5,
        scale: scaleFactor
      },
      // 8. 0.96" OLED Display (plugged into breadboard right side)
      {
        model: HARDWARE_MODELS.oled,
        targetX: w * 0.54 - (HARDWARE_MODELS.oled.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.oled.height * scaleFactor) - 8,
        dropDelay: 1280,
        startVy: 90,
        startAngle: 14,
        scale: scaleFactor
      },
      // 9. Status LEDs
      {
        model: HARDWARE_MODELS.leds,
        targetX: w * 0.38 - (HARDWARE_MODELS.leds.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.leds.height * scaleFactor) - 15,
        dropDelay: 1400,
        startVy: 120,
        startAngle: -10,
        scale: scaleFactor
      },
      // 10. Piezo Buzzer
      {
        model: HARDWARE_MODELS.buzzer,
        targetX: w * 0.14 - (HARDWARE_MODELS.buzzer.width * scaleFactor) / 2,
        targetY: workbenchY - (HARDWARE_MODELS.buzzer.height * scaleFactor) + 8,
        dropDelay: 1520,
        startVy: 140,
        startAngle: 15,
        scale: scaleFactor
      }
    ];

    layout.forEach((item, index) => {
      const model = item.model;
      const width = model.width * item.scale;
      const height = model.height * item.scale;

      // Create DOM element for component
      const el = document.createElement('div');
      el.className = 'hw-component';
      el.id = `hw-${model.id}`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.innerHTML = model.render();

      // Adjust inner SVG scale
      const svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
      }

      // Create realistic ground shadow
      const shadowEl = document.createElement('div');
      shadowEl.className = 'hw-shadow';
      shadowEl.id = `shadow-${model.id}`;
      shadowEl.style.width = `${width * 0.95}px`;
      shadowEl.style.height = `${Math.max(10, height * 0.28)}px`;
      shadowEl.style.left = `${item.targetX + width * 0.025}px`;
      shadowEl.style.top = `${item.targetY + height - 8}px`;

      this.physicsLayer.appendChild(shadowEl);
      this.physicsLayer.appendChild(el);

      // Physics State Object
      const body = {
        id: model.id,
        name: model.name,
        spec: model.spec,
        el: el,
        shadowEl: shadowEl,
        width: width,
        height: height,
        x: item.targetX,
        y: -height - (Math.random() * 150 + 80), // Starts above viewport
        targetX: item.targetX,
        targetY: item.targetY,
        vx: (Math.random() - 0.5) * 20,
        vy: item.startVy,
        angle: item.startAngle,
        vAngle: (Math.random() - 0.5) * 25,
        mass: model.mass,
        restitution: model.restitution,
        active: false,
        dropDelay: item.dropDelay,
        elapsedTime: 0,
        settled: false,
        bounceCount: 0
      };

      this.components.push(body);
    });
  }

  startSimulation() {
    this.lastTime = performance.now();
    const tick = (currentTime) => {
      const dt = Math.min(0.04, (currentTime - this.lastTime) / 1000);
      this.lastTime = currentTime;

      this.updatePhysics(dt);

      if (!this.isSettled) {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };
    this.animationFrameId = requestAnimationFrame(tick);
  }

  updatePhysics(dt) {
    const gravity = 1800; // px/s^2 realistic gravity
    let allSettled = true;

    this.components.forEach(body => {
      body.elapsedTime += dt * 1000;

      // Handle drop delay trigger
      if (!body.active) {
        if (body.elapsedTime >= body.dropDelay) {
          body.active = true;
        } else {
          allSettled = false;
          return;
        }
      }

      if (body.settled) {
        return;
      }

      allSettled = false;

      // Gravitational acceleration
      body.vy += gravity * dt;
      body.y += body.vy * dt;
      body.x += body.vx * dt;
      body.angle += body.vAngle * dt;

      // Air resistance
      body.vx *= 0.98;
      body.vAngle *= 0.96;

      // Shadow projection calculation
      const distToGround = Math.max(0, body.targetY - body.y);
      const proximity = Math.max(0, 1 - distToGround / 350);
      body.shadowEl.style.opacity = (proximity * 0.55).toFixed(2);
      body.shadowEl.style.transform = `scale(${0.3 + proximity * 0.7}, ${0.4 + proximity * 0.6})`;

      // Floor Collision with Workbench Surface
      if (body.y >= body.targetY) {
        body.y = body.targetY;
        body.bounceCount++;

        // Inelastic collision with workbench
        if (Math.abs(body.vy) > 40) {
          body.vy = -body.vy * body.restitution;
          // Angular damping on ground contact
          body.vAngle = -body.vAngle * 0.35 + (Math.random() - 0.5) * 8;
          body.angle = body.angle * 0.4;
          body.vx *= 0.5;
        } else {
          // Settled on workbench
          body.vy = 0;
          body.vx = 0;
          body.y = body.targetY;
          body.angle = 0;
          body.vAngle = 0;
          body.settled = true;
          body.shadowEl.style.opacity = '0.55';
          body.shadowEl.style.transform = 'scale(1, 1)';
        }
      }

      // Update DOM transform
      body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
    });

    if (allSettled && !this.isSettled) {
      this.isSettled = true;
      this.handleSettled();
    }
  }

  handleSettled() {
    // Ensure final crisp positioning
    this.components.forEach(body => {
      body.el.style.transform = `translate3d(${body.targetX}px, ${body.targetY}px, 0) rotate(0deg)`;
      body.shadowEl.style.transform = 'scale(1, 1)';
      body.shadowEl.style.opacity = '0.55';
    });

    // Notify listeners (Data Pulses & Digital Twin)
    this.settledCallbacks.forEach(cb => cb(this.components));
  }

  onSettled(callback) {
    this.settledCallbacks.push(callback);
    if (this.isSettled) {
      callback(this.components);
    }
  }

  setupInteractivity() {
    const tooltip = document.querySelector('.component-tooltip-card');
    if (!tooltip) return;

    this.components.forEach(body => {
      body.el.addEventListener('mouseenter', (e) => {
        tooltip.innerHTML = `
          <div class="tooltip-chip-name">${body.name}</div>
          <div class="tooltip-spec-row"><span class="tooltip-spec-key">Role:</span> <span>${body.spec.split(',')[0]}</span></div>
          <div class="tooltip-spec-row"><span class="tooltip-spec-key">Bus/Pin:</span> <span>${body.id.toUpperCase()}</span></div>
          <div class="tooltip-spec-row"><span class="tooltip-spec-key">Status:</span> <span style="color: var(--butter-yellow);">ONLINE</span></div>
        `;
        const rect = body.el.getBoundingClientRect();
        const stageRect = this.canvasContainer.getBoundingClientRect();
        
        let left = rect.left - stageRect.left + (body.width / 2) - 100;
        let top = rect.top - stageRect.top - 75;
        if (left < 10) left = 10;
        if (top < 10) top = 10;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.classList.add('active');
      });

      body.el.addEventListener('mouseleave', () => {
        tooltip.classList.remove('active');
      });
    });
  }

  replay() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.spawnComponents();
    this.setupInteractivity();
    this.startSimulation();
  }

  getComponentBounds(id) {
    const found = this.components.find(c => c.id === id);
    if (!found) return null;
    return {
      x: found.targetX + found.width / 2,
      y: found.targetY + found.height / 2,
      width: found.width,
      height: found.height
    };
  }
}
