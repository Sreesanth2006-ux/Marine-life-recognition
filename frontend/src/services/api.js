import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('marine_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login',  data),
  me:     ()     => api.get('/auth/me'),
}

// ── Predictions ───────────────────────────────────────────────────────────────
export const predictAPI = {
  predict: (formData) =>
    api.post('/predict', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  downloadPDF: (id) =>
    api.get(`/report/pdf/${id}`, { responseType: 'blob' }),
  downloadCSV: () =>
    api.get('/report/csv', { responseType: 'blob' }),
}

// ── History ───────────────────────────────────────────────────────────────────
export const historyAPI = {
  list:         (skip = 0, limit = 20) => api.get(`/history?skip=${skip}&limit=${limit}`),
  get:          (id)                   => api.get(`/history/${id}`),
  delete:       (id)                   => api.delete(`/history/${id}`),
  clearAll:     ()                     => api.delete('/history'),
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (data) => api.post('/chat', data),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
}

export const getImageUrl = (filename) =>
  `${API_BASE}/uploads/${filename}`

export default api
