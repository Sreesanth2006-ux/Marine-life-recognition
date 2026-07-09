import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Fish, Mail, Lock, User, Eye, EyeOff, UserPlus, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signup }     = useAuth()
  const navigate       = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [showCPwd, setShowCPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { username, email, password, confirmPassword } = form
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.'); return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.'); return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return
    }
    setLoading(true)
    try {
      await signup(username, email, password)
      toast.success('Account created! Welcome to MarineAI 🌊')
      navigate('/predict')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Signup failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080B10] layout-grid flex items-center justify-center px-4 py-24">
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
          <h1 className="text-xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-xs mt-1">Join MarineAI and explore the ocean</p>
        </div>

        {/* Admin notice */}
        <div className="flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg mb-6">
          <Info className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
          <p className="text-gray-400 text-[10px] leading-normal font-medium">The first registered account automatically becomes an Admin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="su-username" className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input id="su-username" type="text" autoComplete="username"
                value={form.username} onChange={set('username')}
                className="input-ocean pl-10 text-xs py-2 px-3" placeholder="oceanexplorer" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="su-email" className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input id="su-email" type="email" autoComplete="email"
                value={form.email} onChange={set('email')}
                className="input-ocean pl-10 text-xs py-2 px-3" placeholder="you@example.com" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="su-password" className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input id="su-password" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                value={form.password} onChange={set('password')}
                className="input-ocean pl-10 pr-10 text-xs py-2 px-3" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPwd(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="su-cpassword" className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input id="su-cpassword" type={showCPwd ? 'text' : 'password'} autoComplete="new-password"
                value={form.confirmPassword} onChange={set('confirmPassword')}
                className="input-ocean pl-10 pr-10 text-xs py-2 px-3" placeholder="••••••••" />
              <button type="button" onClick={() => setShowCPwd(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showCPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-rose-400 text-xs bg-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn-ocean w-full py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold">
            {loading
              ? <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating account…</>
              : <><UserPlus className="w-3.5 h-3.5" />Create Account</>}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
