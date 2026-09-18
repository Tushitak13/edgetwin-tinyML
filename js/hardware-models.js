/**
 * EDGETWIN HARDWARE MODELS
 * Detailed vector SVG definitions for physical components:
 * - ESP32 DevKit
 * - MPU6050 6-DoF IMU
 * - DHT22 Temp & Humidity Sensor
 * - ACS712 Current Sensor
 * - L298N Dual H-Bridge Motor Driver
 * - DC Motor with brass shaft
 * - 830-point Solderless Breadboard
 * - 0.96" I2C OLED Display
 * - 5mm Status LEDs & Resistor
 * - Piezo Buzzer
 * - DuPont Jumper Wires
 * 
 * Strict palette: Warm Cream, Coffee Bean, Deep Espresso, Butter Yellow, Soft Butter, Muted Coffee.
 */

const HARDWARE_MODELS = {
  // 1. 830-Point Solderless Breadboard
  breadboard: {
    id: 'breadboard',
    name: '830-Tie Solderless Breadboard',
    spec: 'Dual power rails, 0.1" pitch, nickel clips',
    width: 380,
    height: 125,
    settleX: 200,
    settleY: 440,
    mass: 2.8,
    restitution: 0.22,
    render: () => `
      <svg width="380" height="125" viewBox="0 0 380 125" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bbBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FAF5E8"/>
            <stop offset="100%" stop-color="#E7DEC7"/>
          </linearGradient>
          <filter id="bbInset" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" flood-color="#24150F" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Outer breadboard plate -->
        <rect x="2" y="2" width="376" height="121" rx="6" fill="url(#bbBodyGrad)" stroke="#806B5A" stroke-width="1.2"/>
        <!-- Notch alignment clips on sides -->
        <rect x="0" y="45" width="2.5" height="35" rx="1" fill="#DFD3B1"/>
        <rect x="377.5" y="45" width="2.5" height="35" rx="1" fill="#DFD3B1"/>
        
        <!-- Top Power Rails -->
        <line x1="20" y1="14" x2="360" y2="14" stroke="#8A382A" stroke-width="1.2" stroke-dasharray="28 4"/>
        <line x1="20" y1="28" x2="360" y2="28" stroke="#3A2418" stroke-width="1.2" stroke-dasharray="28 4"/>
        <text x="10" y="17" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#8A382A">+</text>
        <text x="11" y="31" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#3A2418">-</text>

        <!-- Center Divider Gutter -->
        <rect x="18" y="61" width="344" height="4" fill="#DFD3B1" stroke="#806B5A" stroke-width="0.5"/>

        <!-- Bottom Power Rails -->
        <line x1="20" y1="98" x2="360" y2="98" stroke="#8A382A" stroke-width="1.2" stroke-dasharray="28 4"/>
        <line x1="20" y1="112" x2="360" y2="112" stroke="#3A2418" stroke-width="1.2" stroke-dasharray="28 4"/>
        <text x="10" y="101" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#8A382A">+</text>
        <text x="11" y="115" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#3A2418">-</text>

        <!-- Pin tie-point matrices (Row markers & coordinate numbers) -->
        ${(() => {
          let dots = '';
          // Numbers 1, 10, 20, 30, 40, 50, 60
          for (let col = 0; col < 30; col++) {
            const cx = 28 + col * 11.4;
            if (col % 5 === 0) {
              dots += `<text x="${cx - 3}" y="40" font-family="'JetBrains Mono', monospace" font-size="5" fill="#806B5A">${col + 1}</text>`;
              dots += `<text x="${cx - 3}" y="88" font-family="'JetBrains Mono', monospace" font-size="5" fill="#806B5A">${col + 1}</text>`;
            }
            // Power rail tie points
            dots += `<rect x="${cx - 1.5}" y="12" width="3" height="3" rx="0.5" fill="#3A2418" opacity="0.85"/>`;
            dots += `<rect x="${cx - 1.5}" y="26" width="3" height="3" rx="0.5" fill="#3A2418" opacity="0.85"/>`;
            dots += `<rect x="${cx - 1.5}" y="96" width="3" height="3" rx="0.5" fill="#3A2418" opacity="0.85"/>`;
            dots += `<rect x="${cx - 1.5}" y="110" width="3" height="3" rx="0.5" fill="#3A2418" opacity="0.85"/>`;

            // Top bank (rows a-e)
            for (let r = 0; r < 3; r++) {
              dots += `<rect x="${cx - 1.5}" y="${45 + r * 5}" width="3" height="3" rx="0.5" fill="#3A2418" opacity="0.8"/>`;
            }
            // Bottom bank (rows f-j)
            for (let r = 0; r < 3; r++) {
              dots += `<rect x="${cx - 1.5}" y="${71 + r * 5}" width="3" height="3" rx="0.5" fill="#3A2418" opacity="0.8"/>`;
            }
          }
          return dots;
        })()}

        <!-- Technical branding mark on breadboard -->
        <text x="310" y="65" font-family="'Space Grotesk', sans-serif" font-size="6" font-weight="700" fill="#806B5A" letter-spacing="1">MB-102</text>
      </svg>
    `
  },

  // 2. ESP32 DevKit NodeMCU
  esp32: {
    id: 'esp32',
    name: 'ESP32 DevKit v1 (38-Pin)',
    spec: 'Xtensa Dual-Core 240MHz, 520KB SRAM, TinyML Edge Inference',
    width: 140,
    height: 70,
    settleX: 300,
    settleY: 460,
    mass: 1.6,
    restitution: 0.28,
    render: () => `
      <svg width="140" height="70" viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pcbDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#281A12"/>
            <stop offset="100%" stop-color="#190F0A"/>
          </linearGradient>
          <linearGradient id="shieldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EFEFEF"/>
            <stop offset="45%" stop-color="#C5C5C5"/>
            <stop offset="55%" stop-color="#EFEFEF"/>
            <stop offset="100%" stop-color="#A5A5A5"/>
          </linearGradient>
        </defs>

        <!-- Main PCB Body -->
        <rect x="2" y="2" width="136" height="66" rx="4" fill="url(#pcbDark)" stroke="#806B5A" stroke-width="1"/>
        <!-- Mounting corner holes -->
        <circle cx="8" cy="8" r="2.2" fill="#FAF5E8" stroke="#806B5A" stroke-width="0.8"/>
        <circle cx="132" cy="8" r="2.2" fill="#FAF5E8" stroke="#806B5A" stroke-width="0.8"/>
        <circle cx="8" cy="62" r="2.2" fill="#FAF5E8" stroke="#806B5A" stroke-width="0.8"/>
        <circle cx="132" cy="62" r="2.2" fill="#FAF5E8" stroke="#806B5A" stroke-width="0.8"/>

        <!-- 2x15 Header Pins Top & Bottom -->
        ${(() => {
          let pins = '';
          for (let i = 0; i < 15; i++) {
            const x = 16 + i * 7.6;
            // Top pins
            pins += `<rect x="${x}" y="3" width="3.5" height="5" rx="0.6" fill="#F4D35E" stroke="#806B5A" stroke-width="0.4"/>`;
            // Bottom pins
            pins += `<rect x="${x}" y="62" width="3.5" height="5" rx="0.6" fill="#F4D35E" stroke="#806B5A" stroke-width="0.4"/>`;
          }
          return pins;
        })()}

        <!-- Micro-USB port on left edge -->
        <rect x="0" y="25" width="10" height="20" rx="1.5" fill="#D0D0D0" stroke="#505050" stroke-width="0.8"/>
        <rect x="2" y="29" width="6" height="12" rx="1" fill="#303030"/>

        <!-- Laser Etched ESP-WROOM-32 Shield -->
        <rect x="42" y="14" width="56" height="42" rx="2" fill="url(#shieldMetal)" stroke="#888" stroke-width="0.6"/>
        <rect x="44" y="16" width="52" height="38" fill="none" stroke="#666" stroke-width="0.4" stroke-dasharray="2 1"/>
        <text x="47" y="26" font-family="'JetBrains Mono', monospace" font-size="4.8" font-weight="700" fill="#24150F">ESPRESSIF</text>
        <text x="47" y="34" font-family="'Space Grotesk', sans-serif" font-size="5.5" font-weight="800" fill="#24150F">ESP-WROOM-32</text>
        <text x="47" y="42" font-family="'JetBrains Mono', monospace" font-size="3.5" fill="#444">FCC ID: 2AC7Z-ESPWROOM32</text>
        <text x="47" y="49" font-family="'JetBrains Mono', monospace" font-size="3.5" fill="#444">K/N: 211-161007</text>

        <!-- PCB Antenna Trace (Gold serpentine) -->
        <path d="M 104 22 L 132 22 L 132 26 L 108 26 L 108 30 L 132 30 L 132 34 L 108 34 L 108 38 L 132 38 L 132 42 L 104 42 Z" fill="#F4D35E" opacity="0.9"/>

        <!-- Tactile Buttons (EN and BOOT) -->
        <rect x="18" y="16" width="7" height="6" rx="1" fill="#4A4A4A" stroke="#222" stroke-width="0.5"/>
        <circle cx="21.5" cy="19" r="1.8" fill="#F4D35E"/>
        <text x="17" y="26" font-family="'JetBrains Mono', monospace" font-size="3.2" fill="#DFD3B1">EN</text>

        <rect x="18" y="48" width="7" height="6" rx="1" fill="#4A4A4A" stroke="#222" stroke-width="0.5"/>
        <circle cx="21.5" cy="51" r="1.8" fill="#F4D35E"/>
        <text x="16" y="46" font-family="'JetBrains Mono', monospace" font-size="3.2" fill="#DFD3B1">BOOT</text>

        <!-- AMS1117 Voltage Regulator -->
        <rect x="24" y="31" width="10" height="8" rx="0.5" fill="#151515" stroke="#333" stroke-width="0.5"/>
        <rect x="22" y="33" width="2" height="4" fill="#C0C0C0"/>
        <rect x="34" y="32" width="2" height="2" fill="#C0C0C0"/>
        <rect x="34" y="36" width="2" height="2" fill="#C0C0C0"/>

        <!-- Active Power & Status LEDs -->
        <circle cx="15" cy="35" r="1.5" fill="#F4D35E" filter="drop-shadow(0 0 2px #F4D35E)"/>
        <circle cx="38" cy="19" r="1.5" fill="#FFE89A" filter="drop-shadow(0 0 2px #F4D35E)"/>
      </svg>
    `
  },

  // 3. MPU6050 6-Axis Gyro/Accelerometer
  mpu6050: {
    id: 'mpu6050',
    name: 'MPU-6050 6-DoF IMU',
    spec: '3-axis Gyroscope + 3-axis Accelerometer, I2C 1000Hz',
    width: 65,
    height: 48,
    settleX: 130,
    settleY: 480,
    mass: 1.1,
    restitution: 0.32,
    render: () => `
      <svg width="65" height="48" viewBox="0 0 65 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="61" height="44" rx="3" fill="#241912" stroke="#806B5A" stroke-width="0.8"/>
        <!-- Header Pin Strip (8 pins) -->
        ${(() => {
          let pins = '';
          const labels = ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'];
          for (let i = 0; i < 8; i++) {
            const x = 7 + i * 6.8;
            pins += `<circle cx="${x}" cy="42" r="1.8" fill="#F4D35E" stroke="#806B5A" stroke-width="0.4"/>`;
            pins += `<circle cx="${x}" cy="42" r="0.9" fill="#1E1612"/>`;
            pins += `<text x="${x - 2.5}" y="36" font-family="'JetBrains Mono', monospace" font-size="2.6" font-weight="700" fill="#DFD3B1">${labels[i]}</text>`;
          }
          return pins;
        })()}
        <!-- InvenSense QFN Chip -->
        <rect x="21" y="10" width="22" height="18" rx="1" fill="#110A07" stroke="#443024" stroke-width="0.6"/>
        <circle cx="24" cy="13" r="0.9" fill="#F4D35E"/>
        <text x="25" y="20" font-family="'JetBrains Mono', monospace" font-size="3.2" font-weight="700" fill="#EDE2C5">MPU-6050</text>
        <text x="25" y="25" font-family="'JetBrains Mono', monospace" font-size="2.6" fill="#806B5A">6-AXIS</text>
        <!-- Passive SMT capacitors -->
        <rect x="8" y="14" width="4" height="2.5" fill="#B38A58"/>
        <rect x="8" y="20" width="4" height="2.5" fill="#B38A58"/>
        <rect x="52" y="14" width="4" height="2.5" fill="#B38A58"/>
        <!-- Axis orientation vector icon -->
        <line x1="50" y1="24" x2="57" y2="24" stroke="#F4D35E" stroke-width="0.8"/>
        <polygon points="57,22.5 60,24 57,25.5" fill="#F4D35E"/>
        <text x="54" y="22" font-family="'JetBrains Mono', monospace" font-size="3" fill="#F4D35E">X</text>
      </svg>
    `
  },

  // 4. DHT22 Precision Temperature & Humidity
  dht22: {
    id: 'dht22',
    name: 'DHT22 / AM2302 Sensor',
    spec: 'Capacitive humidity sensor & NTC thermistor, ±0.5°C accuracy',
    width: 58,
    height: 68,
    settleX: 200,
    settleY: 420,
    mass: 1.3,
    restitution: 0.25,
    render: () => `
      <svg width="58" height="68" viewBox="0 0 58 68" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dhtWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF2"/>
            <stop offset="100%" stop-color="#EDE4CD"/>
          </linearGradient>
        </defs>
        <!-- Slotted Sensor Case -->
        <rect x="5" y="2" width="48" height="48" rx="4" fill="url(#dhtWhite)" stroke="#806B5A" stroke-width="1"/>
        <!-- Slits/Grille for airflow -->
        ${(() => {
          let slits = '';
          for (let i = 0; i < 6; i++) {
            const y = 8 + i * 5;
            slits += `<line x1="12" y1="${y}" x2="46" y2="${y}" stroke="#3A2418" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>`;
          }
          return slits;
        })()}
        <!-- Label Plate -->
        <rect x="10" y="38" width="38" height="8" rx="1" fill="#3A2418"/>
        <text x="14" y="44" font-family="'JetBrains Mono', monospace" font-size="4.2" font-weight="700" fill="#F4D35E">DHT22 / AM2302</text>
        
        <!-- 4 Metal Connection Legs -->
        <rect x="14" y="50" width="2.5" height="16" fill="#C5B59C" stroke="#3A2418" stroke-width="0.4"/>
        <rect x="22" y="50" width="2.5" height="16" fill="#C5B59C" stroke="#3A2418" stroke-width="0.4"/>
        <rect x="30" y="50" width="2.5" height="16" fill="#C5B59C" stroke="#3A2418" stroke-width="0.4"/>
        <rect x="38" y="50" width="2.5" height="16" fill="#C5B59C" stroke="#3A2418" stroke-width="0.4"/>
      </svg>
    `
  },

  // 5. ACS712 Current Sensor
  acs712: {
    id: 'acs712',
    name: 'ACS712 Current Sensor (20A)',
    spec: 'Hall-Effect linear current detection, 100mV/A sensitivity',
    width: 68,
    height: 48,
    settleX: 470,
    settleY: 485,
    mass: 1.4,
    restitution: 0.3,
    render: () => `
      <svg width="68" height="48" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="64" height="44" rx="3" fill="#241912" stroke="#806B5A" stroke-width="0.8"/>
        <!-- Heavy 2-Pin Screw Terminal Block (Green/Coffee) -->
        <rect x="4" y="10" width="20" height="28" rx="2" fill="#384A28" stroke="#1F2E14" stroke-width="0.8"/>
        <!-- Metal Screws -->
        <circle cx="14" cy="17" r="4.5" fill="#D3C3A0" stroke="#3A2418" stroke-width="0.8"/>
        <line x1="11" y1="17" x2="17" y2="17" stroke="#3A2418" stroke-width="1.2"/>
        <circle cx="14" cy="31" r="4.5" fill="#D3C3A0" stroke="#3A2418" stroke-width="0.8"/>
        <line x1="11" y1="31" x2="17" y2="31" stroke="#3A2418" stroke-width="1.2"/>
        
        <!-- Allegro ACS712 SOIC-8 IC -->
        <rect x="32" y="15" width="16" height="18" rx="1" fill="#120A06" stroke="#483324" stroke-width="0.6"/>
        <circle cx="34" cy="18" r="0.8" fill="#F4D35E"/>
        <text x="35" y="24" font-family="'JetBrains Mono', monospace" font-size="3" font-weight="700" fill="#EDE2C5">ACS712</text>
        <text x="35" y="29" font-family="'JetBrains Mono', monospace" font-size="2.6" fill="#F4D35E">20A</text>

        <!-- 3-Pin Header (VCC, OUT, GND) -->
        <rect x="58" y="14" width="4" height="4" fill="#F4D35E"/>
        <rect x="58" y="22" width="4" height="4" fill="#F4D35E"/>
        <rect x="58" y="30" width="4" height="4" fill="#F4D35E"/>
        <text x="50" y="17" font-family="'JetBrains Mono', monospace" font-size="2.8" fill="#DFD3B1">VCC</text>
        <text x="50" y="25" font-family="'JetBrains Mono', monospace" font-size="2.8" fill="#DFD3B1">OUT</text>
        <text x="50" y="33" font-family="'JetBrains Mono', monospace" font-size="2.8" fill="#DFD3B1">GND</text>
      </svg>
    `
  },

  // 6. L298N Dual H-Bridge Motor Driver
  l298n: {
    id: 'l298n',
    name: 'L298N Dual H-Bridge Driver',
    spec: 'Dual DC motor drive, up to 2A per channel, heavy aluminum heatsink',
    width: 96,
    height: 84,
    settleX: 620,
    settleY: 440,
    mass: 2.5,
    restitution: 0.2,
    render: () => `
      <svg width="96" height="84" viewBox="0 0 96 84" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heatsinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3A3A3A"/>
            <stop offset="50%" stop-color="#1F1F1F"/>
            <stop offset="100%" stop-color="#3A3A3A"/>
          </linearGradient>
        </defs>
        <!-- Main Red/Dark Coffee PCB -->
        <rect x="2" y="2" width="92" height="80" rx="4" fill="#3D1A14" stroke="#806B5A" stroke-width="1"/>
        
        <!-- Extruded Aluminum Heatsink with Cooling Fins -->
        <rect x="24" y="6" width="48" height="28" rx="2" fill="url(#heatsinkGrad)" stroke="#111" stroke-width="0.8"/>
        ${(() => {
          let fins = '';
          for (let f = 0; f < 7; f++) {
            const x = 27 + f * 6.5;
            fins += `<line x1="${x}" y1="8" x2="${x}" y2="32" stroke="#555" stroke-width="2"/>`;
          }
          return fins;
        })()}
        <text x="36" y="22" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" fill="#F4D35E">L298N</text>

        <!-- Big Electrolytic Capacitor -->
        <circle cx="16" cy="22" r="9" fill="#1C1815" stroke="#3A2418" stroke-width="1"/>
        <path d="M 9 17 A 9 9 0 0 1 13 14 L 13 30 A 9 9 0 0 1 9 27 Z" fill="#EDE2C5"/>

        <!-- Blue/Coffee Screw Terminals for Motor A (left) and Motor B (right) -->
        <rect x="4" y="44" width="16" height="28" rx="1.5" fill="#3A2418" stroke="#806B5A" stroke-width="0.8"/>
        <circle cx="12" cy="52" r="3" fill="#D3C3A0"/>
        <circle cx="12" cy="64" r="3" fill="#D3C3A0"/>

        <rect x="76" y="44" width="16" height="28" rx="1.5" fill="#3A2418" stroke="#806B5A" stroke-width="0.8"/>
        <circle cx="84" cy="52" r="3" fill="#D3C3A0"/>
        <circle cx="84" cy="64" r="3" fill="#D3C3A0"/>

        <!-- 3-Terminal Power Block (bottom center: 12V, GND, 5V) -->
        <rect x="30" y="60" width="36" height="18" rx="1.5" fill="#384A28" stroke="#1F2E14" stroke-width="0.8"/>
        <circle cx="36" cy="69" r="2.8" fill="#D3C3A0"/>
        <circle cx="48" cy="69" r="2.8" fill="#D3C3A0"/>
        <circle cx="60" cy="69" r="2.8" fill="#D3C3A0"/>

        <!-- Logic Input Header Pins (ENA, IN1, IN2, IN3, IN4, ENB) -->
        ${(() => {
          let pins = '';
          for (let i = 0; i < 6; i++) {
            const x = 33 + i * 5.8;
            pins += `<rect x="${x}" y="44" width="2.5" height="5" fill="#F4D35E"/>`;
          }
          return pins;
        })()}
      </svg>
    `
  },

  // 7. Brushed DC Motor with Brass Shaft
  motor: {
    id: 'motor',
    name: 'Industrial DC Gear Motor',
    spec: '12V 250RPM, 0.45Nm Stall Torque, Solid Brass D-Shaft',
    width: 110,
    height: 52,
    settleX: 740,
    settleY: 470,
    mass: 2.2,
    restitution: 0.18,
    render: () => `
      <svg width="110" height="52" viewBox="0 0 110 52" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="metalCylinder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#DCDCDC"/>
            <stop offset="40%" stop-color="#F5F5F5"/>
            <stop offset="70%" stop-color="#B0B0B0"/>
            <stop offset="100%" stop-color="#707070"/>
          </linearGradient>
          <linearGradient id="brassShaft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#F4D35E"/>
            <stop offset="50%" stop-color="#FFE89A"/>
            <stop offset="100%" stop-color="#B89528"/>
          </linearGradient>
        </defs>

        <!-- Rear Terminal End Cap -->
        <rect x="2" y="10" width="8" height="32" rx="2" fill="#24150F"/>
        <!-- Copper Solder Tabs -->
        <rect x="0" y="14" width="3" height="4" fill="#C87533"/>
        <rect x="0" y="34" width="3" height="4" fill="#C87533"/>

        <!-- Main Metallic Motor Canister -->
        <rect x="10" y="6" width="60" height="40" rx="3" fill="url(#metalCylinder)" stroke="#505050" stroke-width="0.8"/>
        <!-- Stamped Cooling Slots & Technical Spec -->
        <line x1="20" y1="12" x2="28" y2="12" stroke="#444" stroke-width="1.2"/>
        <line x1="20" y1="40" x2="28" y2="40" stroke="#444" stroke-width="1.2"/>
        <text x="32" y="24" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" fill="#24150F">DC MOTOR 12V</text>
        <text x="32" y="32" font-family="'JetBrains Mono', monospace" font-size="3.2" fill="#555">SER: ET-370M</text>

        <!-- Front Bearing Collar -->
        <rect x="70" y="12" width="8" height="28" fill="#888" stroke="#444" stroke-width="0.6"/>

        <!-- Brass Output D-Shaft -->
        <rect x="78" y="21" width="28" height="10" rx="1" fill="url(#brassShaft)" stroke="#8A6B15" stroke-width="0.8"/>
        <!-- Flat D-Cut notch on shaft -->
        <rect x="94" y="21" width="12" height="2.5" fill="#E2BA30"/>
      </svg>
    `
  },

  // 8. 0.96" I2C OLED Display
  oled: {
    id: 'oled',
    name: '0.96" I2C OLED (128x64)',
    spec: 'SSD1306 Controller, live TinyML Trust Waveform & Out-of-Distribution status',
    width: 60,
    height: 60,
    settleX: 250,
    settleY: 375,
    mass: 0.9,
    restitution: 0.35,
    render: () => `
      <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="56" height="56" rx="3" fill="#20150F" stroke="#806B5A" stroke-width="0.8"/>
        <!-- Top 4 Header Pins -->
        <circle cx="18" cy="6" r="1.5" fill="#F4D35E"/>
        <circle cx="26" cy="6" r="1.5" fill="#F4D35E"/>
        <circle cx="34" cy="6" r="1.5" fill="#F4D35E"/>
        <circle cx="42" cy="6" r="1.5" fill="#F4D35E"/>

        <!-- Glass Display Bezel -->
        <rect x="7" y="13" width="46" height="36" rx="2" fill="#0C0704" stroke="#443224" stroke-width="0.8"/>
        
        <!-- Active OLED Telemetry Graphic (Butter Yellow on Deep Black) -->
        <rect x="9" y="15" width="42" height="32" fill="#140D09"/>
        <text x="12" y="22" font-family="'JetBrains Mono', monospace" font-size="3.5" font-weight="700" fill="#F4D35E">EDGETWIN v1</text>
        <text x="12" y="28" font-family="'JetBrains Mono', monospace" font-size="3" fill="#EDE2C5">TRUST: 98.4%</text>
        <!-- Mini Telemetry Sparkline -->
        <polyline points="12,38 18,37 24,39 30,34 36,36 42,33 48,34" fill="none" stroke="#F4D35E" stroke-width="1"/>
        <circle cx="48" cy="34" r="1.2" fill="#FFE89A"/>
        <text x="12" y="44" font-family="'JetBrains Mono', monospace" font-size="2.6" fill="#806B5A">SIM-BOUND: OK</text>
      </svg>
    `
  },

  // 9. Status LEDs and Current-Limiting Resistor
  leds: {
    id: 'leds',
    name: '5mm Status LEDs & 1kΩ Resistor',
    spec: 'Dual state indicators (Active/Warning) with metal film pull-down resistor',
    width: 44,
    height: 52,
    settleX: 380,
    settleY: 385,
    mass: 0.6,
    restitution: 0.4,
    render: () => `
      <svg width="44" height="52" viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg">
        <!-- Butter Yellow 5mm Diffused LED -->
        <path d="M 6 18 A 6 6 0 0 1 18 18 L 18 24 L 6 24 Z" fill="#F4D35E" stroke="#C4A330" stroke-width="0.6"/>
        <rect x="5" y="24" width="14" height="2" fill="#E2BA30"/>
        <!-- Metal Lead Legs -->
        <line x1="9" y1="26" x2="9" y2="48" stroke="#806B5A" stroke-width="1"/>
        <line x1="15" y1="26" x2="15" y2="52" stroke="#806B5A" stroke-width="1"/>

        <!-- Soft Amber/Coffee LED -->
        <path d="M 26 18 A 6 6 0 0 1 38 18 L 38 24 L 26 24 Z" fill="#FFE89A" stroke="#B89528" stroke-width="0.6"/>
        <rect x="25" y="24" width="14" height="2" fill="#B89528"/>
        <line x1="29" y1="26" x2="29" y2="48" stroke="#806B5A" stroke-width="1"/>
        <line x1="35" y1="26" x2="35" y2="52" stroke="#806B5A" stroke-width="1"/>

        <!-- Ceramic Resistor in between legs -->
        <rect x="18" y="32" width="8" height="3" rx="1" fill="#D8CAB0" stroke="#806B5A" stroke-width="0.4"/>
        <line x1="20" y1="32" x2="20" y2="35" stroke="#3A2418" stroke-width="0.8"/>
        <line x1="22" y1="32" x2="22" y2="35" stroke="#24150F" stroke-width="0.8"/>
        <line x1="24" y1="32" x2="24" y2="35" stroke="#F4D35E" stroke-width="0.8"/>
      </svg>
    `
  },

  // 10. Acoustic Piezo Buzzer
  buzzer: {
    id: 'buzzer',
    name: 'Piezo Acoustic Warning Buzzer',
    spec: 'Resonant frequency 2.4kHz, out-of-distribution acoustic trigger',
    width: 42,
    height: 44,
    settleX: 520,
    settleY: 410,
    mass: 0.7,
    restitution: 0.35,
    render: () => `
      <svg width="42" height="44" viewBox="0 0 42 44" xmlns="http://www.w3.org/2000/svg">
        <!-- Cylindrical Black Body -->
        <circle cx="21" cy="20" r="17" fill="#1C140E" stroke="#3A2418" stroke-width="1.2"/>
        <circle cx="21" cy="20" r="4.5" fill="#0E0906" stroke="#483324" stroke-width="0.8"/>
        <!-- (+) Polarity marking -->
        <text x="28" y="15" font-family="'Space Grotesk', sans-serif" font-size="8" font-weight="700" fill="#F4D35E">+</text>
        <!-- Leg pins -->
        <line x1="15" y1="37" x2="15" y2="44" stroke="#806B5A" stroke-width="1.2"/>
        <line x1="27" y1="37" x2="27" y2="44" stroke="#806B5A" stroke-width="1.2"/>
      </svg>
    `
  }
};
