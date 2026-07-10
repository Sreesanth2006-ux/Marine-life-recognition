FROM python:3.10-slim

# Install system dependencies (OpenGL libraries required by OpenCV/TensorFlow)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependencies first for caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend codebase
COPY backend/ /app/backend/

# Expose port 7860 (Hugging Face standard port)
EXPOSE 7860

# Set environment paths and start server
ENV PYTHONPATH=/app/backend
ENV PORT=7860
ENV HOST=0.0.0.0

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
