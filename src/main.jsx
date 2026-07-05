import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { QueueProvider } from './context/QueueContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueueProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueueProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
