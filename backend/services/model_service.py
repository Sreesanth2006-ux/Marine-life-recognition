"""
Model Service
=============
Loads the Keras model on startup and provides the predict() function.

Preprocessing matches standard ImageDataGenerator(rescale=1./255) training.
If your Colab notebook used a model-specific preprocess_input (e.g. MobileNetV2),
set PREPROCESS_MODE=mobilenet in .env and uncomment the relevant block below.
"""

from __future__ import annotations

import io
import json
import os
import random
from typing import Dict, Any

import numpy as np
from PIL import Image

from config import settings

# Module-level state
model = None
class_indices: Dict[int, str] = {}


# ── Startup ─────────────────────────────────────────────────────────────────

def load_model() -> None:
    """Called once at application startup."""
    global model, class_indices

    # ── Load Keras model ────────────────────────────────────────────────────
    if os.path.exists(settings.MODEL_PATH):
        try:
            import tensorflow as tf

            # Dynamic patch for Keras 3 deserialization error (e.g. quantization_config in Dense layers)
            try:
                import keras
                original_from_config_fn = keras.src.ops.operation.Operation.from_config.__func__
                
                @classmethod
                def patched_from_config(cls, config):
                    if isinstance(config, dict):
                        config.pop("quantization_config", None)
                    return original_from_config_fn(cls, config)
                
                keras.src.ops.operation.Operation.from_config = patched_from_config
            except Exception as patch_exc:
                print(f"[WARNING] Keras patch failed: {patch_exc}")

            model = tf.keras.models.load_model(settings.MODEL_PATH)
            print(f"[OK] Model loaded - {settings.MODEL_PATH}")
        except Exception as exc:
            import traceback
            traceback.print_exc()
            print(f"[ERROR] Model load failed: {exc}")
            model = None
    else:
        print(
            f"[WARNING] Model not found at '{settings.MODEL_PATH}'. "
            "API will return mock predictions until the model file is placed in backend/ml/."
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

    Switch PREPROCESS_MODE in .env:
      "divide"   → pixels / 255.0         (default, most custom notebooks)
      "mobilenet"→ mobilenet_v2 preprocess_input  (scales to [-1, 1])
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((settings.IMAGE_SIZE, settings.IMAGE_SIZE))
    arr = np.array(img, dtype=np.float32)

    if settings.PREPROCESS_MODE == "mobilenet":
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
        arr = preprocess_input(arr)
    elif settings.PREPROCESS_MODE == "efficientnet":
        from tensorflow.keras.applications.efficientnet_v2 import preprocess_input
        arr = preprocess_input(arr)
    else:
        arr = arr / 255.0

    return np.expand_dims(arr, axis=0)


# ── Inference ────────────────────────────────────────────────────────────────

def predict(image_bytes: bytes) -> Dict[str, Any]:
    """
    Run inference and return the top-3 predictions.

    Returns
    -------
    {
        "predicted_class": str,
        "confidence": float,
        "top3_predictions": [{"class_name": str, "confidence": float}, ...]
    }
    """
    classes = list(class_indices.values())

    # ── Mock mode (model not loaded) ─────────────────────────────────────────
    if model is None:
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

    # ── Real inference ────────────────────────────────────────────────────────
    arr = preprocess_image(image_bytes)
    preds = model.predict(arr, verbose=0)[0]

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
