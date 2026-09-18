"""
database.py
Lightweight SQLite persistence for EdgeTwin: readings history, collected
retraining samples, and a log of envelope (re)calibrations.
"""

import sqlite3
import json
import time
from typing import List, Dict, Optional
from contextlib import contextmanager

DB_PATH = "edgetwin.db"


def init_db(path: str = DB_PATH):
    conn = sqlite3.connect(path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            features TEXT,
            prediction_label TEXT,
            prediction_confidence REAL,
            mahalanobis_distance REAL,
            reality_gap_index REAL,
            trust_state TEXT,
            recommended_action TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS retrain_samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            features TEXT,
            true_label TEXT,
            note TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS envelope_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            n_samples INTEGER,
            summary TEXT
        )
    """)
    conn.commit()
    conn.close()


@contextmanager
def get_conn(path: str = DB_PATH):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def insert_reading(row: Dict, path: str = DB_PATH):
    with get_conn(path) as conn:
        conn.execute(
            """INSERT INTO readings
               (timestamp, features, prediction_label, prediction_confidence,
                mahalanobis_distance, reality_gap_index, trust_state, recommended_action)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                row["timestamp"],
                json.dumps(row["features"]),
                row["prediction_label"],
                row["prediction_confidence"],
                row["mahalanobis_distance"],
                row["reality_gap_index"],
                row["trust_state"],
                row["recommended_action"],
            ),
        )


def get_recent_readings(limit: int = 100, path: str = DB_PATH) -> List[Dict]:
    with get_conn(path) as conn:
        rows = conn.execute(
            "SELECT * FROM readings ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    result = []
    for r in rows:
        d = dict(r)
        d["features"] = json.loads(d["features"])
        result.append(d)
    return list(reversed(result))


def get_latest_reading(path: str = DB_PATH) -> Optional[Dict]:
    with get_conn(path) as conn:
        row = conn.execute("SELECT * FROM readings ORDER BY id DESC LIMIT 1").fetchone()
    if not row:
        return None
    d = dict(row)
    d["features"] = json.loads(d["features"])
    return d


def insert_retrain_sample(features: Dict, true_label: str, note: str = "", path: str = DB_PATH):
    with get_conn(path) as conn:
        conn.execute(
            "INSERT INTO retrain_samples (timestamp, features, true_label, note) VALUES (?, ?, ?, ?)",
            (time.time(), json.dumps(features), true_label, note),
        )


def get_retrain_samples(path: str = DB_PATH) -> List[Dict]:
    with get_conn(path) as conn:
        rows = conn.execute("SELECT * FROM retrain_samples ORDER BY id ASC").fetchall()
    result = []
    for r in rows:
        d = dict(r)
        d["features"] = json.loads(d["features"])
        result.append(d)
    return result


def clear_retrain_samples(path: str = DB_PATH):
    with get_conn(path) as conn:
        conn.execute("DELETE FROM retrain_samples")


def log_envelope(n_samples: int, summary: Dict, path: str = DB_PATH):
    with get_conn(path) as conn:
        conn.execute(
            "INSERT INTO envelope_history (timestamp, n_samples, summary) VALUES (?, ?, ?)",
            (time.time(), n_samples, json.dumps(summary)),
        )
