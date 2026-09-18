# EdgeTwin Backend

A working backend for the **EdgeTwin** idea from your chat: a trust layer
for TinyML that detects when real-world sensor data has drifted from the
conditions the model was validated on, and turns that into an operational
**TRUST / CAUTION / UNKNOWN** decision — not just a dashboard number.

## What's actually implemented (not just a mockup)

- **Reality Gap Index (RGI)** — a real Mahalanobis-distance calculation
  against a calibrated "validated envelope" built from your
  simulation/training data (`reality_gap.py`). RGI = 50 corresponds to the
  95th-percentile distance seen in training; it scales from there. This is
  the concrete, defensible answer to "how exactly are you calculating
  that percentage?"
- **Trust engine** (`trust_engine.py`) — maps RGI into `TRUST` (ALLOW),
  `CAUTION` (MONITOR), `UNKNOWN` (ABSTAIN), matching the three-state
  design discussed in the chat.
- **History + retraining pipeline** (`database.py`, SQLite) — every
  reading is logged; you can tag real-world samples for adaptation and
  recalibrate the envelope, reproducing the "before/after adaptation"
  demo.
- **FastAPI backend** (`main.py`) with interactive docs at `/docs`.
- **Simulator** (`simulate_demo.py`) that runs the full 3-stage demo
  (validated → shifted → adapted) with no hardware, so you can test/backup
  the demo.
- **Minimal live dashboard** (`dashboard.html`) — open it directly in a
  browser, no build step.
- **Example ESP32 sketch** (`esp32_client_example.ino`) showing exactly
  how the device should POST readings to the backend.

## 1. Setup

```bash
cd edgetwin-backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Run the backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:8000/docs to see and try every endpoint interactively.

## 3. Try the full demo with no hardware

In a second terminal (same venv):

```bash
python simulate_demo.py
```

This will:
1. Calibrate the validated envelope from simulated "normal operation" data.
2. Send Stage 1 readings (validated conditions) — expect low RGI, `TRUST`.
3. Send Stage 2 readings (motor sped up / vibration increased) — expect
   RGI to jump and trust to drop to `CAUTION`/`UNKNOWN`, **even though the
   model still predicts NORMAL** — this is the core "money shot" from your
   pitch.
4. Collect those Stage 2 samples, recalibrate ("adaptation"), and re-send
   the same shifted readings — RGI should now be much lower.

## 4. Watch it live

Open `dashboard.html` directly in your browser (just double-click it, or
`open dashboard.html`) while `simulate_demo.py` or your ESP32 is sending
data — it polls `/api/status` and `/api/history` every 2 seconds.

## 5. Wire up your real ESP32

See `esp32_client_example.ino`. Replace the placeholder `read_*()`
functions with your actual MPU6050 / temperature / RPM / current sensor
code, and replace `run_tinyml_inference()` with your real TFLite Micro
model call. Point `BACKEND_URL` at your laptop's LAN IP (find it with
`ipconfig` / `ifconfig`) — not `localhost`, since the ESP32 is a separate
device on the network.

## API reference

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/envelope/calibrate` | Build the validated envelope from training/simulation samples |
| `GET`  | `/api/envelope` | View the current envelope's stats |
| `POST` | `/api/ingest` | Submit a sensor reading + TinyML prediction; get back RGI + trust decision |
| `GET`  | `/api/status` | Latest reading + trust state (for dashboards) |
| `GET`  | `/api/history?limit=100` | Recent readings |
| `POST` | `/api/retrain/collect` | Tag a real-world sample with its true label for the next adaptation round |
| `GET`  | `/api/retrain/samples` | List samples pending adaptation |
| `POST` | `/api/retrain/apply` | Recalibrate the envelope using collected samples ("adaptation") |
| `DELETE` | `/api/history` | Clear stored readings |

### Example: calibrate the envelope

```bash
curl -X POST http://localhost:8000/api/envelope/calibrate \
  -H "Content-Type: application/json" \
  -d '{
    "samples": [
      {"temperature": 26, "vibration_rms": 0.22, "rpm": 1000, "current": 0.65},
      {"temperature": 27, "vibration_rms": 0.25, "rpm": 1010, "current": 0.68}
      /* ... at least 5, ideally 100+ samples from your simulation ... */
    ]
  }'
```

### Example: ingest a reading

```bash
curl -X POST http://localhost:8000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "features": {"temperature": 39, "vibration_rms": 0.82, "rpm": 1500, "current": 1.2},
    "prediction": {"label": "NORMAL", "confidence": 0.91},
    "device_id": "esp32-01"
  }'
```

Response includes `reality_gap.reality_gap_index`, `reality_gap.per_feature`
(which specific features are outside the validated range), and
`trust.trust_state` / `trust.recommended_action`.

## Notes for your pitch

- The RGI thresholds (`LOW_THRESHOLD = 30`, `HIGH_THRESHOLD = 60` in
  `trust_engine.py`) are a starting point — the README in the chat you
  pasted correctly notes these should be tuned experimentally against your
  actual hardware's behavior. Run `simulate_demo.py`, look at the RGI
  values it produces for your real shift conditions, and adjust.
- `/api/retrain/apply` recalibrates the **statistical envelope** used for
  the Reality Gap Index. It does not retrain your actual TFLite model —
  plug your real quantization/retraining pipeline in there too if you want
  the on-device prediction itself to improve, not just the drift
  detection.
