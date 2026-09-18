"""
schemas.py
Pydantic request/response models for the EdgeTwin API.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class SensorFeatures(BaseModel):
    temperature: float = Field(..., description="Degrees Celsius")
    vibration_rms: float = Field(..., description="Vibration RMS, g")
    rpm: float = Field(..., description="Motor speed, RPM")
    current: float = Field(..., description="Motor current, Amps")


class Prediction(BaseModel):
    label: str = Field(..., description='e.g. "NORMAL" or "FAULT"')
    confidence: float = Field(..., ge=0.0, le=1.0)


class IngestRequest(BaseModel):
    features: SensorFeatures
    prediction: Prediction
    device_id: Optional[str] = "esp32-01"


class CalibrateRequest(BaseModel):
    samples: List[SensorFeatures]
    percentile: Optional[float] = 95.0


class RetrainSampleRequest(BaseModel):
    features: SensorFeatures
    true_label: str
    note: Optional[str] = ""
