import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0a1628',
                color: '#caf0f8',
                border: '1px solid #0077b6',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#00b4d8', secondary: '#0a1628' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#0a1628' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
