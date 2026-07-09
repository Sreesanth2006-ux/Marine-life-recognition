import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Landing       from './pages/Landing'
import Home          from './pages/Home'
import Predict       from './pages/Predict'
import Results       from './pages/Results'
import History       from './pages/History'
import About         from './pages/About'
import Contact       from './pages/Contact'
import Login         from './pages/Login'
import Signup        from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-ocean-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"        element={<Landing />} />
          <Route path="/home"    element={<Home />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />

          {/* Protected */}
          <Route path="/predict" element={<ProtectedRoute><Predict /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/admin"   element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
