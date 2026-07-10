"""
Model Service (ONNX Runtime)
=============================
Loads the lightweight ONNX model on startup and provides the predict() function.
This implementation uses onnxruntime, which consumes ~90% less RAM than TensorFlow.
"""

from __future__ import annotations

import io
import json
import os
import random
from typing import Dict, Any

import numpy as np
import onnxruntime as ort
from PIL import Image

from config import settings

# Module-level state
session = None
class_indices: Dict[int, str] = {}


# ── Startup ─────────────────────────────────────────────────────────────────

def load_model() -> None:
    """Called once at application startup."""
    global session, class_indices

    # ── Load ONNX Model ─────────────────────────────────────────────────────
    if os.path.exists(settings.MODEL_PATH):
        try:
            # Initialize ONNX inference session
            session = ort.InferenceSession(settings.MODEL_PATH)
            print(f"[OK] ONNX Model loaded - {settings.MODEL_PATH}")
        except Exception as exc:
            import traceback
            traceback.print_exc()
            print(f"[ERROR] ONNX Model load failed: {exc}")
            session = None
    else:
        print(
            f"[WARNING] ONNX Model not found at '{settings.MODEL_PATH}'. "
            "API will return mock predictions until the model file is placed."
        )

    # ── Load class index map ─────────────────────────────────────────────────
    if os.path.exists(settings.CLASS_INDICES_PATH):
        try:
            with open(settings.CLASS_INDICES_PATH, "r") as fh:
                raw = json.load(fh)
            # Support both {idx: name} and {name: idx} exports
            if raw and isinstance(next(iter(raw.keys())), str):
                try:
                    # Already {int-str: name}
                    class_indices = {int(k): v for k, v in raw.items()}
                except ValueError:
                    # name → idx  (invert)
                    class_indices = {v: k for k, v in raw.items()}
            print(f"[OK] Class indices loaded - {len(class_indices)} classes")
        except Exception as exc:
            print(f"[ERROR] class_indices.json load failed: {exc}")
            _use_defaults()
    else:
        print("[WARNING] class_indices.json not found – using built-in defaults.")
        _use_defaults()


def _use_defaults() -> None:
    global class_indices
    class_indices = {i: cls for i, cls in enumerate(settings.DEFAULT_CLASSES)}


# ── Preprocessing ────────────────────────────────────────────────────────────

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Resize → RGB → numpy array → normalise → add batch dim.
    
    normalization methods are implemented in standard numpy to avoid loading tf/keras.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((settings.IMAGE_SIZE, settings.IMAGE_SIZE))
    arr = np.array(img, dtype=np.float32)

    if settings.PREPROCESS_MODE == "mobilenet":
        # mobilenet scales to [-1, 1]
        arr = (arr / 127.5) - 1.0
    elif settings.PREPROCESS_MODE == "efficientnet":
        # efficientnet uses standard [0, 255] float arrays since scaling layers are internal
        pass
    else:
        arr = arr / 255.0

    return np.expand_dims(arr, axis=0)


# ── Inference ────────────────────────────────────────────────────────────────

def predict(image_bytes: bytes) -> Dict[str, Any]:
    """
    Run inference using ONNX Runtime and return the top-3 predictions.
    """
    classes = list(class_indices.values())

    # ── Mock mode (model not loaded) ─────────────────────────────────────────
    if session is None:
        chosen = random.randint(0, len(classes) - 1)
        conf = round(random.uniform(0.70, 0.99), 4)
        others = random.sample(
            [i for i in range(len(classes)) if i != chosen],
            min(2, len(classes) - 1),
        )
        remainder = 1.0 - conf
        c2 = round(remainder * random.uniform(0.5, 0.8), 4)
        c3 = round(remainder - c2, 4)
        top3 = [
            {"class_name": classes[chosen], "confidence": conf},
            {"class_name": classes[others[0]], "confidence": c2},
            {"class_name": classes[others[1] if len(others) > 1 else 0], "confidence": c3},
        ]
        return {"predicted_class": classes[chosen], "confidence": conf, "top3_predictions": top3}

    # ── Real ONNX inference ───────────────────────────────────────────────────
    arr = preprocess_image(image_bytes)
    
    # Retrieve ONNX input and output node names
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    
    # Run the model
    preds = session.run([output_name], {input_name: arr})[0][0]

    top3_indices = np.argsort(preds)[::-1][:3]
    top3 = [
        {
            "class_name": class_indices.get(int(i), f"Class_{i}"),
            "confidence": round(float(preds[i]), 4),
        }
        for i in top3_indices
    ]

    return {
        "predicted_class": top3[0]["class_name"],
        "confidence": top3[0]["confidence"],
        "top3_predictions": top3,
    }
