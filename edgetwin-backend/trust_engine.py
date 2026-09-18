"""
trust_engine.py
Maps a Reality Gap Index to an operational trust state:

    TRUST   (RGI < 30)         -> ALLOW   : use the prediction normally
    CAUTION (30 <= RGI < 60)   -> MONITOR : flag it, sample more often
    UNKNOWN (RGI >= 60)        -> ABSTAIN : don't act on the prediction

This is what turns "the model still said NORMAL" into an operational
decision instead of just a number on a dashboard.
"""

from typing import Dict

LOW_THRESHOLD = 30.0
HIGH_THRESHOLD = 60.0


def evaluate_trust(rgi: float, prediction_confidence: float) -> Dict:
    if rgi < LOW_THRESHOLD:
        state = "TRUST"
        action = "ALLOW"
        message = "Operating within validated conditions. Prediction can be used normally."
    elif rgi < HIGH_THRESHOLD:
        state = "CAUTION"
        action = "MONITOR"
        message = "Moderate distribution shift detected. Increase monitoring; flag prediction for review."
    else:
        state = "UNKNOWN"
        action = "ABSTAIN"
        message = "Operating well outside validated conditions. Prediction should not be trusted for autonomous decisions."

    return {
        "trust_state": state,
        "recommended_action": action,
        "message": message,
        "reality_gap_index": rgi,
        "prediction_confidence": prediction_confidence,
        "thresholds": {"low": LOW_THRESHOLD, "high": HIGH_THRESHOLD},
    }
