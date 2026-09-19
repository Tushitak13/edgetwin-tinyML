"""
config.py
Single source of truth for EdgeTwin's feature order, the simulated
operating ranges for each machine state, and file paths used by the
training pipeline. Import this everywhere instead of hardcoding numbers,
so your simulation, training script, and backend envelope calibration
never drift apart.
"""

# Must match reality_gap.py's RealityGapEngine.FEATURE_ORDER exactly.
FEATURE_ORDER = ["temperature", "vibration_rms", "rpm", "current"]

LABELS = ["NORMAL", "WARNING", "FAULT"]

# Simulated operating ranges per class. Tune these against your real
# motor once you have hardware readings — these starting numbers just
# need to be far enough apart for a small classifier to separate them.
CLASS_RANGES = {
    "NORMAL": {
        "temperature": (22.0, 32.0),
        "vibration_rms": (0.15, 0.45),
        "rpm": (900.0, 1200.0),
        "current": (0.50, 0.90),
    },
    "WARNING": {
        "temperature": (30.0, 38.0),
        "vibration_rms": (0.40, 0.70),
        "rpm": (1150.0, 1400.0),
        "current": (0.85, 1.15),
    },
    "FAULT": {
        "temperature": (37.0, 50.0),
        "vibration_rms": (0.65, 1.10),
        "rpm": (1350.0, 1700.0),
        "current": (1.10, 1.60),
    },
}

SENSOR_NOISE_STD = {
    "temperature": 0.4,
    "vibration_rms": 0.02,
    "rpm": 15.0,
    "current": 0.03,
}

DATA_CSV = "simulated_training_data.csv"
MODEL_H5 = "edgetwin_model.h5"
MODEL_TFLITE = "edgetwin_model.tflite"
MODEL_HEADER = "model_data.h"
FEATURE_NORMALIZATION_JSON = "feature_normalization.json"

SAMPLES_PER_CLASS = 1500
TEST_SPLIT = 0.2
EPOCHS = 40
BATCH_SIZE = 16
RANDOM_SEED = 42