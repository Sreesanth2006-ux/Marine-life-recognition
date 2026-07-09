import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Fish, TrendingUp, Award, Calendar,
  RefreshCw, BarChart3
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler
)

const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#90e0ef', font: { size: 11 } } },
  },
  scales: {
    x: { ticks: { color: '#48cae4' }, grid: { color: 'rgba(0,119,182,0.2)' } },
    y: { ticks: { color: '#48cae4' }, grid: { color: 'rgba(0,119,182,0.2)' }, beginAtZero: true },
  },
}

function StatCard({ icon: Icon, label, value, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass-card border border-ocean-700/30"
    >
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-ocean-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-black text-white truncate">{value ?? '—'}</p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.stats()
      setStats(res.data)
    } catch { toast.error('Failed to load admin stats.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="min-h-screen bg-ocean-900 pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-400 border-t-transparent animate-spin" />
        <p className="text-ocean-300">Loading dashboard…</p>
      </div>
    </div>
  )

  const speciesEntries = stats
    ? Object.entries(stats.predictions_by_species).sort((a, b) => b[1] - a[1]).slice(0, 8)
    : []
  const dateEntries = stats ? Object.entries(stats.predictions_by_date) : []

  const barData = {
    labels: speciesEntries.map(([k]) => k),
    datasets: [{
      label: 'Predictions',
      data: speciesEntries.map(([, v]) => v),
      backgroundColor: 'rgba(0,180,216,0.5)',
      borderColor: '#00b4d8',
      borderWidth: 2,
      borderRadius: 6,
    }],
  }

  const lineData = {
    labels: dateEntries.map(([k]) => k.slice(5)),
    datasets: [{
      label: 'Daily Predictions',
      data: dateEntries.map(([, v]) => v),
      borderColor: '#48cae4',
      backgroundColor: 'rgba(72,202,228,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00b4d8',
      pointRadius: 4,
    }],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-900 to-[#011f4b] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-1">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-ocean-400">Platform analytics & statistics</p>
          </div>
          <button onClick={load} className="btn-ghost py-2 px-4 text-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Fish}        label="Total Predictions" value={stats?.total_predictions}                                  bg="bg-ocean-600"  delay={0.1} />
          <StatCard icon={Users}       label="Total Users"       value={stats?.total_users}                                        bg="bg-purple-600" delay={0.2} />
          <StatCard icon={Award}       label="Top Species"       value={stats?.most_predicted}                                     bg="bg-yellow-600" delay={0.3} />
          <StatCard icon={TrendingUp}  label="Species Tracked"   value={Object.keys(stats?.predictions_by_species || {}).length}  bg="bg-green-600"  delay={0.4} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card border border-ocean-700/30">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-ocean-400" /> Top Species
            </h2>
            <Bar data={barData} options={CHART_OPTIONS} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-card border border-ocean-700/30">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ocean-400" /> Predictions Over Time (14 days)
            </h2>
            <Line data={lineData} options={CHART_OPTIONS} />
          </motion.div>
        </div>

        {/* Recent predictions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card border border-ocean-700/30 mb-6 overflow-x-auto">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Fish className="w-5 h-5 text-ocean-400" /> Recent Predictions
          </h2>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-ocean-400 border-b border-ocean-700/50 text-left">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Species</th>
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-800/50">
              {(stats?.recent_predictions || []).map((p) => (
                <tr key={p.id} className="hover:bg-ocean-800/30 transition-colors">
                  <td className="py-3 text-ocean-400">#{p.id}</td>
                  <td className="py-3 text-white font-medium">{p.predicted_class}</td>
                  <td className="py-3">
                    <span className={`badge text-xs ${
                      p.confidence >= 80 ? 'bg-green-500/20 text-green-400'
                      : p.confidence >= 60 ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                    }`}>
                      {p.confidence?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 text-ocean-400">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card border border-ocean-700/30 overflow-x-auto">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-ocean-400" /> Users
          </h2>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-ocean-400 border-b border-ocean-700/50 text-left">
                <th className="pb-3 font-medium">Username</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Predictions</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-800/50">
              {(stats?.users || []).map((u) => (
                <tr key={u.id} className="hover:bg-ocean-800/30 transition-colors">
                  <td className="py-3 text-white font-medium">{u.username}</td>
                  <td className="py-3 text-ocean-300">{u.email}</td>
                  <td className="py-3 text-ocean-200">{u.prediction_count}</td>
                  <td className="py-3">
                    <span className={`badge text-xs ${
                      u.is_admin ? 'bg-purple-500/20 text-purple-400' : 'bg-ocean-700/50 text-ocean-300'
                    }`}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-3 text-ocean-400">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  )
}
