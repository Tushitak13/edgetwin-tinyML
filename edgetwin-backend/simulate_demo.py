"""
simulate_demo.py
Runs the full EdgeTwin 3-stage demo against a running backend, with no
hardware required. Useful for testing, and as a fallback/backup demo if
your ESP32 misbehaves on stage.

Stage 1 — Validated environment  (motor at normal speed/vibration)
Stage 2 — Reality shift          (motor sped up / vibration increased)
Stage 3 — Adaptation             (collect samples from stage 2, retrain
                                   the envelope, re-send stage 2 readings
                                   and watch the Reality Gap Index drop)

Run:
    pip install requests numpy
    python simulate_demo.py
(with the backend already running via `uvicorn main:app --reload`)
"""

import time
import requests
import numpy as np

BASE_URL = "http://localhost:8000"


def gen_samples(n, temp_range, vib_range, rpm_range, current_range, seed=0):
    rng = np.random.default_rng(seed)
    samples = []
    for _ in range(n):
        samples.append({
            "temperature": float(rng.uniform(*temp_range)),
            "vibration_rms": float(rng.uniform(*vib_range)),
            "rpm": float(rng.uniform(*rpm_range)),
            "current": float(rng.uniform(*current_range)),
        })
    return samples


def calibrate():
    print("\n=== Calibrating validated envelope from simulated training data ===")
    samples = gen_samples(
        n=200,
        temp_range=(24, 30),
        vib_range=(0.15, 0.40),
        rpm_range=(950, 1150),
        current_range=(0.5, 0.85),
        seed=1,
    )
    resp = requests.post(f"{BASE_URL}/api/envelope/calibrate", json={"samples": samples})
    resp.raise_for_status()
    print(resp.json())


def send_reading(features, label, confidence, stage_tag):
    resp = requests.post(f"{BASE_URL}/api/ingest", json={
        "features": features,
        "prediction": {"label": label, "confidence": confidence},
        "device_id": "simulator",
    })
    data = resp.json()
    gap = data["reality_gap"]["reality_gap_index"]
    trust = data["trust"]["trust_state"]
    print(f"[{stage_tag}] pred={label} conf={confidence:.2f}  "
          f"RGI={gap:5.1f}  trust={trust:8s}  features={features}")
    return data


def stage_1():
    print("\n=== STAGE 1: Validated environment ===")
    for _ in range(5):
        f = gen_samples(1, (25, 29), (0.18, 0.35), (980, 1120), (0.55, 0.80), seed=np.random.randint(1e6))[0]
        send_reading(f, "NORMAL", 0.94, "STAGE 1")
        time.sleep(0.2)


def stage_2():
    print("\n=== STAGE 2: Reality shift (motor sped up / vibration increased) ===")
    shifted = []
    for _ in range(5):
        f = gen_samples(1, (36, 42), (0.75, 0.95), (1450, 1600), (1.1, 1.4), seed=np.random.randint(1e6))[0]
        send_reading(f, "NORMAL", 0.89, "STAGE 2")
        shifted.append(f)
        time.sleep(0.2)
    return shifted


def stage_3(shifted_samples):
    print("\n=== STAGE 3: Adaptation ===")
    for f in shifted_samples:
        requests.post(f"{BASE_URL}/api/retrain/collect", json={
            "features": f, "true_label": "NORMAL", "note": "collected during shifted operation"
        })
    resp = requests.post(f"{BASE_URL}/api/retrain/apply")
    resp.raise_for_status()
    print("Adaptation applied:", resp.json()["status"])

    print("\n--- Re-sending the SAME shifted conditions after adaptation ---")
    for f in shifted_samples:
        send_reading(f, "NORMAL", 0.92, "STAGE 3")
        time.sleep(0.2)


if __name__ == "__main__":
    calibrate()
    stage_1()
    shifted = stage_2()
    stage_3(shifted)
    print("\nDemo complete. Check /api/history for the full timeline.")
