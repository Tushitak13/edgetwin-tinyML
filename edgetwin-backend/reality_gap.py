"""
reality_gap.py
Reality Gap Index (RGI) engine for EdgeTwin.

Computes a Mahalanobis-distance based measure of how far a real-world
sensor reading has drifted from the validated (simulated/training) domain,
and expresses that distance as an interpretable Reality Gap Index (RGI):

    RGI = 50   at the 95th-percentile distance seen in the training set
    RGI < 30   -> low gap   (reading looks like training data)
    RGI 30-60  -> medium gap (moderate drift)
    RGI > 60   -> high gap  (reading is well outside the validated envelope)

This gives you a defensible answer to "how exactly are you calculating
that percentage?" instead of an invented dashboard number.
"""

import numpy as np
from typing import List, Dict, Optional


class RealityGapEngine:
    FEATURE_ORDER = ["temperature", "vibration_rms", "rpm", "current"]

    def __init__(self):
        self.mean: Optional[np.ndarray] = None
        self.inv_cov: Optional[np.ndarray] = None
        self.d_ref: Optional[float] = None  # reference distance -> RGI 50
        self.n_samples: int = 0
        self.feature_stats: Dict[str, Dict[str, float]] = {}

    @property
    def is_calibrated(self) -> bool:
        return self.mean is not None and self.inv_cov is not None

    def _vectorize(self, features: Dict[str, float]) -> np.ndarray:
        try:
            return np.array([float(features[f]) for f in self.FEATURE_ORDER], dtype=float)
        except KeyError as e:
            raise ValueError(f"Missing required feature: {e}")

    def calibrate(self, samples: List[Dict[str, float]], percentile: float = 95.0) -> Dict:
        """
        Build the validated operating envelope from a list of feature dicts
        collected from the simulation / training environment.
        """
        if len(samples) < 5:
            raise ValueError("Need at least 5 samples to calibrate a reliable envelope")

        X = np.array([self._vectorize(s) for s in samples])
        mean = X.mean(axis=0)
        cov = np.cov(X, rowvar=False)

        # Regularize to avoid singular-matrix issues on small/degenerate data
        eps = 1e-6
        cov_reg = cov + np.eye(cov.shape[0]) * eps
        inv_cov = np.linalg.pinv(cov_reg)

        # Distances of the training set itself set the reference scale
        diffs = X - mean
        distances = np.sqrt(np.einsum("ij,jk,ik->i", diffs, inv_cov, diffs))
        d_ref = float(np.percentile(distances, percentile))
        d_ref = max(d_ref, 1e-6)

        self.mean = mean
        self.inv_cov = inv_cov
        self.d_ref = d_ref
        self.n_samples = len(samples)

        self.feature_stats = {
            f: {
                "min": float(X[:, i].min()),
                "max": float(X[:, i].max()),
                "mean": float(X[:, i].mean()),
                "std": float(X[:, i].std()),
            }
            for i, f in enumerate(self.FEATURE_ORDER)
        }

        return self.summary()

    def summary(self) -> Dict:
        return {
            "calibrated": self.is_calibrated,
            "n_samples": self.n_samples,
            "reference_distance_p95": self.d_ref,
            "feature_order": self.FEATURE_ORDER,
            "feature_stats": self.feature_stats,
        }

    def score(self, features: Dict[str, float]) -> Dict:
        """
        Compute the Mahalanobis distance and Reality Gap Index for a single
        incoming reading.
        """
        if not self.is_calibrated:
            raise RuntimeError("Envelope not calibrated yet. Call /api/envelope/calibrate first.")

        x = self._vectorize(features)
        diff = x - self.mean
        distance = float(np.sqrt(diff @ self.inv_cov @ diff.T))

        # RGI = 50 at the reference (95th percentile of training distances)
        rgi = (distance / self.d_ref) * 50.0

        per_feature = {}
        for i, f in enumerate(self.FEATURE_ORDER):
            stats = self.feature_stats[f]
            z = (x[i] - stats["mean"]) / stats["std"] if stats["std"] > 1e-9 else 0.0
            per_feature[f] = {
                "value": float(x[i]),
                "validated_range": [stats["min"], stats["max"]],
                "z_score": float(z),
                "outside_validated_range": bool(x[i] < stats["min"] or x[i] > stats["max"]),
            }

        return {
            "mahalanobis_distance": round(distance, 4),
            "reality_gap_index": round(min(rgi, 999.0), 2),
            "per_feature": per_feature,
        }
