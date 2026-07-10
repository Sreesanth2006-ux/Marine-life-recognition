import os
import sys

# Change working directory to backend folder if run from elsewhere
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(backend_dir)

# Add backend directory to sys.path so we can import local modules
sys.path.append(backend_dir)

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import keras
import tensorflow as tf
import tf2onnx

# Apply our quantization_config patch to prevent Keras 3 deserialization errors
from keras.src.ops.operation import Operation
original_from_config = Operation.from_config.__func__
def patched_from_config(cls, config):
    config.pop("quantization_config", None)
    return original_from_config(cls, config)
Operation.from_config = classmethod(patched_from_config)

print("Loading Keras model...")
model = keras.models.load_model("ml/marine_model.keras")
print("Model loaded successfully!")

# Define input signature matching MobileNetV2 input shape (224x224x3)
input_signature = [tf.TensorSpec(model.inputs[0].shape, model.inputs[0].dtype, name='input')]

print("Converting Keras to ONNX...")
onnx_model, _ = tf2onnx.convert.from_keras(model, input_signature, opset=13)

onnx_path = "ml/marine_model.onnx"
with open(onnx_path, "wb") as f:
    f.write(onnx_model.SerializeToString())

print(f"ONNX model saved successfully to: {onnx_path}")
