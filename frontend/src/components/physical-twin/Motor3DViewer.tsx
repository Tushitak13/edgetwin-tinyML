import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Motor3DViewerProps {
  rpm: number;
  temperature: number;
  vibration: number;
  current: number;
  humidity: number;
  clampState: string;
}

export const Motor3DViewer: React.FC<Motor3DViewerProps> = ({
  rpm,
  temperature,
  vibration,
  current,
  humidity,
  clampState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for render loop updates
  const physicsRef = useRef({
    rpm,
    temp: temperature,
    vibe: vibration,
  });

  useEffect(() => {
    physicsRef.current = { rpm, temp: temperature, vibe: vibration };
  }, [rpm, temperature, vibration]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4ece0);

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.9, 5.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 1.35);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.15);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf4d35e, 0.75);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // 3. Materials
    const statorMat = new THREE.MeshStandardMaterial({
      color: 0x24150f, // Deep Coffee metallic
      metalness: 0.82,
      roughness: 0.28,
    });

    const ribMat = new THREE.MeshStandardMaterial({
      color: 0xf4d35e, // Butter Yellow rib accents
      metalness: 0.55,
      roughness: 0.32,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe8e0d0,
      metalness: 0.92,
      roughness: 0.14,
    });

    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x3a2418, // Coffee Bean
      metalness: 0.65,
      roughness: 0.45,
    });

    const boardGreenMat = new THREE.MeshStandardMaterial({
      color: 0x1f6b34, // PCB green
      roughness: 0.5,
    });

    const redPcbMat = new THREE.MeshStandardMaterial({
      color: 0x962a14, // L298N driver red PCB
      roughness: 0.4,
    });

    const heatsinkBlackMat = new THREE.MeshStandardMaterial({
      color: 0x18100c, // Black heatsink
      metalness: 0.7,
      roughness: 0.3,
    });

    const sensorWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf7f5ec, // DHT22 white grill plastic
      roughness: 0.4,
    });

    const ribbonWireMat = new THREE.MeshStandardMaterial({
      color: 0x4a3326,
      roughness: 0.8,
    });

    // 4. Assembly Group
    const motorRig = new THREE.Group();
    scene.add(motorRig);

    // Baseplate
    const baseplateGeo = new THREE.BoxGeometry(4.8, 0.14, 2.6);
    const baseplate = new THREE.Mesh(baseplateGeo, bracketMat);
    baseplate.position.y = -1.0;
    motorRig.add(baseplate);

    // Bench coordinate grid helper
    const gridHelper = new THREE.GridHelper(4.4, 16, 0xf4d35e, 0x5b4132);
    gridHelper.position.y = -0.92;
    motorRig.add(gridHelper);

    // Mounting foot brackets
    const footL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 1.5), bracketMat);
    footL.position.set(-0.75, -0.65, 0);
    motorRig.add(footL);

    const footR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 1.5), bracketMat);
    footR.position.set(0.65, -0.65, 0);
    motorRig.add(footR);

    // Corner Bolt Anchors
    [
      [-0.8, -0.68, 0.6],
      [-0.8, -0.68, -0.6],
      [0.7, -0.68, 0.6],
      [0.7, -0.68, -0.6],
    ].forEach((pos) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), chromeMat);
      bolt.position.set(pos[0], pos[1], pos[2]);
      motorRig.add(bolt);
    });

    // Stator Body
    const statorGeo = new THREE.CylinderGeometry(0.92, 0.92, 2.3, 36);
    const statorMesh = new THREE.Mesh(statorGeo, statorMat);
    statorMesh.rotation.z = Math.PI / 2;
    statorMesh.position.set(-0.1, -0.15, 0);
    motorRig.add(statorMesh);

    // Circumferential Cooling Ribs
    const ribsGroup = new THREE.Group();
    for (let i = -0.85; i <= 0.85; i += 0.22) {
      const ringGeo = new THREE.TorusGeometry(0.94, 0.025, 16, 40);
      const ringMesh = new THREE.Mesh(ringGeo, ribMat);
      ringMesh.rotation.y = Math.PI / 2;
      ringMesh.position.set(i - 0.1, -0.15, 0);
      ribsGroup.add(ringMesh);
    }
    motorRig.add(ribsGroup);

    // Rear Bearing Cap
    const rearCap = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.92, 0.35, 32), bracketMat);
    rearCap.rotation.z = Math.PI / 2;
    rearCap.position.set(-1.4, -0.15, 0);
    motorRig.add(rearCap);

    // Front Cap
    const frontCap = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.72, 0.32, 32), bracketMat);
    frontCap.rotation.z = Math.PI / 2;
    frontCap.position.set(1.2, -0.15, 0);
    motorRig.add(frontCap);

    // Rotating Rotor Assembly
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(1.35, -0.15, 0);
    motorRig.add(rotorGroup);

    // Output Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.75, 24);
    const shaftMesh = new THREE.Mesh(shaftGeo, chromeMat);
    shaftMesh.rotation.z = Math.PI / 2;
    shaftMesh.position.x = 0.88;
    rotorGroup.add(shaftMesh);

    // Coupler
    const couplerGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.45, 24);
    const coupler = new THREE.Mesh(couplerGeo, ribMat);
    coupler.rotation.z = Math.PI / 2;
    coupler.position.x = 0.35;
    rotorGroup.add(coupler);

    // Slotted Optical Encoder Disc
    const encoderDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.04, 32), bracketMat);
    encoderDisc.rotation.z = Math.PI / 2;
    encoderDisc.position.x = 0.78;
    rotorGroup.add(encoderDisc);

    // Teeth on encoder disc
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), ribMat);
      slot.position.set(0.78, Math.sin(a) * 0.54, Math.cos(a) * 0.54);
      rotorGroup.add(slot);
    }

    // Flywheel Load Disc
    const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.28, 36), statorMat);
    flywheel.rotation.z = Math.PI / 2;
    flywheel.position.x = 1.35;
    rotorGroup.add(flywheel);

    // Index Notch
    const indexNotch = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.16), ribMat);
    indexNotch.position.set(1.35, 0.76, 0);
    rotorGroup.add(indexNotch);

    // Hardware Sensor Modules on Rig:
    // 1. MPU6050 on stator
    const mpuBoard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.38), boardGreenMat);
    mpuBoard.position.set(-0.1, 0.84, 0);
    motorRig.add(mpuBoard);
    const mpuChip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.18), statorMat);
    mpuChip.position.set(-0.1, 0.91, 0);
    motorRig.add(mpuChip);

    // 2. DHT22 White Sensor
    const dhtBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.2), sensorWhiteMat);
    dhtBody.position.set(-1.1, -0.65, 0.85);
    motorRig.add(dhtBody);

    // 3. ESP32 DevKit
    const espBoard = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.55), boardGreenMat);
    espBoard.position.set(0.8, -0.9, 0.85);
    motorRig.add(espBoard);
    const espShield = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.07, 0.32), chromeMat);
    espShield.position.set(0.7, -0.84, 0.85);
    motorRig.add(espShield);

    // 4. L298N Motor Driver
    const l298Pcb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.65), redPcbMat);
    l298Pcb.position.set(-1.3, -0.9, -0.7);
    motorRig.add(l298Pcb);
    const l298Heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.25), heatsinkBlackMat);
    l298Heatsink.position.set(-1.3, -0.72, -0.7);
    motorRig.add(l298Heatsink);

    // 5. ACS712 Shunt Module
    const acsPcb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.3), boardGreenMat);
    acsPcb.position.set(-0.4, -0.9, 0.9);
    motorRig.add(acsPcb);

    // 6. Wiring Conduits
    const wire1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 1.2), ribbonWireMat);
    wire1.position.set(-0.1, 0.4, 0.5);
    wire1.rotation.x = 0.5;
    motorRig.add(wire1);

    // 5. Orbit Controls (360° Drag & Zoom)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rigRotationY = 0.42;
    let rigRotationX = 0.18;
    let targetCamDistance = 5.0;

    motorRig.rotation.y = rigRotationY;
    motorRig.rotation.x = rigRotationX;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      rigRotationY += deltaX * 0.01;
      rigRotationX = Math.max(-0.9, Math.min(1.1, rigRotationX + deltaY * 0.008));

      motorRig.rotation.y = rigRotationY;
      motorRig.rotation.x = rigRotationX;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCamDistance += e.deltaY * 0.004;
      targetCamDistance = Math.max(3.2, Math.min(7.5, targetCamDistance));
    };

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Camera distance interpolation (smooth zoom)
      camera.position.z += (targetCamDistance - camera.position.z) * 0.1;

      // Continuous shaft rotation
      const { rpm: curRpm, vibe: curVibe, temp: curTemp } = physicsRef.current;
      const rotSpeed = (curRpm / 1820) * 20.0;
      rotorGroup.rotation.x += rotSpeed * delta;

      // Vibration jitter
      if (curVibe > 0.6) {
        const jitterMag = (curVibe - 0.45) * 0.016;
        motorRig.position.y = (Math.random() - 0.5) * jitterMag;
        motorRig.position.x = (Math.random() - 0.5) * jitterMag;
      } else {
        motorRig.position.set(0, 0, 0);
      }

      // Thermal glow on stator
      if (curTemp > 60) {
        const heatFactor = Math.min(1.0, (curTemp - 60) / 40);
        statorMat.color.setRGB(0.14 + heatFactor * 0.38, 0.08, 0.06);
      } else {
        statorMat.color.setHex(0x24150f);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const powerWatts = (current * 12 * 0.85).toFixed(1);

  return (
    <section className="bg-cream-card rounded-3xl p-5 border border-coffee/15 shadow-warm flex flex-col gap-3 relative overflow-hidden">
      {/* Stage Toolbar / Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-coffee/10 pb-3 gap-2 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-mint-dot animate-pulse" />
            <h2 className="text-base font-extrabold text-coffee-deep font-sans tracking-tight">
              3D MOTOR DIGITAL TWIN
            </h2>
            <span className="text-coffee/40">|</span>
            <span className="text-xs font-mono font-medium text-coffee/70 uppercase">
              INTERACTIVE CO-SIMULATION RIG
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-coffee-deep text-butter border border-butter/30 shadow-xs">
            360° ORBIT ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#F5EEDD] px-3 py-1.5 rounded-xl border border-coffee/15 shadow-xs flex items-center gap-3">
            <span className="text-coffee/70">
              SPEED: <strong className="text-coffee-deep font-bold">{rpm.toLocaleString()} RPM</strong>
            </span>
            <span className="text-coffee/30">•</span>
            <span className="text-coffee/70">
              POWER: <strong className="text-coffee-deep font-bold">{powerWatts} W</strong>
            </span>
            <span className="text-coffee/30">•</span>
            <span className="text-coffee/70">
              VOLTAGE: <strong className="text-coffee-deep font-bold">12.0 V DC</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3D Viewport Stage */}
      <div
        ref={containerRef}
        className="w-full h-[500px] min-h-[480px] bg-[#F4ECE0] rounded-2xl border border-coffee/20 relative overflow-hidden flex items-center justify-center shadow-inner select-none"
        id="three-motor-viewport"
      >
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

        {/* SVG Leader Lines Connecting 4 Sensor Callouts to Rig */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
          viewBox="0 0 1000 500"
        >
          {/* Top-Left: DHT22 stator probe */}
          <path d="M 230 65 L 360 65 L 430 210" fill="none" stroke="#F4D35E" strokeDasharray="4 3" strokeWidth="1.75" />
          <circle cx="430" cy="210" fill="#F4D35E" r="3.5" stroke="#24150F" strokeWidth="1.5" />

          {/* Bottom-Left: ACS712 Shunt */}
          <path d="M 230 435 L 340 435 L 420 320" fill="none" stroke="#F4D35E" strokeDasharray="4 3" strokeWidth="1.75" />
          <circle cx="420" cy="320" fill="#F4D35E" r="3.5" stroke="#24150F" strokeWidth="1.5" />

          {/* Top-Right: MPU6050 IMU */}
          <path d="M 770 65 L 640 65 L 560 190" fill="none" stroke="#F4D35E" strokeDasharray="4 3" strokeWidth="1.75" />
          <circle cx="560" cy="190" fill="#F4D35E" r="3.5" stroke="#24150F" strokeWidth="1.5" />

          {/* Bottom-Right: Humidity probe */}
          <path d="M 770 435 L 660 435 L 590 320" fill="none" stroke="#F4D35E" strokeDasharray="4 3" strokeWidth="1.75" />
          <circle cx="590" cy="320" fill="#F4D35E" r="3.5" stroke="#24150F" strokeWidth="1.5" />
        </svg>

        {/* CALLOUT 1: TEMPERATURE */}
        <div className="absolute top-5 left-5 z-20 pointer-events-auto">
          <div className="bg-coffee-deep/95 text-butter border border-butter/40 px-3.5 py-2 rounded-xl shadow-warm-lg backdrop-blur flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-butter/15 border border-butter/30 flex items-center justify-center text-butter font-mono text-xs font-bold">
              T°
            </div>
            <div className="flex flex-col font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-cream/70 uppercase tracking-wider">TEMPERATURE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mint-dot animate-pulse" />
              </div>
              <span className="text-xs font-bold text-butter">{temperature.toFixed(1)}°C</span>
              <span className="text-[9px] text-cream/60">DHT22 Stator Core Probe</span>
            </div>
          </div>
        </div>

        {/* CALLOUT 2: CURRENT */}
        <div className="absolute bottom-14 left-5 z-20 pointer-events-auto">
          <div className="bg-coffee-deep/95 text-cream border border-coffee/30 px-3.5 py-2 rounded-xl shadow-warm-lg backdrop-blur flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-butter/15 border border-butter/30 flex items-center justify-center text-butter font-mono text-xs font-bold">
              A
            </div>
            <div className="flex flex-col font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-cream/70 uppercase tracking-wider">CURRENT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-butter" />
              </div>
              <span className="text-xs font-bold text-butter">{current.toFixed(2)} A</span>
              <span className="text-[9px] text-cream/60">ACS712 Shunt Load • 12V DC</span>
            </div>
          </div>
        </div>

        {/* CALLOUT 3: VIBRATION */}
        <div className="absolute top-5 right-5 z-20 pointer-events-auto">
          <div className="bg-coffee-deep/95 text-butter border border-butter/40 px-3.5 py-2 rounded-xl shadow-warm-lg backdrop-blur flex items-center gap-3 flex-row-reverse text-right">
            <div className="w-7 h-7 rounded-lg bg-butter/15 border border-butter/30 flex items-center justify-center text-butter font-mono text-xs font-bold">
              G
            </div>
            <div className="flex flex-col font-mono">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-dot animate-pulse" />
                <span className="text-[10px] text-cream/70 uppercase tracking-wider">VIBRATION</span>
              </div>
              <span className="text-xs font-bold text-butter">{vibration.toFixed(2)} g</span>
              <span className="text-[9px] text-cream/60">MPU6050 3-Axis IMU</span>
            </div>
          </div>
        </div>

        {/* CALLOUT 4: HUMIDITY */}
        <div className="absolute bottom-14 right-5 z-20 pointer-events-auto">
          <div className="bg-coffee-deep/95 text-cream border border-coffee/30 px-3.5 py-2 rounded-xl shadow-warm-lg backdrop-blur flex items-center gap-3 flex-row-reverse text-right">
            <div className="w-7 h-7 rounded-lg bg-butter/15 border border-butter/30 flex items-center justify-center text-butter font-mono text-xs font-bold">
              %
            </div>
            <div className="flex flex-col font-mono">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-dot" />
                <span className="text-[10px] text-cream/70 uppercase tracking-wider">HUMIDITY</span>
              </div>
              <span className="text-xs font-bold text-butter">{Math.round(humidity)} %</span>
              <span className="text-[9px] text-cream/60">Atmospheric RH Chamber</span>
            </div>
          </div>
        </div>

        {/* Center Stator Badge */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="bg-coffee-deep/85 border border-butter/40 px-3 py-1 rounded-lg text-[10px] font-mono text-butter tracking-widest uppercase backdrop-blur shadow-sm">
            [ 12V DC MOTOR RIG • 775 INDUSTRIAL STATOR &amp; OPTICAL ENCODER ]
          </div>
        </div>

        {/* Interaction Overlay Badge */}
        <div className="absolute bottom-3 inset-x-5 z-20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-coffee/80 bg-cream-card/95 px-4 py-2 rounded-xl border border-coffee/20 backdrop-blur pointer-events-none shadow-sm gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint-dot animate-pulse" />
            <span className="font-bold text-coffee-deep">360° VIEW</span>
            <span className="text-coffee/40">•</span>
            <span>Drag to rotate (yaw &amp; pitch) • Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-coffee-deep">
              SHAFT JITTER: {(vibration * 1.8).toFixed(1)}% • {vibration > 0.7 ? 'ELEVATED' : 'IN-BOUNDS'}
            </span>
            <span className="text-coffee/30">|</span>
            <span className="text-mint-text font-bold">
              {clampState === 'ARMED' ? 'ARMED DETERMINISTIC CLAMP' : clampState}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
