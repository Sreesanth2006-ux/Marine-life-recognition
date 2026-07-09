import { motion } from 'framer-motion'
import { Brain, Cpu, Database, Globe, Zap, Code2, Fish, CheckCircle } from 'lucide-react'

const TECH_CARDS = [
  {
    icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10',
    title: 'Convolutional Neural Network (CNN)',
    desc: `CNNs are a class of deep learning models inspired by the animal visual cortex.
They use learnable filters (kernels) that slide over input images to detect local patterns
like edges, textures, and shapes. Each convolutional layer extracts progressively more
abstract features — early layers detect edges, deeper layers detect complex objects.
Pooling layers reduce spatial dimensions, decreasing computation while preserving
the most important features.`,
  },
  {
    icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10',
    title: 'Transfer Learning',
    desc: `Transfer learning leverages knowledge from a model pre-trained on a large dataset
(ImageNet — 14 million images, 1000 classes) and adapts it to a new, smaller dataset.
MobileNetV2 was chosen as the base model — it is fast, lightweight, and performs
excellently on mobile and edge devices. The base layers are frozen (weights preserved)
and only the classification head is fine-tuned on the Sea Animals Dataset.
This dramatically reduces training time and data requirements.`,
  },
  {
    icon: Database, color: 'text-green-400', bg: 'bg-green-500/10',
    title: 'Sea Animals Dataset',
    desc: `The Kaggle Sea Animals Image Dataset by Vencer Lanz contains thousands of
high-quality labeled images across 23 marine organism classes. Images are split into
training and validation sets. The ImageDataGenerator applies augmentation (rotation,
flip, zoom, shear) to improve model generalisation. Each class folder contains
hundreds of diverse real-world photographs of marine organisms in their natural habitats.`,
  },
  {
    icon: Cpu, color: 'text-ocean-400', bg: 'bg-ocean-500/10',
    title: 'TensorFlow & Keras',
    desc: `TensorFlow is Google's open-source machine learning framework. Keras is its
high-level API that makes building and training neural networks intuitive.
The model is saved in .keras format after training in Google Colab and loaded
directly into the FastAPI backend via tf.keras.models.load_model().
Images are preprocessed to match the exact training pipeline before inference.`,
  },
  {
    icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10',
    title: 'FastAPI Backend',
    desc: `FastAPI is a modern, high-performance Python web framework for building REST APIs.
It provides automatic OpenAPI documentation, type validation via Pydantic, async support,
and JWT-based authentication via python-jose and passlib. SQLAlchemy manages the SQLite
database. Uploaded images are stored on the server filesystem and served as static files.
CORS is enabled for cross-origin requests from the React frontend.`,
  },
  {
    icon: Code2, color: 'text-pink-400', bg: 'bg-pink-500/10',
    title: 'React Frontend',
    desc: `The frontend is built with React 18 + Vite for fast development. Tailwind CSS
provides utility-first styling with a custom ocean colour palette. Framer Motion
powers smooth page transitions and micro-animations. React Router DOM handles
client-side routing. Axios communicates with the FastAPI backend. Chart.js renders
the admin dashboard charts. ReportLab generates PDF reports on the server side.`,
  },
]

const STEPS = [
  { num: '01', icon: '📤', title: 'Upload Image',            desc: 'User drags & drops or selects a marine organism photo (JPEG/PNG/WebP, max 10 MB).' },
  { num: '02', icon: '🔄', title: 'Preprocess',              desc: 'Image is resized to 224×224 pixels and pixel values are normalised to [0, 1].' },
  { num: '03', icon: '🧠', title: 'CNN Inference',           desc: 'The fine-tuned MobileNetV2 model runs a forward pass and outputs class probabilities.' },
  { num: '04', icon: '✨', title: 'Gemini AI Generation',    desc: 'The predicted species name is sent to Gemini 1.5 Flash, which generates structured educational content.' },
  { num: '05', icon: '📊', title: 'Results Displayed',       desc: 'Top-3 predictions with confidence bars, AI description, habitat, diet, facts, threats, and conservation info are shown.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-900 via-[#011f4b] to-ocean-800">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-ocean-600/20 border border-ocean-500/30 rounded-full px-4 py-1.5 mb-6">
            <Fish className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm font-medium">Project Documentation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            About the <span className="gradient-text">Project</span>
          </h1>
          <p className="text-ocean-300 text-lg max-w-2xl mx-auto">
            A capstone full-stack AI project combining deep learning, transfer learning,
            generative AI, and modern web development to make marine biology accessible to everyone.
          </p>
        </motion.div>
      </section>

      {/* Tech cards */}
      <section className="section pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_CARDS.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card border border-ocean-700/30 hover:border-ocean-500/50 transition-all"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-white font-bold text-base mb-3">{title}</h3>
              <p className="text-ocean-300 text-sm leading-relaxed whitespace-pre-line">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section pt-4">
        <motion.h2
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-3xl font-black text-white text-center mb-12"
        >
          How It <span className="gradient-text">Works</span>
        </motion.h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 glass-card border border-ocean-700/30"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-600 to-ocean-400 rounded-xl flex items-center justify-center">
                <span className="text-xl">{step.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-ocean-400">{step.num}</span>
                  <h3 className="text-white font-semibold">{step.title}</h3>
                </div>
                <p className="text-ocean-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-ocean-500 shrink-0 mt-0.5" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
