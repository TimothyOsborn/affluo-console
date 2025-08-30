import React, { createContext, useContext, ReactNode } from 'react'

interface ThemeColors {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
  background: string
  surface: string
  error: string
  warning: string
  success: string
  textPrimary: string
  textSecondary: string
  textDisabled: string
  border: string
}

interface ThemeShadows {
  shadow1: string
  shadow2: string
  shadow3: string
  shadow4: string
  shadow5: string
}

interface Theme {
  colors: ThemeColors
  shadows: ThemeShadows
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xl2: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  transitions: {
    fast: string
    normal: string
    slow: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      xl2: string
      xl3: string
      xl4: string
    }
  }
}

export const forestGreenTheme: Theme = {
  colors: {
    primary: '#228B22',
    primaryLight: '#32CD32',
    primaryDark: '#006400',
    secondary: '#556B2F',
    secondaryLight: '#6B8E23',
    secondaryDark: '#2F4F2F',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#B71C1C',
    warning: '#F57C00',
    success: '#388E3C',
    textPrimary: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    border: '#E0E0E0',
  },
  shadows: {
    shadow1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    shadow2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    shadow3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    shadow4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
    shadow5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xl2: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  typography: {
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xl2: '1.5rem',
      xl3: '1.875rem',
      xl4: '2.25rem',
    },
  },
}

interface ThemeContextType {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const value: ThemeContextType = {
    theme: forestGreenTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
