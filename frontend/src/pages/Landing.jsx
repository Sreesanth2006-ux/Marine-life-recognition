import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Fish, ChevronDown, Star, Brain, Shield } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080B10] layout-grid pt-24 pb-16 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">
        {/* Left Column (Hero Content) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-3.5 py-1.5"
          >
            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full dot-pulse" />
            <span className="text-gray-400 text-[10px] font-semibold tracking-wider uppercase">
              CNN Deep Learning + Gemini 2.5 Flash
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
          >
            Intelligent
            <br />
            <span className="gradient-text">Marine Life</span>
            <br />
            Recognition.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed font-normal"
          >
            Upload photos of marine life for instant identification. Our fine-tuned CNN classifies classes locally, while Gemini AI generates detailed educational data regarding habitat, threats, and diet.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3.5"
          >
            <Link
              to="/predict"
              className="btn-ocean text-xs px-5 py-3 font-semibold tracking-wide"
            >
              <Fish className="w-4 h-4" />
              Start Recognition
            </Link>
            <Link
              to="/home"
              className="btn-ghost text-xs px-5 py-3 font-semibold tracking-wide"
            >
              Explore Features
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column (Bento Grid Stats) */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          <div className="absolute inset-0 bg-sky-500/5 blur-3xl rounded-full" />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative grid grid-cols-2 gap-4"
          >
            {/* Stat Card 1 */}
            <div className="glass-card flex flex-col justify-between h-36 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="w-7 h-7 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Fish className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">23+</div>
                <div className="text-[10px] text-gray-500 mt-0.5 tracking-wider uppercase font-semibold">Marine Species</div>
              </div>
            </div>

            {/* Stat Card 2 (Staggered Height) */}
            <div className="glass-card flex flex-col justify-between h-44 border border-white/[0.06] hover:border-white/[0.12] transition-colors mt-6">
              <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">95%+</div>
                <div className="text-[10px] text-gray-500 mt-0.5 tracking-wider uppercase font-semibold">Model Accuracy</div>
              </div>
            </div>

            {/* Stat Card 3 (Staggered Height offset) */}
            <div className="glass-card flex flex-col justify-between h-44 border border-white/[0.06] hover:border-white/[0.12] transition-colors -mt-6">
              <div className="w-7 h-7 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">AI</div>
                <div className="text-[10px] text-gray-500 mt-0.5 tracking-wider uppercase font-semibold">Gemini Powered</div>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="glass-card flex flex-col justify-between h-36 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white truncate">Secure History</div>
                <div className="text-[10px] text-gray-500 mt-0.5 tracking-wider uppercase font-semibold">JWT Protected</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
