import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Fish, Menu, X, Sun, Moon, LogOut, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { to: '/home',    label: 'Home'    },
  { to: '/predict', label: 'Predict' },
  { to: '/history', label: 'History' },
  { to: '/about',   label: 'About'   },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout }   = useAuth()
  const { dark, toggle }   = useTheme()
  const navigate            = useNavigate()
  const { pathname }        = useLocation()
  const [open, setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#080B10]/85 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/35 flex items-center justify-center transition-all duration-150">
              <Fish className="w-4.5 h-4.5 text-sky-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white hidden sm:block">
              Marine<span className="text-sky-400">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  pathname === to
                    ? 'bg-white/[0.06] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {label}
              </Link>
            ))}
            {user?.is_admin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all duration-150 ${
                  pathname === '/admin'
                    ? 'bg-white/[0.06] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-300 text-xs">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-red-400 hover:bg-red-500/5 text-xs transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"  className="btn-ghost py-1.5 px-3.5 text-xs">Login</Link>
                <Link to="/signup" className="btn-ocean py-1.5 px-3.5 text-xs">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-white/[0.03] transition-all"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080B10]/95 backdrop-blur-md border-t border-white/[0.06]"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === to
                      ? 'bg-white/[0.06] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {user?.is_admin && (
                <Link to="/admin" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.03]">
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
              )}
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                {user ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/5 transition-all">
                    <LogOut className="w-4 h-4" /> Logout ({user.username})
                  </button>
                ) : (
                  <>
                    <Link to="/login"  onClick={() => setOpen(false)} className="block btn-ghost w-full py-2">Login</Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="block btn-ocean w-full py-2">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
