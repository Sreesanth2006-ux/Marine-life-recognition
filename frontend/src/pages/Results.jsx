import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fish, Download, MessageSquare, Upload, Volume2, VolumeX,
  Star, MapPin, Utensils, Clock, Shield, AlertTriangle, Leaf,
  ChevronDown, ChevronUp, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { predictAPI, chatAPI } from '../services/api'

function ConfidenceBar({ value, label, rank }) {
  const pct = Math.round(value * 100)
  const barColors = [
    'bg-sky-500',
    'bg-gray-400',
    'bg-gray-600',
  ]
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-mono">
            #0{rank}
          </span>
          <span className="text-xs font-semibold text-gray-200">{label}</span>
        </div>
        <span className="text-xs font-bold text-sky-400">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: rank * 0.1 }}
          className={`h-full rounded-full ${barColors[rank - 1] || 'bg-gray-700'}`}
        />
      </div>
    </div>
  )
}

function InfoSection({ icon: Icon, title, content, color = 'text-sky-400' }) {
  const [open, setOpen] = useState(true)
  let items = content
  if (typeof items === 'string') {
    try { items = JSON.parse(items) } catch { items = [items] }
  }
  if (!Array.isArray(items)) items = [String(items)]

  return (
    <div className="border border-white/[0.06] bg-[#0C101B]/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs font-semibold text-white tracking-tight">{title}</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-white/[0.04] pt-3">
              {items.length > 1 ? (
                <ul className="space-y-2">
                  {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-xs">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-sky-500 shrink-0" />
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-xs leading-relaxed">{items[0]}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Results() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const result     = state?.result
  const [speaking, setSpeaking]       = useState(false)
  const [chatOpen, setChatOpen]       = useState(false)
  const [chatMsg, setChatMsg]         = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [pdfLoading, setPdfLoading]   = useState(false)

  useEffect(() => { if (!result) navigate('/predict') }, [result])
  if (!result) return null

  const pct = Math.round(result.confidence * 100)
  const top3 = result.top3_predictions || []
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const imageUrl = result.image_url?.startsWith('http')
    ? result.image_url
    : `${API_BASE}${result.image_url}`

  const speak = () => {
    if (!('speechSynthesis' in window)) { toast.error('TTS not supported in your browser.'); return }
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const text = [
      `This is a ${result.predicted_class}.`,
      result.ai_description,
      result.habitat ? `It lives in: ${result.habitat}` : '',
    ].filter(Boolean).join(' ')
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.9
    utt.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utt)
    setSpeaking(true)
  }

  const downloadPDF = async () => {
    setPdfLoading(true)
    try {
      const res = await predictAPI.downloadPDF(result.id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `marine_report_${result.predicted_class}.pdf`; a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch { toast.error('PDF download failed.') }
    finally { setPdfLoading(false) }
  }

  const sendChat = async () => {
    if (!chatMsg.trim()) return
    const q = chatMsg; setChatMsg('')
    setChatHistory((h) => [...h, { role: 'user', text: q }])
    setChatLoading(true)
    try {
      const res = await chatAPI.send({ message: q, species: result.predicted_class, prediction_id: result.id })
      setChatHistory((h) => [...h, { role: 'ai', text: res.data.response }])
    } catch {
      setChatHistory((h) => [...h, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }])
    } finally { setChatLoading(false) }
  }

  const confColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-rose-400'
  const barColor  = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="min-h-screen bg-[#080B10] layout-grid pt-24 pb-16 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-3 py-1 mb-4">
            <span className="text-gray-400 text-[10px] font-semibold tracking-wider uppercase">Inference Report</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Classification Analysis
          </h1>
          <p className="text-gray-400 text-xs">Visual classification complete. Details retrieved via Gemini v2.5.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left panel ── */}
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
            className="lg:col-span-2 space-y-4">

            {/* Image card */}
            <div className="glass-card border border-white/[0.06] overflow-hidden p-0">
              <img src={imageUrl} alt={result.predicted_class}
                className="w-full h-56 object-cover bg-white/[0.01]"
                onError={(e) => { e.target.src = 'https://placehold.co/400x300/03045e/caf0f8?text=Image' }}
              />
              <div className="p-5 border-t border-white/[0.04]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">Classified Species</p>
                    <h2 className="text-xl font-bold text-white mt-0.5">{result.predicted_class}</h2>
                    {result.scientific_name && (
                      <p className="text-xs text-gray-400 italic mt-0.5">{result.scientific_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-extrabold ${confColor}`}>{pct}%</div>
                    <p className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold">Confidence</p>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
              </div>
            </div>

            {/* Top-3 */}
            <div className="glass-card border border-white/[0.06] p-5">
              <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Alternate Classifications</span>
              </h3>
              {top3.map((p, i) => (
                <ConfidenceBar key={i} label={p.class_name} value={p.confidence} rank={i + 1} />
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={downloadPDF} disabled={pdfLoading} className="btn-ocean text-xs font-semibold py-2.5 disabled:opacity-60">
                {pdfLoading ? <span className="animate-spin">⌛</span> : <Download className="w-3.5 h-3.5" />}
                <span>PDF Report</span>
              </button>
              <button onClick={speak} className="btn-ghost text-xs font-semibold py-2.5">
                {speaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-gray-400" />}
                <span>{speaking ? 'Stop Voice' : 'Narrate'}</span>
              </button>
              <button onClick={() => setChatOpen((o) => !o)}
                className="btn-ghost text-xs font-semibold py-2.5 col-span-2">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
            <Link to="/predict"
              className="btn-ghost text-xs font-semibold py-2.5 w-full flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5 text-gray-400" />
              <span>Analyze Another Image</span>
            </Link>
          </motion.div>

          {/* ── Right panel ── */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4">

            {result.ai_description && (
              <div className="glass-card border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Fish className="w-4 h-4 text-sky-400" />
                  <h3 className="text-white font-semibold text-xs">Overview Description</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-xs">{result.ai_description}</p>
              </div>
            )}

            {/* Metadata chips inline grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.lifespan && (
                <div className="border border-white/[0.06] bg-[#0C101B]/40 rounded-xl p-3">
                  <Clock className="w-3.5 h-3.5 text-purple-400 mb-1" />
                  <p className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold">Lifespan</p>
                  <p className="text-xs font-bold text-white mt-0.5">{result.lifespan}</p>
                </div>
              )}
              {result.conservation_status && (
                <div className="border border-white/[0.06] bg-[#0C101B]/40 rounded-xl p-3">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                  <p className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold">Conservation</p>
                  <p className="text-xs font-bold text-white mt-0.5">{result.conservation_status}</p>
                </div>
              )}
              {result.scientific_name && (
                <div className="border border-white/[0.06] bg-[#0C101B]/40 rounded-xl p-3">
                  <FileText className="w-3.5 h-3.5 text-sky-400 mb-1" />
                  <p className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold">Scientific Name</p>
                  <p className="text-xs font-bold text-white mt-0.5 truncate italic">{result.scientific_name}</p>
                </div>
              )}
            </div>

            {result.habitat          && <InfoSection icon={MapPin}        title="Natural Habitat"                   content={result.habitat}          color="text-blue-400" />}
            {result.food             && <InfoSection icon={Utensils}      title="Diet & Feeding Habits"            content={result.food}             color="text-amber-400" />}
            {result.interesting_facts && <InfoSection icon={Star}          title="Interesting Facts"          content={result.interesting_facts} color="text-yellow-400" />}
            {result.threats          && <InfoSection icon={AlertTriangle} title="Major Threats"                   content={result.threats}          color="text-rose-400" />}
            {result.protection       && <InfoSection icon={Leaf}          title="Protection & Conservation" content={result.protection}       color="text-emerald-400" />}
          </motion.div>
        </div>

        {/* ── AI Chat drawer ── */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-6 right-6 w-80 sm:w-96 bg-[#0B0F19] border border-white/[0.08] rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden"
              style={{ maxHeight: '420px' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0C101B]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full dot-pulse" />
                  <span className="text-white font-semibold text-xs tracking-tight">Ask about {result.predicted_class}</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white text-lg leading-none">×</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-[#080B10]/50">
                {chatHistory.length === 0 && (
                  <p className="text-gray-500 text-[10px] text-center mt-4 leading-relaxed">
                    Ask a specific question about {result.predicted_class}!<br />
                    e.g. "What does it eat?" or "Is it dangerous?"
                  </p>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`text-xs ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-2 rounded-lg max-w-[85%] text-left ${
                      m.role === 'user'
                        ? 'bg-sky-500/10 border border-sky-500/20 text-sky-300'
                        : 'bg-white/[0.02] border border-white/[0.06] text-gray-300'
                    }`}>{m.text}</span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-1 pl-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/[0.06] bg-[#0C101B] flex gap-2">
                <input
                  className="input-ocean text-xs py-2 px-3 flex-1 bg-[#080B10]/80"
                  placeholder="Ask a question..."
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                />
                <button onClick={sendChat} className="btn-ocean py-2 px-3">
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
