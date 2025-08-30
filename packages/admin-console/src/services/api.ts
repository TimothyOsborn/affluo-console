import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { mockApiService } from './mockData'

// Check if mock mode is enabled
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'
console.log('API Service - USE_MOCK_API:', USE_MOCK_API, 'Value:', import.meta.env.VITE_USE_MOCK_API)

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
  
  if (USE_MOCK_API) {
    // Return mock API functions
    return {
      // Forms
      getForms: () => mockApiService.getForms(companyId),
      getForm: (formId: string) => mockApiService.getForm(companyId, formId),
      createForm: (schema: any) => mockApiService.createForm(companyId, schema),
      updateForm: (formId: string, schema: any) => mockApiService.updateForm(companyId, formId, schema),
      deleteForm: (formId: string) => mockApiService.deleteForm(companyId, formId),
      
      // Submissions
      getSubmissions: (params?: { formId?: string; page?: number; size?: number }) => 
        mockApiService.getSubmissions(companyId, params),
      getSubmission: (submissionId: string) => mockApiService.getSubmission(companyId, submissionId),
      createSubmission: (submission: any) => mockApiService.createSubmission(companyId, submission),
      updateSubmission: (submissionId: string, submission: any) => 
        mockApiService.updateSubmission(companyId, submissionId, submission),
      deleteSubmission: (submissionId: string) => mockApiService.deleteSubmission(companyId, submissionId),
      
      // Users
      getUsers: () => mockApiService.getUsers(companyId),
      getUser: (userId: string) => mockApiService.getUser(companyId, userId),
      createUser: (user: any) => mockApiService.createUser(companyId, user),
      updateUser: (userId: string, user: any) => mockApiService.updateUser(companyId, userId, user),
      deleteUser: (userId: string) => mockApiService.deleteUser(companyId, userId),
      
      // Teams
      getTeams: () => mockApiService.getTeams(companyId),
      getTeam: (teamId: string) => mockApiService.getTeam(companyId, teamId),
      createTeam: (team: any) => mockApiService.createTeam(companyId, team),
      updateTeam: (teamId: string, team: any) => mockApiService.updateTeam(companyId, teamId, team),
      deleteTeam: (teamId: string) => mockApiService.deleteTeam(companyId, teamId),

      // Lists
      getLists: () => mockApiService.getLists(companyId),
      getList: (listId: string) => mockApiService.getList(companyId, listId),
      createList: (list: any) => mockApiService.createList(companyId, list),
      updateList: (listId: string, list: any) => mockApiService.updateList(companyId, listId, list),
      deleteList: (listId: string) => mockApiService.deleteList(companyId, listId),
    }
  }
  
  // Return real API functions
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

    // Lists
    getLists: () => api.get(`${baseURL}/lists`),
    getList: (listId: string) => api.get(`${baseURL}/lists/${listId}`),
    createList: (list: any) => api.post(`${baseURL}/lists`, list),
    updateList: (listId: string, list: any) => api.put(`${baseURL}/lists/${listId}`, list),
    deleteList: (listId: string) => api.delete(`${baseURL}/lists/${listId}`),
  }
}

// Generic API functions
export const apiClient = {
  // Auth
  login: (credentials: { username: string; password: string }) => {
    console.log('Login called with credentials:', credentials)
    console.log('USE_MOCK_API in login:', USE_MOCK_API)
    if (USE_MOCK_API) {
      console.log('Using mock API for login')
      return mockApiService.login(credentials)
    }
    console.log('Using real API for login')
    return api.post('/auth/login', credentials)
  },
  
  refreshToken: (refreshToken: string) => {
    if (USE_MOCK_API) {
      return mockApiService.refreshToken(refreshToken)
    }
    return api.post('/auth/refresh', { refreshToken })
  },
  
  validateToken: () => {
    if (USE_MOCK_API) {
      return mockApiService.validateToken()
    }
    return api.get('/auth/validate')
  },
  
  // Companies
  getCompany: (companyId: string) => {
    if (USE_MOCK_API) {
      return mockApiService.getCompany(companyId)
    }
    return api.get(`/companies/${companyId}`)
  },

  getAllCompanies: () => {
    if (USE_MOCK_API) {
      return mockApiService.getAllCompanies()
    }
    return api.get('/companies')
  },
  
  // WebSocket connection helper
  getWebSocketUrl: () => {
    if (USE_MOCK_API) {
      return mockApiService.getWebSocketUrl()
    }
    const baseUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080/ws/sync'
    const token = localStorage.getItem('token')
    return token ? `${baseUrl}?token=${token}` : baseUrl
  },
}

export default api
