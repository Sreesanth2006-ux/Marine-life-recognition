import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Zap, Eye, Database, Shield, BarChart3, ChevronRight, Cpu, Fish } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain, color: 'text-sky-400 border-sky-400/20 bg-sky-400/5',
    title: 'Deep Learning CNN',
    desc: 'Fine-tuned MobileNetV2 architecture pre-trained on ImageNet, then trained on 23 marine species for highly accurate image classification.',
    span: 'md:col-span-4',
  },
  {
    icon: Zap, color: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    title: 'Real-Time Inference',
    desc: 'Get instant predictions in under 2 seconds, displaying top-3 predictions with exact confidence levels.',
    span: 'md:col-span-2',
  },
  {
    icon: Eye, color: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    title: 'Gemini AI Insights',
    desc: 'Generates comprehensive educational content — habitat, diet, lifespan, conservation status, threats and facts — dynamically.',
    span: 'md:col-span-2',
  },
  {
    icon: Database, color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    title: 'History & Narration',
    desc: 'Automatically archives predicted species in your private profile. Includes voice narration via standard Web Speech synthesis.',
    span: 'md:col-span-4',
  },
  {
    icon: Shield, color: 'text-rose-400 border-rose-400/20 bg-rose-400/5',
    title: 'Secure Authentication',
    desc: 'JWT credentials store your session securely. The first user dynamically registers as the site administrator.',
    span: 'md:col-span-3',
  },
  {
    icon: BarChart3, color: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5',
    title: 'Admin Analytics',
    desc: 'Central dashboard to track daily traffic, model classification statistics, and manage registered database users.',
    span: 'md:col-span-3',
  },
]

const SPECIES = [
  'Clams','Corals','Crabs','Dolphin','Eel','Fish','Jelly Fish','Lobster',
  'Nudibranchs','Octopus','Otter','Penguin','Pufferfish','Sea Rays',
  'Sea Urchins','Seahorse','Seal','Sharks','Shrimp','Squid','Starfish',
  'Turtle_Tortoise','Whale',
]

const CNN_LAYERS = [
  { label: 'Input\n224×224', desc: 'RGB Image' },
  { label: 'Conv2D\nReLU',   desc: 'Feature Maps' },
  { label: 'MaxPool',         desc: 'Downsampling' },
  { label: 'Conv2D\nReLU',   desc: 'Deep Features' },
  { label: 'MaxPool',         desc: 'Downsampling' },
  { label: 'GlobalAvg\nPool', desc: 'Feature Vector' },
  { label: 'Dense\nDropout', desc: 'Fully Connected' },
  { label: 'Softmax\nOutput', desc: '23 Classes' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080B10] layout-grid pt-24 pb-16 px-6 sm:px-8">
      {/* Hero */}
      <section className="max-w-4xl mx-auto py-16 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-3 py-1 mb-6">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Product Overview</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Intelligent Marine
            <br />
            <span className="gradient-text">Recognition Engine</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Combining a custom fine-tuned convolutional neural network classification system with Google Generative AI to deliver robust species identification and detailed educational insights.
          </p>
          <div className="flex justify-center">
            <Link to="/predict" className="btn-ocean text-xs font-semibold tracking-wide px-6 py-3">
              Try Classifier <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="max-w-6xl mx-auto py-12 border-t border-white/[0.06]">
        <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">Key Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {FEATURES.map(({ icon: Icon, color, title, desc, span }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`${span} glass-card border border-white/[0.06] hover:border-white/[0.12] flex flex-col justify-between p-6 h-full`}
            >
              <div>
                <div className={`w-8 h-8 rounded-lg ${color} border flex items-center justify-center mb-4`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dataset & Supported Species */}
      <section className="max-w-6xl mx-auto py-12 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sea Animals Dataset</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Trained on the{' '}
              <a href="https://www.kaggle.com/datasets/vencerlanz09/sea-animals-image-dataset"
                target="_blank" rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline font-medium">
                Kaggle Sea Animals Image Dataset
              </a>
              {' '}compiled by Vencer Lanz. Spans 23 categories representing common, critical, and endangered marine organisms.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="glass-card border border-white/[0.06] p-6">
              <div className="text-xs font-semibold text-white tracking-wider uppercase mb-4 text-gray-500">23 Supported Target Species</div>
              <div className="flex flex-wrap gap-2">
                {SPECIES.map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CNN Architecture blueprint diagram */}
      <section className="max-w-6xl mx-auto py-12 border-t border-white/[0.06]">
        <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">Classification Pipeline</h2>
        <div className="glass-card border border-white/[0.06] p-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[900px] py-4">
            {CNN_LAYERS.map((layer, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex-1 border border-white/[0.08] bg-white/[0.01] rounded-lg p-3 text-center mx-2 hover:border-white/[0.15] transition-colors">
                  <div className="text-[10px] text-gray-500 font-mono">0{i + 1}</div>
                  <div className="text-xs font-semibold text-white mt-1 whitespace-pre-line leading-snug">{layer.label}</div>
                  <div className="text-[10px] text-sky-400/80 font-medium mt-1.5">{layer.desc}</div>
                </div>
                {i < CNN_LAYERS.length - 1 && (
                  <div className="text-gray-600 font-light text-sm">➔</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Model info stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { label: 'CNN Backbone Architecture',   value: 'MobileNetV2 (Fine-tuned)', icon: Cpu },
            { label: 'Input Resolution Specs',   value: '224 × 224 Pixels (RGB)', icon: Eye },
            { label: 'Inference Output Classes',      value: '23 Classification Target Species',   icon: Fish },
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card border border-white/[0.06] flex items-center gap-4 p-5"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold">{label}</p>
                <p className="text-xs font-bold text-white mt-0.5">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-2xl mx-auto py-16 text-center border-t border-white/[0.06]">
        <div className="glass-card border border-white/[0.06] p-8">
          <Fish className="w-8 h-8 text-sky-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Identify a Marine Organism</h2>
          <p className="text-gray-400 text-xs mb-6 max-w-sm mx-auto">Upload an image from your device and let our local neural network predict the species in real time.</p>
          <div className="flex justify-center">
            <Link to="/predict" className="btn-ocean text-xs font-semibold tracking-wide px-5 py-2.5">
              Start Classifier
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
