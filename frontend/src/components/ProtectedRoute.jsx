import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-ocean-400 border-t-transparent animate-spin" />
          <p className="text-ocean-300 text-lg">Authenticating…</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />

  return children
}
