import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Fish, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login }      = useAuth()
  const navigate       = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back! 🌊')
      navigate('/predict')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080B10] layout-grid flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm glass-card border border-white/[0.06] p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/35 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Fish className="w-5 h-5 text-sky-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-xs mt-1">Sign in to your MarineAI account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-ocean pl-10 text-xs py-2 px-3"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-ocean pl-10 pr-10 text-xs py-2 px-3"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-rose-400 text-xs bg-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-ocean w-full py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold"
          >
            {loading ? (
              <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Signing in…</>
            ) : (
              <><LogIn className="w-3.5 h-3.5" />Sign In</>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
