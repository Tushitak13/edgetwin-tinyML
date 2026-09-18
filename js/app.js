/**
 * EDGETWIN APPLICATION CONTROLLER
 * Orchestrates the full physical-to-digital sequence:
 * 1. Warm cream environment initialization
 * 2. Physical hardware drops from above with realistic gravity and settles on workbench
 * 3. Pause
 * 4. Butter Yellow data pulses travel along DuPont wires from sensors to ESP32
 * 5. Digital Twin wireframe constructs above the workbench
 * 6. "● PHYSICAL SYSTEM ONLINE" status illuminates
 * 7. Interactive inspection & Sim-to-Real Trust simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Physics Stage
  const stage = new HardwarePhysicsStage('hardwareStage');
  const pulses = new DataPulseEngine('.data-pulse-canvas', stage);
  const digitalTwin = new DigitalTwinEngine('.digital-twin-canvas', '.twin-hud-overlay');
  const trustSim = new TrustSimulator();

  // Status elements
  const statusIndicator = document.querySelector('.system-status-indicator');
  const statementTag = document.querySelector('.stage-statement-tag');

  // Wire up sequence when hardware settles onto the workbench
  stage.onSettled((components) => {
    // Step 1: Brief pause (600ms) after hardware lands
    setTimeout(() => {
      // Step 2: Butter Yellow data pulses begin traveling
      pulses.startAfterDelay(0);

      // Step 3: Digital Twin wireframe projection forms above hardware
      setTimeout(() => {
        digitalTwin.activate();

        // Step 4: Physical System Online status indicator
        if (statusIndicator) {
          statusIndicator.innerHTML = `
            <span class="status-dot-active"></span>
            <span>● PHYSICAL SYSTEM ONLINE</span>
          `;
        }

        if (statementTag) {
          statementTag.textContent = 'SIM-TO-REAL TRUST LAYER';
          statementTag.style.color = 'var(--butter-yellow)';
        }
      }, 700);

    }, 600);
  });

  // Replay Drop Button
  const replayBtn = document.getElementById('replayDropBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      // Reset digital twin & pulses
      digitalTwin.reset();
      pulses.stop();

      if (statusIndicator) {
        statusIndicator.innerHTML = `
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--muted-coffee); display: inline-block;"></span>
          <span>CALIBRATING HARDWARE...</span>
        `;
      }

      // Re-trigger drop
      stage.replay();
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Primary CTA interaction: "ENTER THE TWIN →"
  // Displays an engineering manifest modal confirming the physical link, without navigating away to any forbidden dashboard screens!
  const enterBtns = document.querySelectorAll('.trigger-enter-twin');
  const modal = document.getElementById('twinAccessModal');
  const modalClose = document.getElementById('closeModalBtn');

  enterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});
