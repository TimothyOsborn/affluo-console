import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', error.response.data)
          break
        case 404:
          // Not found
          console.error('Resource not found:', error.response.data)
          break
        case 500:
          // Server error
          console.error('Server error:', error.response.data)
          break
        default:
          console.error('API error:', error.response.data)
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request)
    } else {
      // Other error
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API helper functions for company-scoped endpoints
export const createCompanyApi = (companyId: string) => {
  const baseURL = `/companies/${companyId}`
  
  return {
    // Forms
    getForms: () => api.get(`${baseURL}/forms`),
    getForm: (formId: string) => api.get(`${baseURL}/forms/${formId}`),
    createForm: (schema: any) => api.post(`${baseURL}/forms`, schema),
    updateForm: (formId: string, schema: any) => api.put(`${baseURL}/forms/${formId}`, schema),
    deleteForm: (formId: string) => api.delete(`${baseURL}/forms/${formId}`),
    
    // Submissions
    getSubmissions: (params?: { formId?: string; page?: number; size?: number }) => 
      api.get(`${baseURL}/submissions`, { params }),
    getSubmission: (submissionId: string) => api.get(`${baseURL}/submissions/${submissionId}`),
    createSubmission: (submission: any) => api.post(`${baseURL}/submissions`, submission),
    updateSubmission: (submissionId: string, submission: any) => 
      api.put(`${baseURL}/submissions/${submissionId}`, submission),
    deleteSubmission: (submissionId: string) => api.delete(`${baseURL}/submissions/${submissionId}`),
    
    // Users
    getUsers: () => api.get(`${baseURL}/users`),
    getUser: (userId: string) => api.get(`${baseURL}/users/${userId}`),
    createUser: (user: any) => api.post(`${baseURL}/users`, user),
    updateUser: (userId: string, user: any) => api.put(`${baseURL}/users/${userId}`, user),
    deleteUser: (userId: string) => api.delete(`${baseURL}/users/${userId}`),
    
    // Teams
    getTeams: () => api.get(`${baseURL}/teams`),
    getTeam: (teamId: string) => api.get(`${baseURL}/teams/${teamId}`),
    createTeam: (team: any) => api.post(`${baseURL}/teams`, team),
    updateTeam: (teamId: string, team: any) => api.put(`${baseURL}/teams/${teamId}`, team),
    deleteTeam: (teamId: string) => api.delete(`${baseURL}/teams/${teamId}`),
  }
}

// Generic API functions
export const apiClient = {
  // Auth
  login: (credentials: { username: string; password: string }) => 
    api.post('/auth/login', credentials),
  refreshToken: (refreshToken: string) => 
    api.post('/auth/refresh', { refreshToken }),
  validateToken: () => api.get('/auth/validate'),
  
  // Companies
  getCompany: (companyId: string) => api.get(`/companies/${companyId}`),
  
  // WebSocket connection helper
  getWebSocketUrl: () => {
    const baseUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080/ws/sync'
    const token = localStorage.getItem('token')
    return token ? `${baseUrl}?token=${token}` : baseUrl
  },
}

export default api
