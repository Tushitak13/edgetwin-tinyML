import React, { useEffect, useRef } from 'react';

interface HardwareRainProps {
  isPlaying: boolean;
  onSequenceComplete?: () => void;
  onPhaseChange?: (phase: 'initializing' | 'cascading' | 'clearing' | 'settled') => void;
}

export const HardwareRain: React.FC<HardwareRainProps> = ({
  isPlaying,
  onPhaseChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || !containerRef.current) return;

    onPhaseChange?.('initializing');
    const items = containerRef.current.querySelectorAll('.hardware-item');

    // Reset styles
    items.forEach((el) => {
      const item = el as HTMLElement;
      item.classList.remove('animate-rain-hardware');
      item.style.transform = 'translateY(-260px) rotate(var(--rot-start, -10deg))';
      item.style.opacity = '0';
      item.style.visibility = 'hidden';
      void item.offsetWidth;
    });

    // Start cascade
    const animFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        items.forEach((el) => {
          const item = el as HTMLElement;
          item.style.transform = '';
          item.style.opacity = '';
          item.style.visibility = '';
          item.classList.add('animate-rain-hardware');
        });
      });
    });

    const timer1 = setTimeout(() => {
      onPhaseChange?.('cascading');
    }, 800);

    const timer2 = setTimeout(() => {
      onPhaseChange?.('clearing');
    }, 1600);

    const timer3 = setTimeout(() => {
      onPhaseChange?.('settled');
    }, 2600);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isPlaying, onPhaseChange]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full max-w-7xl mx-auto pointer-events-none z-30 overflow-hidden"
      id="heroHardwareDropStage"
    >
      {/* 1. BREADBOARD BB-830 */}
      <div
        className="hardware-item animate-rain-hardware component-shadow-lg"
        style={
          {
            left: '1.5%',
            width: '175px',
            height: '85px',
            '--drop-delay': '0.05s',
            '--drop-dur': '2.1s',
            '--rot-start': '-14deg',
            '--rot-end': '-2deg',
            '--item-scale': '0.9',
          } as React.CSSProperties
        }
        title="Solderless Breadboard - Prototyping Matrix"
      >
        <svg className="w-full h-full rounded shadow-md" viewBox="0 0 220 110">
          <rect fill="#F9F6EE" height="110" rx="5" stroke="#D8CBB2" strokeWidth="2" width="220" x="0" y="0" />
          <line stroke="#D9534F" strokeDasharray="4 2" strokeWidth="1.5" x1="8" x2="212" y1="12" y2="12" />
          <line stroke="#3A2418" strokeDasharray="4 2" strokeWidth="1.5" x1="8" x2="212" y1="20" y2="20" />
          <line stroke="#3A2418" strokeDasharray="4 2" strokeWidth="1.5" x1="8" x2="212" y1="90" y2="90" />
          <line stroke="#D9534F" strokeDasharray="4 2" strokeWidth="1.5" x1="8" x2="212" y1="98" y2="98" />
          <rect fill="#EDE2C5" height="6" width="200" x="10" y="52" />
          <g fill="#806B5A" opacity="0.65">
            {[20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200].map((cx) => (
              <React.Fragment key={cx}>
                <circle cx={cx} cy="30" r="1.5" />
                <circle cx={cx} cy="40" r="1.5" />
                <circle cx={cx} cy="70" r="1.5" />
                <circle cx={cx} cy="80" r="1.5" />
              </React.Fragment>
            ))}
          </g>
          <text fill="#806B5A" fontFamily="JetBrains Mono" fontSize="6" fontWeight="bold" textAnchor="middle" x="110" y="56">
            BB-830 TIE POINT
          </text>
        </svg>
      </div>

      {/* 2. DHT22 SENSOR */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '14%',
            width: '44px',
            height: '60px',
            '--drop-delay': '0.18s',
            '--drop-dur': '2.25s',
            '--rot-start': '18deg',
            '--rot-end': '4deg',
            '--item-scale': '0.95',
          } as React.CSSProperties
        }
        title="DHT22 Sensor"
      >
        <svg className="w-full h-full" viewBox="0 0 64 85">
          <rect fill="#3A2418" height="26" rx="2" stroke="#24150F" strokeWidth="1" width="40" x="12" y="55" />
          <rect fill="#F4D35E" height="8" width="3" x="20" y="77" />
          <rect fill="#F4D35E" height="8" width="3" x="30" y="77" />
          <rect fill="#F4D35E" height="8" width="3" x="40" y="77" />
          <rect fill="#FFFFFF" height="55" rx="4" stroke="#D8CBB2" strokeWidth="1.5" width="48" x="8" y="4" />
          <line stroke="#806B5A" strokeWidth="2" x1="16" x2="48" y1="14" y2="14" />
          <line stroke="#806B5A" strokeWidth="2" x1="16" x2="48" y1="22" y2="22" />
          <line stroke="#806B5A" strokeWidth="2" x1="16" x2="48" y1="30" y2="30" />
          <line stroke="#806B5A" strokeWidth="2" x1="16" x2="48" y1="38" y2="38" />
          <line stroke="#806B5A" strokeWidth="2" x1="16" x2="48" y1="46" y2="46" />
          <text fill="#3A2418" fontFamily="JetBrains Mono" fontSize="5.5" fontWeight="bold" textAnchor="middle" x="32" y="53">
            DHT22
          </text>
        </svg>
      </div>

      {/* 3. MPU6050 6-AXIS GYRO & ACCELEROMETER */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '23%',
            width: '50px',
            height: '38px',
            '--drop-delay': '0.12s',
            '--drop-dur': '2.0s',
            '--rot-start': '-24deg',
            '--rot-end': '-6deg',
            '--item-scale': '1',
          } as React.CSSProperties
        }
        title="MPU6050 IMU Sensor"
      >
        <svg className="w-full h-full" viewBox="0 0 72 50">
          <rect fill="#24150F" height="46" rx="3" stroke="#F4D35E" strokeWidth="1.2" width="68" x="2" y="2" />
          <circle cx="9" cy="9" fill="#F7F0DC" r="3.5" stroke="#F4D35E" strokeWidth="1" />
          <rect fill="#110905" height="20" rx="1" stroke="#3A2418" strokeWidth="1" width="20" x="26" y="14" />
          <circle cx="29" cy="17" fill="#FFE89A" r="1" />
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="4.5" fontWeight="bold" textAnchor="middle" x="36" y="26">
            MPU
          </text>
          <text fill="#EDE2C5" fontFamily="JetBrains Mono" fontSize="3.5" textAnchor="middle" x="36" y="31">
            6050
          </text>
          <g fill="#F4D35E">
            {[10, 17, 24, 31, 38, 45, 52, 59].map((x) => (
              <rect key={x} height="6" width="4" x={x} y="42" />
            ))}
          </g>
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="5" textAnchor="end" x="64" y="12">
            I2C
          </text>
        </svg>
      </div>

      {/* 4. ACS712 CURRENT SENSOR BOARD */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '32%',
            width: '48px',
            height: '42px',
            '--drop-delay': '0.32s',
            '--drop-dur': '2.15s',
            '--rot-start': '16deg',
            '--rot-end': '2deg',
            '--item-scale': '0.95',
          } as React.CSSProperties
        }
        title="ACS712 Current Sensor"
      >
        <svg className="w-full h-full" viewBox="0 0 68 58">
          <rect fill="#3A2418" height="54" rx="3" stroke="#806B5A" strokeWidth="1" width="64" x="2" y="2" />
          <rect fill="#24150F" height="26" rx="2" stroke="#F4D35E" strokeWidth="1" width="22" x="6" y="8" />
          <circle cx="17" cy="15" fill="#806B5A" r="4" stroke="#EDE2C5" strokeWidth="1" />
          <line stroke="#24150F" strokeWidth="1" x1="14" x2="20" y1="15" y2="15" />
          <circle cx="17" cy="27" fill="#806B5A" r="4" stroke="#EDE2C5" strokeWidth="1" />
          <line stroke="#24150F" strokeWidth="1" x1="14" x2="20" y1="27" y2="27" />
          <rect fill="#110905" height="14" rx="1" width="16" x="36" y="16" />
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="3.5" textAnchor="middle" x="44" y="24">
            ACS712
          </text>
          <text fill="#806B5A" fontFamily="JetBrains Mono" fontSize="3" textAnchor="middle" x="44" y="28">
            30A
          </text>
          <rect fill="#F4D35E" height="8" width="3" x="56" y="38" />
          <rect fill="#F4D35E" height="8" width="3" x="50" y="38" />
          <rect fill="#F4D35E" height="8" width="3" x="44" y="38" />
        </svg>
      </div>

      {/* 5. ATTINY85 CORE */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '41%',
            width: '34px',
            height: '38px',
            '--drop-delay': '0.08s',
            '--drop-dur': '1.9s',
            '--rot-start': '-28deg',
            '--rot-end': '12deg',
            '--item-scale': '0.85',
          } as React.CSSProperties
        }
        title="ATTINY85 Core"
      >
        <svg className="w-full h-full" viewBox="0 0 40 46">
          <rect fill="#24150F" height="38" rx="2" stroke="#806B5A" strokeWidth="1.2" width="32" x="4" y="4" />
          <circle cx="9" cy="9" fill="#FFE89A" r="1.5" />
          <g fill="#F4D35E">
            <rect height="3" width="5" x="0" y="8" />
            <rect height="3" width="5" x="0" y="16" />
            <rect height="3" width="5" x="0" y="24" />
            <rect height="3" width="5" x="0" y="32" />
            <rect height="3" width="5" x="35" y="8" />
            <rect height="3" width="5" x="35" y="16" />
            <rect height="3" width="5" x="35" y="24" />
            <rect height="3" width="5" x="35" y="32" />
          </g>
          <text fill="#EDE2C5" fontFamily="JetBrains Mono" fontSize="4" fontWeight="bold" textAnchor="middle" x="20" y="24">
            TINY
          </text>
        </svg>
      </div>

      {/* 6. ESP32 DEVKIT CORE MICROCONTROLLER */}
      <div
        className="hardware-item animate-rain-hardware component-shadow-lg"
        style={
          {
            left: '48%',
            width: '80px',
            height: '118px',
            '--drop-delay': '0.22s',
            '--drop-dur': '2.3s',
            '--rot-start': '-8deg',
            '--rot-end': '3deg',
            '--item-scale': '1.05',
          } as React.CSSProperties
        }
        title="ESP32 DevKit - Edge Processing Node"
      >
        <svg className="w-full h-full" viewBox="0 0 110 160">
          <rect fill="#24150F" height="152" rx="4" stroke="#F4D35E" strokeWidth="1.8" width="102" x="4" y="4" />
          <rect fill="#D8CBB2" height="14" rx="2" stroke="#3A2418" strokeWidth="1" width="30" x="40" y="146" />
          <rect fill="#24150F" height="6" width="16" x="47" y="152" />
          <rect fill="#C5BAA5" height="62" rx="3" stroke="#806B5A" strokeWidth="1.2" width="70" x="20" y="14" />
          <rect fill="#806B5A" height="12" width="54" x="28" y="18" />
          <path d="M 32 24 H 42 V 20 H 52 V 24 H 62 V 20 H 74" fill="none" stroke="#F4D35E" strokeWidth="1.5" />
          <text fill="#24150F" fontFamily="Space Grotesk" fontSize="7" fontWeight="bold" textAnchor="middle" x="55" y="45">
            ESP32-WROOM-32
          </text>
          <text fill="#3A2418" fontFamily="JetBrains Mono" fontSize="5" textAnchor="middle" x="55" y="55">
            TINYML TRUST CORE
          </text>
          <text fill="#3A2418" fontFamily="JetBrains Mono" fontSize="4" textAnchor="middle" x="55" y="66">
            FCC ID: 2AC7Z-ESPWROOM32
          </text>
          <rect fill="#806B5A" height="12" rx="1" width="12" x="12" y="125" />
          <circle cx="18" cy="131" fill="#EDE2C5" r="3" />
          <rect fill="#806B5A" height="12" rx="1" width="12" x="86" y="125" />
          <circle cx="92" cy="131" fill="#EDE2C5" r="3" />
          <rect fill="#110905" height="24" rx="1" width="26" x="42" y="112" />
          <circle cx="45" cy="116" fill="#F4D35E" r="1" />
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="4" textAnchor="middle" x="55" y="125">
            CP2102
          </text>
          <g fill="#F4D35E">
            {[16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120].map((y) => (
              <React.Fragment key={y}>
                <rect height="4" width="5" x="6" y={y} />
                <rect height="4" width="5" x="99" y={y} />
              </React.Fragment>
            ))}
          </g>
          <rect fill="#D9534F" height="3" width="4" x="36" y="95" />
          <rect fill="#F4D35E" height="3" width="4" x="70" y="95" className="animate-pulse" />
        </svg>
      </div>

      {/* 7. 0.96" I2C OLED DISPLAY */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '58%',
            width: '56px',
            height: '48px',
            '--drop-delay': '0.15s',
            '--drop-dur': '2.1s',
            '--rot-start': '14deg',
            '--rot-end': '-2deg',
            '--item-scale': '0.95',
          } as React.CSSProperties
        }
        title="0.96 inch OLED Display"
      >
        <svg className="w-full h-full" viewBox="0 0 75 65">
          <rect fill="#24150F" height="61" rx="3" stroke="#F4D35E" strokeWidth="1.2" width="71" x="2" y="2" />
          <g fill="#F4D35E">
            <rect height="5" width="3" x="24" y="3" />
            <rect height="5" width="3" x="31" y="3" />
            <rect height="5" width="3" x="38" y="3" />
            <rect height="5" width="3" x="45" y="3" />
          </g>
          <rect fill="#0C0705" height="40" rx="1.5" stroke="#806B5A" strokeWidth="1" width="59" x="8" y="17" />
          <rect fill="#1A110B" height="34" width="53" x="11" y="20" />
          <text fill="#F4D35E" fontFamily="JetBrains Mono" fontSize="4.5" fontWeight="bold" x="14" y="28">
            EDGETWIN v1.0
          </text>
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="4" x="14" y="36">
            TRUST: 99.8%
          </text>
          <text fill="#EDE2C5" fontFamily="JetBrains Mono" fontSize="4" x="14" y="44">
            SIM-TO-REAL OK
          </text>
          <text fill="#F4D35E" fontFamily="JetBrains Mono" fontSize="3.5" x="14" y="51">
            ● IN-DISTRIBUTION
          </text>
        </svg>
      </div>

      {/* 8. L298N DUAL H-BRIDGE MOTOR DRIVER */}
      <div
        className="hardware-item animate-rain-hardware component-shadow-lg"
        style={
          {
            left: '68%',
            width: '72px',
            height: '82px',
            '--drop-delay': '0.28s',
            '--drop-dur': '2.2s',
            '--rot-start': '-18deg',
            '--rot-end': '2deg',
            '--item-scale': '0.95',
          } as React.CSSProperties
        }
        title="L298N Motor Driver"
      >
        <svg className="w-full h-full" viewBox="0 0 100 110">
          <rect fill="#3A2418" height="102" rx="4" stroke="#24150F" strokeWidth="2" width="92" x="4" y="4" />
          <rect fill="#1C110C" height="48" rx="2" stroke="#806B5A" strokeWidth="1.2" width="56" x="22" y="16" />
          {[28, 34, 40, 46, 52, 58, 64, 70].map((x) => (
            <line key={x} stroke="#3A2418" strokeWidth="2" x1={x} x2={x} y1="18" y2="62" />
          ))}
          <circle cx="10" cy="10" fill="#EDE2C5" r="3" stroke="#24150F" />
          <circle cx="90" cy="10" fill="#EDE2C5" r="3" stroke="#24150F" />
          <circle cx="10" cy="100" fill="#EDE2C5" r="3" stroke="#24150F" />
          <circle cx="90" cy="100" fill="#EDE2C5" r="3" stroke="#24150F" />
          <rect fill="#24150F" height="20" stroke="#F4D35E" strokeWidth="1" width="26" x="8" y="74" />
          <circle cx="15" cy="84" fill="#806B5A" r="3" />
          <circle cx="27" cy="84" fill="#806B5A" r="3" />
          <rect fill="#24150F" height="20" stroke="#F4D35E" strokeWidth="1" width="26" x="66" y="74" />
          <circle cx="73" cy="84" fill="#806B5A" r="3" />
          <circle cx="85" cy="84" fill="#806B5A" r="3" />
          <text fill="#F4D35E" fontFamily="JetBrains Mono" fontSize="6" fontWeight="bold" textAnchor="middle" x="50" y="75">
            L298N
          </text>
        </svg>
      </div>

      {/* 9. DC MOTOR WITH ENCODER WHEEL */}
      <div
        className="hardware-item animate-rain-hardware component-shadow-lg"
        style={
          {
            left: '77%',
            width: '92px',
            height: '68px',
            '--drop-delay': '0.1s',
            '--drop-dur': '2.15s',
            '--rot-start': '12deg',
            '--rot-end': '-4deg',
            '--item-scale': '0.95',
          } as React.CSSProperties
        }
        title="DC Motor with Optical Encoder"
      >
        <svg className="w-full h-full" viewBox="0 0 130 95">
          <rect fill="#F4D35E" height="52" rx="4" stroke="#3A2418" strokeWidth="1.8" width="62" x="18" y="24" />
          <rect fill="#A89B88" height="36" rx="3" stroke="#3A2418" strokeWidth="1.5" width="42" x="80" y="32" />
          <line stroke="#EDE2C5" strokeWidth="1" x1="88" x2="88" y1="32" y2="68" />
          <line stroke="#EDE2C5" strokeWidth="1" x1="104" x2="104" y1="32" y2="68" />
          <rect fill="#D9534F" height="3" width="6" x="120" y="42" />
          <rect fill="#24150F" height="3" width="6" x="120" y="55" />
          <rect fill="#D8CBB2" height="10" rx="1" stroke="#24150F" strokeWidth="1.2" width="12" x="6" y="45" />
          <circle cx="12" cy="50" fill="none" r="16" stroke="#24150F" strokeDasharray="2 3" strokeWidth="2" />
          <circle cx="26" cy="32" fill="#3A2418" r="2.5" />
          <circle cx="70" cy="32" fill="#3A2418" r="2.5" />
          <circle cx="26" cy="68" fill="#3A2418" r="2.5" />
          <circle cx="70" cy="68" fill="#3A2418" r="2.5" />
          <text fill="#3A2418" fontFamily="Space Grotesk" fontSize="7" fontWeight="bold" textAnchor="middle" x="49" y="52">
            TT MOTOR
          </text>
          <text fill="#3A2418" fontFamily="JetBrains Mono" fontSize="4.5" textAnchor="middle" x="49" y="61">
            1:48 ENCODER
          </text>
        </svg>
      </div>

      {/* 10. PIEZO ANOMALY BUZZER */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '88%',
            width: '34px',
            height: '38px',
            '--drop-delay': '0.24s',
            '--drop-dur': '2.05s',
            '--rot-start': '-20deg',
            '--rot-end': '8deg',
            '--item-scale': '0.9',
          } as React.CSSProperties
        }
        title="Piezo Acoustic Alarm"
      >
        <svg className="w-full h-full" viewBox="0 0 45 48">
          <circle cx="22" cy="22" fill="#1C110C" r="18" stroke="#806B5A" strokeWidth="1.5" />
          <circle cx="22" cy="22" fill="#3A2418" r="6" stroke="#F4D35E" strokeWidth="1" />
          <path d="M 28 10 Q 32 14 32 22 Q 32 30 28 34" fill="none" stroke="#F4D35E" strokeDasharray="2 2" strokeWidth="1" />
          <line stroke="#D9534F" strokeWidth="2" x1="16" x2="14" y1="40" y2="48" />
          <line stroke="#24150F" strokeWidth="2" x1="28" x2="30" y1="40" y2="48" />
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="6" fontWeight="bold" x="14" y="20">
            +
          </text>
        </svg>
      </div>

      {/* 11. 74HC595 SHIFT REGISTER */}
      <div
        className="hardware-item animate-rain-hardware component-shadow"
        style={
          {
            left: '93%',
            width: '40px',
            height: '26px',
            '--drop-delay': '0.35s',
            '--drop-dur': '2.3s',
            '--rot-start': '22deg',
            '--rot-end': '-6deg',
            '--item-scale': '0.85',
          } as React.CSSProperties
        }
        title="74HC595 Shift Register"
      >
        <svg className="w-full h-full" viewBox="0 0 60 38">
          <rect fill="#1A110B" height="30" rx="2" stroke="#806B5A" strokeWidth="1" width="52" x="4" y="4" />
          <circle cx="8" cy="8" fill="#F4D35E" r="1.5" />
          <text fill="#FFE89A" fontFamily="JetBrains Mono" fontSize="4.5" textAnchor="middle" x="30" y="20">
            74HC595
          </text>
          <g fill="#F4D35E">
            <rect height="4" width="3" x="8" y="0" />
            <rect height="4" width="3" x="16" y="0" />
            <rect height="4" width="3" x="24" y="0" />
            <rect height="4" width="3" x="32" y="0" />
            <rect height="4" width="3" x="40" y="0" />
            <rect height="4" width="3" x="48" y="0" />
            <rect height="4" width="3" x="8" y="34" />
            <rect height="4" width="3" x="16" y="34" />
            <rect height="4" width="3" x="24" y="34" />
            <rect height="4" width="3" x="32" y="34" />
            <rect height="4" width="3" x="40" y="34" />
            <rect height="4" width="3" x="48" y="34" />
          </g>
        </svg>
      </div>
    </div>
  );
};
