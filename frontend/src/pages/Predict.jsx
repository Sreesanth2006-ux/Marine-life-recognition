import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, X, Fish, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { predictAPI } from '../services/api'

export default function Predict() {
  const navigate = useNavigate()
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file. Use JPEG, PNG or WebP under 10 MB.')
      return
    }
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  })

  const handleCameraClick = () => {
    document.getElementById('camera-input').click()
  }

  const handlePredict = async () => {
    if (!file) { toast.error('Please select an image first.'); return }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await predictAPI.predict(formData)
      toast.success(`Identified: ${res.data.predicted_class}! 🐠`)
      navigate('/results', { state: { result: res.data } })
    } catch (err) {
      const msg = err.response?.data?.detail || 'Prediction failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => { setFile(null); setPreview(null); setError(null) }

  return (
    <div className="min-h-screen bg-[#080B10] layout-grid pt-24 pb-16 px-6 sm:px-8">
      <div className="max-w-xl mx-auto py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-3 py-1 mb-4">
            <span className="text-gray-400 text-[10px] font-semibold tracking-wider uppercase">Recognition Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Analyze Marine Image
          </h1>
          <p className="text-gray-400 text-xs">Drop an image file below to run local neural network identification.</p>
        </motion.div>

        {/* Upload zone */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          {!preview ? (
            <div
              {...getRootProps()}
              className={`relative border border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-sky-400 bg-sky-400/5'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors ${
                  isDragActive ? 'bg-sky-500/10 border-sky-400/30 text-sky-400' : 'bg-white/[0.02] border-white/10 text-gray-400'
                }`}>
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {isDragActive ? 'Drop image here' : 'Select or drag file'}
                  </p>
                  <p className="text-gray-500 text-[10px]">JPEG, PNG, WebP · Up to 10 MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl overflow-hidden border border-white/[0.08]">
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-72 object-cover bg-white/[0.01]" />
                <button
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white border border-white/10 transition-all active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-md border border-white/10 px-2.5 py-1 flex items-center gap-2 max-w-[calc(100%-2rem)]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white text-[10px] font-medium truncate">{file?.name}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Camera option */}
        {!preview && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-gray-500 text-[10px] uppercase font-semibold">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="camera-input"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  setFile(f)
                  setPreview(URL.createObjectURL(f))
                  setError(null)
                }
              }}
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCameraClick}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-white/10 rounded-lg text-gray-300 hover:bg-white/[0.03] transition-all text-xs font-semibold"
            >
              <Camera className="w-4 h-4 text-gray-500" />
              <span>Capture Image</span>
            </motion.button>
          </>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <p className="text-rose-300 text-xs">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Predict button */}
        <button
          onClick={handlePredict}
          disabled={!preview || loading}
          className={`mt-6 w-full py-3 px-6 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            preview && !loading
              ? 'btn-ocean'
              : 'bg-white/[0.02] text-gray-600 border border-white/[0.04] cursor-not-allowed'
          }`}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Running classification...</span></>
          ) : (
            <><Fish className="w-4 h-4" /><span>Identify Marine Life</span></>
          )}
        </button>

        {/* Info chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['23 Organism Species', 'MobileNetV2 CNN', 'Gemini AI Summary', 'Local Inference'].map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
