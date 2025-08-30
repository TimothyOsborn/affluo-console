import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { authService } from '../services/authService'

interface User {
  id: string
  username: string
  email: string
  role: string
  companyId: string
  companyName: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing token on app load
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' })
          const user = await authService.validateToken(token)
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
        } catch (error) {
          localStorage.removeItem('token')
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' })
        }
      } else {
        // No token found, set loading to false and not authenticated
        dispatch({ type: 'AUTH_FAILURE', payload: '' })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const { user, token } = await authService.login(credentials)
      localStorage.setItem('token', token)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'AUTH_LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
