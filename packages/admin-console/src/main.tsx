import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import App from './App'
import { ThemeProvider, forestGreenTheme } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <StyledThemeProvider theme={forestGreenTheme}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </StyledThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
