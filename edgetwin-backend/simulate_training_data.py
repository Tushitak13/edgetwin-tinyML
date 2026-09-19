"""
simulate_training_data.py
Generates a labeled dataset (NORMAL / WARNING / FAULT) from the ranges
defined in config.py, with sensor noise added, and writes it to CSV.

This is what your TinyML classifier trains on (train_model.py), AND it's
the same kind of simulated data you'd feed into
POST /api/envelope/calibrate on the backend (just filter it to only the
NORMAL rows for that — the envelope should only be built from validated
"good" conditions, not the fault cases).

Run:
    python simulate_training_data.py

Output:
    simulated_training_data.csv  (columns: temperature, vibration_rms,
    rpm, current, label)
"""

import numpy as np
import pandas as pd

from config import (
    FEATURE_ORDER,
    LABELS,
    CLASS_RANGES,
    SENSOR_NOISE_STD,
    SAMPLES_PER_CLASS,
    DATA_CSV,
    RANDOM_SEED,
)


def generate_class_samples(label: str, n: int, rng: np.random.Generator) -> pd.DataFrame:
    ranges = CLASS_RANGES[label]
    data = {}
    for feature in FEATURE_ORDER:
        low, high = ranges[feature]
        base = rng.uniform(low, high, size=n)
        noise = rng.normal(0.0, SENSOR_NOISE_STD[feature], size=n)
        data[feature] = base + noise
    df = pd.DataFrame(data)
    df["label"] = label
    return df


def main():
    rng = np.random.default_rng(RANDOM_SEED)

    frames = [generate_class_samples(label, SAMPLES_PER_CLASS, rng) for label in LABELS]
    full = pd.concat(frames, ignore_index=True)

    # Shuffle so classes aren't in contiguous blocks
    full = full.sample(frac=1.0, random_state=RANDOM_SEED).reset_index(drop=True)

    # Clip physically impossible negatives (noise can push vibration/current
    # slightly below zero near the low end of NORMAL)
    for f in ["vibration_rms", "current", "rpm", "temperature"]:
        full[f] = full[f].clip(lower=0.0)

    full.to_csv(DATA_CSV, index=False)

    print(f"Wrote {len(full)} rows to {DATA_CSV}")
    print(full["label"].value_counts())
    print("\nSample rows:")
    print(full.head(10))


if __name__ == "__main__":
    main()