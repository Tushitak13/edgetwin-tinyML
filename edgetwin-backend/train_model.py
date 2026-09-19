"""
train_model.py
Trains a small NORMAL/WARNING/FAULT classifier on the simulated data from
simulate_training_data.py, quantizes it for TensorFlow Lite Micro, and
exports a C header file (model_data.h) that you #include directly in your
ESP32 sketch.

This is the piece that makes run_tinyml_inference() in
esp32_client_example.ino real instead of a hardcoded placeholder.

Run:
    python simulate_training_data.py   # if you haven't already
    python train_model.py

Outputs:
    edgetwin_model.h5              (Keras model, for your own reference)
    edgetwin_model.tflite          (quantized model)
    model_data.h                   (C array — this is what goes on the ESP32)
    feature_normalization.json     (mean/std per feature — you MUST apply
                                     this same normalization on-device
                                     before running inference, or the
                                     model's predictions will be garbage)
"""

import json
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split

from config import (
    FEATURE_ORDER,
    LABELS,
    DATA_CSV,
    MODEL_H5,
    MODEL_TFLITE,
    MODEL_HEADER,
    FEATURE_NORMALIZATION_JSON,
    TEST_SPLIT,
    EPOCHS,
    BATCH_SIZE,
    RANDOM_SEED,
)

np.random.seed(RANDOM_SEED)
tf.random.set_seed(RANDOM_SEED)


def load_and_normalize():
    df = pd.read_csv(DATA_CSV)

    X = df[FEATURE_ORDER].values.astype("float32")
    y = np.array([LABELS.index(lbl) for lbl in df["label"]], dtype="int64")

    mean = X.mean(axis=0)
    std = X.std(axis=0)
    std[std < 1e-6] = 1e-6  # avoid divide-by-zero on a degenerate feature

    X_norm = (X - mean) / std

    norm_params = {
        "feature_order": FEATURE_ORDER,
        "mean": mean.tolist(),
        "std": std.tolist(),
    }
    with open(FEATURE_NORMALIZATION_JSON, "w") as f:
        json.dump(norm_params, f, indent=2)
    print(f"Saved normalization params to {FEATURE_NORMALIZATION_JSON}")
    print("IMPORTANT: apply (value - mean) / std to each feature on the")
    print("ESP32 with these exact numbers before calling the model.")

    return X_norm, y, norm_params


def build_model(n_features: int, n_classes: int) -> tf.keras.Model:
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(n_features,)),
        tf.keras.layers.Dense(16, activation="relu"),
        tf.keras.layers.Dense(8, activation="relu"),
        tf.keras.layers.Dense(n_classes, activation="softmax"),
    ])
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def quantize_and_save(model: tf.keras.Model, X_train: np.ndarray):
    """
    Full integer quantization -> smallest model, fastest on ESP32.
    Needs a representative dataset so the converter can calibrate the
    int8 ranges correctly.
    """
    def representative_dataset():
        for i in range(min(200, len(X_train))):
            sample = X_train[i:i + 1].astype(np.float32)
            yield [sample]

    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.representative_dataset = representative_dataset
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.int8
    converter.inference_output_type = tf.int8

    tflite_model = converter.convert()

    with open(MODEL_TFLITE, "wb") as f:
        f.write(tflite_model)
    print(f"Saved quantized model to {MODEL_TFLITE} ({len(tflite_model)} bytes)")

    return tflite_model


def write_c_header(tflite_bytes: bytes, header_path: str, var_name: str = "edgetwin_model"):
    """
    Pure-Python equivalent of `xxd -i model.tflite > model_data.h`, so you
    don't need xxd installed (it isn't available by default on Windows).
    """
    lines = []
    lines.append(f"// Auto-generated from {MODEL_TFLITE} by train_model.py")
    lines.append("// Include this directly in your ESP32 sketch.")
    lines.append("#pragma once")
    lines.append("#include <cstdint>")
    lines.append("")
    lines.append(f"alignas(8) const unsigned char {var_name}[] = {{")

    hex_bytes = [f"0x{b:02x}" for b in tflite_bytes]
    for i in range(0, len(hex_bytes), 12):
        lines.append("  " + ", ".join(hex_bytes[i:i + 12]) + ",")

    lines.append("};")
    lines.append(f"const unsigned int {var_name}_len = {len(tflite_bytes)};")
    lines.append("")

    with open(header_path, "w") as f:
        f.write("\n".join(lines))

    print(f"Wrote C header to {header_path} ({len(tflite_bytes)} bytes as {var_name})")


def main():
    X, y, norm_params = load_and_normalize()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SPLIT, random_state=RANDOM_SEED, stratify=y
    )

    model = build_model(n_features=len(FEATURE_ORDER), n_classes=len(LABELS))
    model.summary()

    model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        verbose=2,
    )

    loss, acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest accuracy: {acc:.4f}")

    model.save(MODEL_H5)
    print(f"Saved Keras model to {MODEL_H5}")

    tflite_bytes = quantize_and_save(model, X_train)
    write_c_header(tflite_bytes, MODEL_HEADER)

    print("\nDone. Next steps:")
    print(f"  1. Copy {MODEL_HEADER} into your ESP32 sketch's folder.")
    print(f"  2. #include \"{MODEL_HEADER}\" in esp32_client_example.ino")
    print(f"  3. Load {norm_params['feature_order']} mean/std from")
    print(f"     {FEATURE_NORMALIZATION_JSON} into the sketch and apply")
    print("     them to each raw sensor reading before running inference.")
    print("  4. Use TensorFlow Lite Micro's interpreter API on-device to")
    print(f"     run inference against the '{ 'edgetwin_model' }' array and")
    print(f"     map the output index back to {LABELS}.")


if __name__ == "__main__":
    main()