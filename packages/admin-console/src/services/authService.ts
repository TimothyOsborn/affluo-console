import { apiClient } from './api'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    email: string
    role: string
    companyId: string
    companyName: string
  }
  token: string
  refreshToken?: string
}

export interface User {
  id: string
  username: string
  email: string
  role: string
  companyId: string
  companyName: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('AuthService login called with:', credentials)
      const response = await apiClient.login(credentials)
      console.log('AuthService login response:', response)
      return response.data
    } catch (error: any) {
      console.log('AuthService login error:', error)
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password')
      }
      if (error.response?.status === 403) {
        throw new Error('Account is disabled or locked')
      }
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      // Store token temporarily for validation
      const originalToken = localStorage.getItem('token')
      localStorage.setItem('token', token)
      
      const response = await apiClient.validateToken()
      const user = response.data
      
      // Restore original token if different
      if (originalToken && originalToken !== token) {
        localStorage.setItem('token', originalToken)
      }
      
      return user
    } catch (error: any) {
      throw new Error('Invalid or expired token')
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const response = await apiClient.refreshToken(refreshToken)
      return response.data
    } catch (error: any) {
      throw new Error('Failed to refresh token')
    }
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token
  }

  // Helper to decode JWT token (client-side only, for display purposes)
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  }
}

export const authService = new AuthService()
