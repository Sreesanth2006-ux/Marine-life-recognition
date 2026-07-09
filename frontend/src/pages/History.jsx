import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Fish, Trash2, Trash, Clock, Search, ChevronRight, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { historyAPI, predictAPI } from '../services/api'

function SkeletonCard() {
  return (
    <div className="glass-card border border-ocean-700/30 animate-pulse">
      <div className="w-full h-40 bg-ocean-700/50 rounded-xl mb-4" />
      <div className="h-4 bg-ocean-700/50 rounded mb-2 w-3/4" />
      <div className="h-3 bg-ocean-700/50 rounded w-1/2 mb-4" />
      <div className="h-8 bg-ocean-700/50 rounded" />
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [deleting, setDeleting]       = useState(null)
  const [clearing, setClearing]       = useState(false)

  useEffect(() => { loadHistory() }, [])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const res = await historyAPI.list(0, 50)
      setPredictions(res.data)
    } catch { toast.error('Failed to load history.') }
    finally { setLoading(false) }
  }

  const deletePrediction = async (id) => {
    setDeleting(id)
    try {
      await historyAPI.delete(id)
      setPredictions((ps) => ps.filter((p) => p.id !== id))
      toast.success('Prediction deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const clearAll = async () => {
    if (!window.confirm('Delete ALL prediction history? This cannot be undone.')) return
    setClearing(true)
    try {
      await historyAPI.clearAll()
      setPredictions([])
      toast.success('History cleared.')
    } catch { toast.error('Clear failed.') }
    finally { setClearing(false) }
  }

  const downloadCSV = async () => {
    try {
      const res = await predictAPI.downloadCSV()
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url; a.download = 'marine_history.csv'; a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV downloaded!')
    } catch { toast.error('CSV download failed.') }
  }

  const filtered = predictions.filter((p) =>
    p.predicted_class?.toLowerCase().includes(search.toLowerCase())
  )

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-900 via-[#011f4b] to-ocean-800 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-1">
              Prediction <span className="gradient-text">History</span>
            </h1>
            <p className="text-ocean-400">{predictions.length} prediction{predictions.length !== 1 ? 's' : ''} stored</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={downloadCSV} className="btn-ghost py-2 px-4 text-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            {predictions.length > 0 && (
              <button onClick={clearAll} disabled={clearing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 border border-red-500/30 hover:bg-red-500/10 text-sm transition-all disabled:opacity-60">
                <Trash className="w-4 h-4" />
                {clearing ? 'Clearing…' : 'Clear All'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-400" />
          <input
            className="input-ocean pl-10 w-full max-w-xs"
            placeholder="Search species…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <Fish className="w-16 h-16 text-ocean-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ocean-300 mb-2">No predictions yet</h3>
            <p className="text-ocean-500 mb-6">Upload your first marine organism image to get started.</p>
            <button onClick={() => navigate('/predict')} className="btn-ocean">Start Predicting</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map((pred, i) => {
                const imgUrl = `${API_BASE}/uploads/${pred.image_filename}`
                const pct = Math.round(pred.confidence * 100)
                const badgeColor = pct >= 80 ? 'bg-green-500/80 text-white' : pct >= 60 ? 'bg-yellow-500/80 text-white' : 'bg-red-500/80 text-white'
                return (
                  <motion.div
                    key={pred.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card border border-ocean-700/30 hover:border-ocean-500/50 transition-all duration-200 group cursor-pointer"
                    onClick={() => navigate('/results', {
                      state: { result: { ...pred, image_url: `/uploads/${pred.image_filename}` } }
                    })}
                  >
                    <div className="relative mb-4 rounded-xl overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={pred.predicted_class}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = `https://placehold.co/400x300/03045e/caf0f8?text=${encodeURIComponent(pred.predicted_class)}` }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`badge ${badgeColor} text-xs`}>{pct}%</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1 truncate">{pred.predicted_class}</h3>
                    {pred.scientific_name && (
                      <p className="text-ocean-400 text-xs italic mb-2 truncate">{pred.scientific_name}</p>
                    )}
                    <div className="flex items-center gap-1 text-ocean-500 text-xs mb-4">
                      <Clock className="w-3 h-3" />
                      {new Date(pred.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePrediction(pred.id) }}
                        disabled={deleting === pred.id}
                        className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1 text-ocean-400 text-xs">
                        View details <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
