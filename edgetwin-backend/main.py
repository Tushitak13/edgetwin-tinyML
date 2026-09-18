"""
main.py
EdgeTwin backend — a trust layer for TinyML deployed under real-world
distribution shift (the "Reality Gap" concept from your pitch).

Flow:
  1. POST /api/envelope/calibrate  with your simulated/training data
     -> builds the validated operating envelope.
  2. Your ESP32 (or the included simulator) POSTs each reading + its
     TinyML prediction to POST /api/ingest
     -> you get back the Reality Gap Index and a TRUST/CAUTION/UNKNOWN
        decision.
  3. When you see CAUTION/UNKNOWN, POST /api/retrain/collect with the
     confirmed true label for that condition.
  4. POST /api/retrain/apply to recalibrate the envelope ("adaptation").
     Re-send the same shifted readings — the Reality Gap Index should
     now be much lower. That's your full 3-stage demo.

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Interactive API docs: http://localhost:8000/docs
"""

import time
import os
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import IngestRequest, CalibrateRequest, RetrainSampleRequest
from reality_gap import RealityGapEngine
from trust_engine import evaluate_trust
import database as db

app = FastAPI(
    title="EdgeTwin Backend",
    description="Trust layer for TinyML deployed under real-world distribution shift.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RealityGapEngine()
db.init_db()


@app.get("/")
def root():
    return {
        "service": "EdgeTwin Backend",
        "status": "running",
        "calibrated": engine.is_calibrated,
        "docs": "/docs",
    }


@app.post("/api/envelope/calibrate")
def calibrate_envelope(req: CalibrateRequest):
    """
    Build the validated operating envelope from simulation/training data.
    Call this once at startup with your simulated normal-operation dataset.
    """
    try:
        samples = [s.dict() for s in req.samples]
        summary = engine.calibrate(samples, percentile=req.percentile or 95.0)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    db.log_envelope(len(samples), summary)
    return summary


@app.get("/api/envelope")
def get_envelope():
    if not engine.is_calibrated:
        raise HTTPException(status_code=404, detail="Envelope not calibrated yet")
    return engine.summary()


@app.post("/api/ingest")
def ingest_reading(req: IngestRequest):
    """
    Main endpoint. The ESP32 (or a simulator) POSTs a sensor reading + the
    on-device TinyML prediction here. Returns the Reality Gap Index and the
    resulting trust decision.
    """
    if not engine.is_calibrated:
        raise HTTPException(
            status_code=409,
            detail="Envelope not calibrated. POST /api/envelope/calibrate first.",
        )

    features = req.features.dict()
    try:
        gap_result = engine.score(features)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    trust_result = evaluate_trust(
        rgi=gap_result["reality_gap_index"],
        prediction_confidence=req.prediction.confidence,
    )

    row = {
        "timestamp": time.time(),
        "features": features,
        "prediction_label": req.prediction.label,
        "prediction_confidence": req.prediction.confidence,
        "mahalanobis_distance": gap_result["mahalanobis_distance"],
        "reality_gap_index": gap_result["reality_gap_index"],
        "trust_state": trust_result["trust_state"],
        "recommended_action": trust_result["recommended_action"],
    }
    db.insert_reading(row)

    return {
        "device_id": req.device_id,
        "timestamp": row["timestamp"],
        "prediction": req.prediction.dict(),
        "reality_gap": gap_result,
        "trust": trust_result,
    }


@app.get("/api/status")
def get_status():
    """Latest reading + current trust state — poll this for the dashboard."""
    latest = db.get_latest_reading()
    if not latest:
        return {"status": "no_data", "calibrated": engine.is_calibrated}
    return {"status": "ok", "calibrated": engine.is_calibrated, "latest": latest}


@app.get("/api/history")
def get_history(limit: int = 100):
    return {"count": limit, "readings": db.get_recent_readings(limit=limit)}


@app.post("/api/retrain/collect")
def collect_retrain_sample(req: RetrainSampleRequest):
    """
    Tag a real-world sample (with its true/expert-confirmed label) for the
    next adaptation round. Call this when trust_state is CAUTION or UNKNOWN
    and you want to teach the model this new condition.
    """
    db.insert_retrain_sample(req.features.dict(), req.true_label, req.note or "")
    return {"status": "collected", "total_pending": len(db.get_retrain_samples())}


@app.get("/api/retrain/samples")
def list_retrain_samples():
    samples = db.get_retrain_samples()
    return {"count": len(samples), "samples": samples}


@app.post("/api/retrain/apply")
def apply_retrain():
    """
    Recalibrate the validated envelope using the collected real-world
    samples. This simulates the "adaptation" step of the EdgeTwin loop:
    after this call, readings from the previously out-of-distribution
    condition should show a LOWER Reality Gap Index.

    NOTE: for a real deployment, plug your actual TinyML retraining +
    quantization pipeline in here too. This endpoint only recalibrates the
    statistical envelope that drives the Reality Gap Index.
    """
    if not engine.is_calibrated:
        raise HTTPException(status_code=409, detail="Envelope not calibrated yet")

    new_samples = db.get_retrain_samples()
    if len(new_samples) < 3:
        raise HTTPException(
            status_code=400,
            detail="Need at least 3 collected retrain samples to adapt the envelope",
        )

    # Synthesize pseudo-samples around the existing envelope stats so the
    # recalibrated envelope still covers the original validated domain,
    # then combine with the newly collected real-world samples.
    rng = np.random.default_rng(42)
    synth = []
    for _ in range(50):
        sample = {}
        for f in engine.FEATURE_ORDER:
            stats = engine.feature_stats[f]
            sample[f] = float(rng.normal(stats["mean"], max(stats["std"], 1e-6)))
        synth.append(sample)

    combined = synth + [s["features"] for s in new_samples]
    summary = engine.calibrate(combined, percentile=95.0)
    db.log_envelope(len(combined), summary)
    db.clear_retrain_samples()

    return {
        "status": "adapted",
        "new_envelope": summary,
        "samples_used": len(combined),
    }


@app.delete("/api/history")
def clear_history():
    """Wipe stored readings (keeps the calibrated envelope in memory)."""
    if os.path.exists(db.DB_PATH):
        os.remove(db.DB_PATH)
    db.init_db()
    return {"status": "cleared"}
