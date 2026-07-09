# 🌊 Marine Life Recognition & Intelligent Marine Assistant

A full-stack AI web application that classifies marine organisms from uploaded images using a fine-tuned CNN deep learning model and generates AI-powered educational explanations via Gemini.

---

## 📁 Project Structure

```
Capstone Project/
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # App entry point
│   ├── auth.py                 # JWT authentication
│   ├── config.py               # Settings (env vars)
│   ├── database.py             # SQLAlchemy + SQLite
│   ├── models/
│   │   ├── db_models.py        # ORM models (User, Prediction)
│   │   └── schemas.py          # Pydantic schemas
│   ├── routers/
│   │   ├── predict.py          # POST /predict, PDF/CSV download
│   │   ├── history.py          # GET/DELETE /history
│   │   ├── chat.py             # POST /chat
│   │   └── admin.py            # GET /admin/stats
│   ├── services/
│   │   ├── model_service.py    # TF model inference
│   │   ├── ai_service.py       # Gemini API
│   │   └── report_service.py   # PDF + CSV generation
│   ├── ml/
│   │   ├── marine_model.keras  # ← Place your trained model here
│   │   └── class_indices.json  # ← Place your class mapping here
│   ├── uploads/                # Auto-created for uploaded images
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                   # React + Vite frontend
    ├── src/
    │   ├── pages/              # Landing, Home, Predict, Results, History, About, Contact, Login, Signup, AdminDashboard
    │   ├── components/         # Navbar, Footer, ProtectedRoute
    │   ├── context/            # AuthContext, ThemeContext
    │   └── services/api.js     # Axios API client
    ├── package.json
    ├── tailwind.config.js
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9–3.11
- Node.js 18+
- Your trained `marine_model.keras` + `class_indices.json` from Google Colab

---

### Backend Setup

```powershell
# 1. Navigate to backend
cd "Capstone Project\backend"

# 2. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
copy .env.example .env
# Edit .env — add your GEMINI_API_KEY and SECRET_KEY

# 5. Place model files
# Copy marine_model.keras → backend/ml/marine_model.keras
# Copy class_indices.json → backend/ml/class_indices.json

# 6. Run the server
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### Frontend Setup

```powershell
# 1. Navigate to frontend
cd "Capstone Project\frontend"

# 2. Install dependencies
npm install

# 3. Configure environment
copy .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:8000

# 4. Start dev server
npm run dev
```

Frontend available at: http://localhost:5173

---

## 🤖 Exporting Your Model from Google Colab

After training, run this in Colab:

```python
import json

# Save model
model.save('marine_model.keras')

# Save class indices (index → class name)
idx_to_class = {v: k for k, v in train_generator.class_indices.items()}
with open('class_indices.json', 'w') as f:
    json.dump(idx_to_class, f)

# Download from Colab
from google.colab import files
files.download('marine_model.keras')
files.download('class_indices.json')
```

Then place both files in `backend/ml/`.

---

## 🔧 Preprocessing Notes

The backend's preprocessing must match your training pipeline.

### Default (most common — ImageDataGenerator with rescale=1./255):
```python
# backend/services/model_service.py — already configured
arr = arr / 255.0  # Normalise to [0, 1]
```

### If you used MobileNetV2's preprocess_input:
Set `PREPROCESS_MODE=mobilenet` in your `.env` file.

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | `dev-secret-key-...` |
| `GEMINI_API_KEY` | Google Gemini API key | *(empty)* |
| `MODEL_PATH` | Path to .keras model | `ml/marine_model.keras` |
| `CLASS_INDICES_PATH` | Path to class map JSON | `ml/class_indices.json` |
| `IMAGE_SIZE` | Input image size | `224` |
| `PREPROCESS_MODE` | `divide` or `mobilenet` | `divide` |
| `DATABASE_URL` | SQLAlchemy URL | `sqlite:///./marine.db` |

### Frontend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:8000` |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login & get JWT |
| GET | `/auth/me` | JWT | Get current user |
| POST | `/predict` | JWT | Upload image → predict |
| GET | `/report/pdf/{id}` | JWT | Download PDF report |
| GET | `/report/csv` | JWT | Download CSV history |
| GET | `/history` | JWT | List predictions |
| GET | `/history/{id}` | JWT | Get single prediction |
| DELETE | `/history/{id}` | JWT | Delete prediction |
| DELETE | `/history` | JWT | Clear all history |
| POST | `/chat` | JWT | AI chat Q&A |
| GET | `/admin/stats` | Admin | Dashboard statistics |
| GET | `/health` | No | Health check |

---

## 🎨 Features

- ✅ **CNN Classification** — Fine-tuned MobileNetV2, top-3 predictions with confidence
- ✅ **Gemini AI** — Educational descriptions, habitat, diet, lifespan, conservation status
- ✅ **JWT Auth** — Signup/Login, first user = Admin
- ✅ **History** — SQLite database, view/delete predictions
- ✅ **PDF Reports** — ReportLab PDF with full species info
- ✅ **CSV Export** — All predictions as CSV
- ✅ **Voice Narration** — Web Speech API TTS
- ✅ **AI Chat** — Ask questions about the identified species
- ✅ **Admin Dashboard** — Charts (Bar, Line), users table, prediction stats
- ✅ **Dark Mode** — CSS class + localStorage persistence
- ✅ **Responsive** — Mobile-first Tailwind CSS
- ✅ **Animations** — Framer Motion throughout

---

## 🚢 Deployment

### Backend → Render

1. Push `backend/` to GitHub
2. Create a new **Web Service** on Render
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables in Render dashboard
6. Upload `marine_model.keras` via Render disk or use environment-based model loading

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import repo in Vercel, framework = **Vite**
3. Build: `npm run build`, Output: `dist`
4. Add `VITE_API_URL=https://your-render-app.onrender.com`

---

## 🧪 Testing the API (without model)

The backend runs in **mock mode** if `marine_model.keras` is absent.
Mock mode returns random predictions so you can test the full UI immediately.

```bash
# Check health
curl http://localhost:8000/health

# Expected: {"status":"healthy","model_loaded":false,"classes":23}
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.10 |
| ML | TensorFlow 2.16, Keras, MobileNetV2 |
| Database | SQLite (SQLAlchemy ORM) |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT (python-jose + passlib) |
| PDF | ReportLab |
| Charts | Chart.js + react-chartjs-2 |
| Deploy | Vercel (frontend) + Render (backend) |
