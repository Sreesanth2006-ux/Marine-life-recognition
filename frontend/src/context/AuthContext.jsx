import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('marine_token'))
  const [loading, setLoading] = useState(true)

  // Re-hydrate user on mount / token change
  useEffect(() => {
    if (token) {
      authAPI.me()
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { access_token, user: userData } = res.data
    localStorage.setItem('marine_token', access_token)
    setToken(access_token)
    setUser(userData)
    return userData
  }

  const signup = async (username, email, password) => {
    const res = await authAPI.signup({ username, email, password })
    const { access_token, user: userData } = res.data
    localStorage.setItem('marine_token', access_token)
    setToken(access_token)
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('marine_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
