import { v4 as uuidv4 } from 'uuid'

// Mock data types
export interface MockUser {
  id: string
  username: string
  email: string
  role: string
  companyId: string
  companyName: string
  firstName: string
  lastName: string
  avatar?: string
  isActive: boolean
  createdAt: string
  lastLoginAt: string
}

export interface MockForm {
  id: string
  title: string
  description: string
  schema: any
  status: 'draft' | 'published' | 'archived'
  submissionsCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
  companyId: string
  settings: {
    allowAnonymous: boolean
    requireLogin: boolean
    maxSubmissions: number | null
    expirationDate: string | null
  }
}

export interface MockSubmission {
  id: string
  formId: string
  formTitle: string
  data: any
  submittedBy?: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  ipAddress: string
  userAgent: string
}

export interface MockList {
  id: string
  name: string
  description: string
  fields: {
    name: string
    type: 'text' | 'number' | 'email' | 'select' | 'date'
    required: boolean
    options?: string[]
  }[]
  items: {
    id: string
    [key: string]: any
  }[]
  createdAt: string
  updatedAt: string
}

export interface MockTeam {
  id: string
  name: string
  description: string
  members: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// Generate mock data
const generateMockUsers = (): MockUser[] => {
  console.log('Generating mock users...')
  const users = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@affluo.com',
    role: 'admin',
    companyId: 'company-1',
    companyName: 'Affluo Inc',
    firstName: 'John',
    lastName: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=228B22&color=fff',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-01-29T14:30:00Z'
  },
  {
    id: 'user-2',
    username: 'manager',
    email: 'manager@affluo.com',
    role: 'manager',
    companyId: 'company-1',
    companyName: 'Affluo Inc',
    firstName: 'Sarah',
    lastName: 'Manager',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Manager&background=556B2F&color=fff',
    isActive: true,
    createdAt: '2024-01-20T09:00:00Z',
    lastLoginAt: '2024-01-29T13:45:00Z'
  },
  {
    id: 'user-3',
    username: 'editor',
    email: 'editor@affluo.com',
    role: 'editor',
    companyId: 'company-1',
    companyName: 'Affluo Inc',
    firstName: 'Mike',
    lastName: 'Editor',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Editor&background=6B8E23&color=fff',
    isActive: true,
    createdAt: '2024-01-25T11:00:00Z',
    lastLoginAt: '2024-01-29T12:15:00Z'
  },
  {
    id: 'user-4',
    username: 'viewer',
    email: 'viewer@affluo.com',
    role: 'viewer',
    companyId: 'company-1',
    companyName: 'Affluo Inc',
    firstName: 'Lisa',
    lastName: 'Viewer',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Viewer&background=2F4F2F&color=fff',
    isActive: false,
    createdAt: '2024-01-28T08:00:00Z',
    lastLoginAt: '2024-01-28T16:20:00Z'
  },
  // Multi-company admin user
  {
    id: 'user-5',
    username: 'superadmin',
    email: 'superadmin@affluo.com',
    role: 'admin',
    companyId: 'company-1',
    companyName: 'Affluo Inc',
    firstName: 'Super',
    lastName: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=228B22&color=fff',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastLoginAt: '2024-01-29T15:00:00Z'
  }
]
  console.log('Generated users:', users)
  return users
}

const generateMockForms = (): MockForm[] => [
  {
    id: 'form-1',
    title: 'Customer Feedback Survey',
    description: 'Collect feedback from customers about our products and services',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Full Name', required: true },
        email: { type: 'string', title: 'Email Address', format: 'email', required: true },
        rating: { type: 'number', title: 'Overall Rating', minimum: 1, maximum: 5, required: true },
        feedback: { type: 'string', title: 'Additional Feedback', format: 'textarea' },
        category: { type: 'string', title: 'Product Category', enum: ['Software', 'Hardware', 'Service'] }
      }
    },
    status: 'published',
    submissionsCount: 156,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-28T16:30:00Z',
    createdBy: 'user-1',
    companyId: 'company-1',
    settings: {
      allowAnonymous: true,
      requireLogin: false,
      maxSubmissions: null,
      expirationDate: null
    }
  },
  {
    id: 'form-2',
    title: 'Employee Onboarding',
    description: 'New employee information collection form',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', title: 'First Name', required: true },
        lastName: { type: 'string', title: 'Last Name', required: true },
        email: { type: 'string', title: 'Work Email', format: 'email', required: true },
        department: { type: 'string', title: 'Department', enum: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] },
        startDate: { type: 'string', title: 'Start Date', format: 'date', required: true },
        emergencyContact: {
          type: 'object',
          title: 'Emergency Contact',
          properties: {
            name: { type: 'string', title: 'Contact Name' },
            phone: { type: 'string', title: 'Phone Number' },
            relationship: { type: 'string', title: 'Relationship' }
          }
        }
      }
    },
    status: 'published',
    submissionsCount: 23,
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-27T11:20:00Z',
    createdBy: 'user-2',
    companyId: 'company-1',
    settings: {
      allowAnonymous: false,
      requireLogin: true,
      maxSubmissions: null,
      expirationDate: null
    }
  },
  {
    id: 'form-3',
    title: 'Event Registration',
    description: 'Conference registration form for annual tech summit',
    schema: {
      type: 'object',
      properties: {
        attendeeName: { type: 'string', title: 'Attendee Name', required: true },
        company: { type: 'string', title: 'Company Name', required: true },
        email: { type: 'string', title: 'Email Address', format: 'email', required: true },
        ticketType: { type: 'string', title: 'Ticket Type', enum: ['Early Bird', 'Regular', 'VIP'], required: true },
        dietaryRestrictions: { type: 'string', title: 'Dietary Restrictions', format: 'textarea' },
        workshops: { type: 'array', title: 'Workshop Preferences', items: { type: 'string' } }
      }
    },
    status: 'draft',
    submissionsCount: 0,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-29T09:15:00Z',
    createdBy: 'user-3',
    companyId: 'company-1',
    settings: {
      allowAnonymous: true,
      requireLogin: false,
      maxSubmissions: 500,
      expirationDate: '2024-03-15T23:59:59Z'
    }
  },
  {
    id: 'form-4',
    title: 'Bug Report',
    description: 'Report software bugs and issues',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Bug Title', required: true },
        description: { type: 'string', title: 'Detailed Description', format: 'textarea', required: true },
        severity: { type: 'string', title: 'Severity Level', enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
        browser: { type: 'string', title: 'Browser', enum: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'] },
        steps: { type: 'string', title: 'Steps to Reproduce', format: 'textarea' },
        attachments: { type: 'array', title: 'Screenshots/Attachments', items: { type: 'string', format: 'file' } }
      }
    },
    status: 'published',
    submissionsCount: 89,
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-29T14:45:00Z',
    createdBy: 'user-1',
    companyId: 'company-1',
    settings: {
      allowAnonymous: true,
      requireLogin: false,
      maxSubmissions: null,
      expirationDate: null
    }
  }
]

const generateMockSubmissions = (): MockSubmission[] => [
  {
    id: 'sub-1',
    formId: 'form-1',
    formTitle: 'Customer Feedback Survey',
    data: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      rating: 5,
      feedback: 'Excellent product! The new features are exactly what I needed.',
      category: 'Software'
    },
    submittedBy: 'alice.johnson@example.com',
    submittedAt: '2024-01-29T10:30:00Z',
    status: 'approved',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-2',
    formId: 'form-1',
    formTitle: 'Customer Feedback Survey',
    data: {
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      rating: 4,
      feedback: 'Good overall experience, but could use some improvements in the UI.',
      category: 'Software'
    },
    submittedBy: 'bob.smith@company.com',
    submittedAt: '2024-01-29T11:15:00Z',
    status: 'pending',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'sub-3',
    formId: 'form-2',
    formTitle: 'Employee Onboarding',
    data: {
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@affluo.com',
      department: 'Engineering',
      startDate: '2024-02-15',
      emergencyContact: {
        name: 'John Davis',
        phone: '+1-555-0123',
        relationship: 'Spouse'
      }
    },
    submittedBy: 'carol.davis@affluo.com',
    submittedAt: '2024-01-29T09:00:00Z',
    status: 'approved',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'sub-4',
    formId: 'form-4',
    formTitle: 'Bug Report',
    data: {
      title: 'Login button not working on mobile',
      description: 'The login button appears but doesn\'t respond when tapped on mobile devices.',
      severity: 'High',
      browser: 'Safari',
      steps: '1. Open app on iPhone\n2. Try to login\n3. Tap login button\n4. Nothing happens'
    },
    submittedBy: 'user@example.com',
    submittedAt: '2024-01-29T13:45:00Z',
    status: 'pending',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  }
]

const generateMockTeams = (): MockTeam[] => [
  {
    id: 'team-1',
    name: 'Development Team',
    description: 'Core development team responsible for product features',
    members: ['user-1', 'user-3'],
    permissions: ['forms:read', 'forms:write', 'submissions:read', 'users:read'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-28T15:30:00Z'
  },
  {
    id: 'team-2',
    name: 'Customer Success',
    description: 'Team handling customer support and success',
    members: ['user-2', 'user-4'],
    permissions: ['forms:read', 'submissions:read', 'submissions:write'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-29T10:15:00Z'
  }
]

// Generate mock lists
const generateMockLists = (): MockList[] => [
  {
    id: 'list-1',
    name: 'Product Inventory',
    description: 'Complete product catalog with SKUs and categories',
    fields: [
      { name: 'Product Name', type: 'text', required: true },
      { name: 'SKU', type: 'text', required: true },
      { name: 'Category', type: 'select', required: true, options: ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports'] },
      { name: 'Price', type: 'number', required: true },
      { name: 'Stock Level', type: 'number', required: true },
      { name: 'Supplier', type: 'text', required: false }
    ],
    items: [
      { id: 'item-1', 'Product Name': 'Laptop Pro X1', 'SKU': 'LAP-001', 'Category': 'Electronics', 'Price': '1299.99', 'Stock Level': '45', 'Supplier': 'TechCorp' },
      { id: 'item-2', 'Product Name': 'Wireless Headphones', 'SKU': 'AUD-002', 'Category': 'Electronics', 'Price': '199.99', 'Stock Level': '120', 'Supplier': 'AudioMax' },
      { id: 'item-3', 'Product Name': 'Cotton T-Shirt', 'SKU': 'CLO-003', 'Category': 'Clothing', 'Price': '24.99', 'Stock Level': '200', 'Supplier': 'FashionCo' },
      { id: 'item-4', 'Product Name': 'Garden Hose', 'SKU': 'GAR-004', 'Category': 'Home & Garden', 'Price': '39.99', 'Stock Level': '75', 'Supplier': 'GardenPro' },
      { id: 'item-5', 'Product Name': 'Programming Guide', 'SKU': 'BOK-005', 'Category': 'Books', 'Price': '49.99', 'Stock Level': '30', 'Supplier': 'BookWorld' }
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-29T14:30:00Z'
  },
  {
    id: 'list-2',
    name: 'Employee Directory',
    description: 'Company employee information and contact details',
    fields: [
      { name: 'First Name', type: 'text', required: true },
      { name: 'Last Name', type: 'text', required: true },
      { name: 'Email', type: 'email', required: true },
      { name: 'Department', type: 'select', required: true, options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'] },
      { name: 'Position', type: 'text', required: true },
      { name: 'Hire Date', type: 'date', required: true },
      { name: 'Phone', type: 'text', required: false }
    ],
    items: [
      { id: 'emp-1', 'First Name': 'John', 'Last Name': 'Smith', 'Email': 'john.smith@company.com', 'Department': 'Engineering', 'Position': 'Senior Developer', 'Hire Date': '2023-01-15', 'Phone': '+1-555-0123' },
      { id: 'emp-2', 'First Name': 'Sarah', 'Last Name': 'Johnson', 'Email': 'sarah.johnson@company.com', 'Department': 'Sales', 'Position': 'Sales Manager', 'Hire Date': '2022-08-20', 'Phone': '+1-555-0124' },
      { id: 'emp-3', 'First Name': 'Mike', 'Last Name': 'Davis', 'Email': 'mike.davis@company.com', 'Department': 'Marketing', 'Position': 'Marketing Specialist', 'Hire Date': '2023-03-10', 'Phone': '+1-555-0125' }
    ],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-29T10:15:00Z'
  },
  {
    id: 'list-3',
    name: 'Customer List',
    description: 'Customer database with contact and preference information',
    fields: [
      { name: 'Customer Name', type: 'text', required: true },
      { name: 'Email', type: 'email', required: true },
      { name: 'Phone', type: 'text', required: false },
      { name: 'Company', type: 'text', required: false },
      { name: 'Customer Type', type: 'select', required: true, options: ['Individual', 'Small Business', 'Enterprise'] },
      { name: 'Join Date', type: 'date', required: true },
      { name: 'Status', type: 'select', required: true, options: ['Active', 'Inactive', 'Pending'] }
    ],
    items: [
      { id: 'cust-1', 'Customer Name': 'Alice Johnson', 'Email': 'alice@example.com', 'Phone': '+1-555-0101', 'Company': 'TechStart', 'Customer Type': 'Small Business', 'Join Date': '2023-06-15', 'Status': 'Active' },
      { id: 'cust-2', 'Customer Name': 'Bob Wilson', 'Email': 'bob@bigcorp.com', 'Phone': '+1-555-0102', 'Company': 'BigCorp Inc', 'Customer Type': 'Enterprise', 'Join Date': '2022-11-20', 'Status': 'Active' },
      { id: 'cust-3', 'Customer Name': 'Carol Brown', 'Email': 'carol@personal.com', 'Phone': '+1-555-0103', 'Company': '', 'Customer Type': 'Individual', 'Join Date': '2024-01-05', 'Status': 'Active' }
    ],
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-29T16:45:00Z'
  }
]

// Generate additional companies
const generateMockCompanies = () => [
  {
    id: 'company-1',
    name: 'Affluo Inc',
    domain: 'affluo.com',
    plan: 'enterprise',
    createdAt: '2024-01-01T00:00:00Z',
    settings: {
      allowAnonymousForms: true,
      requireApproval: false,
      maxUsers: 100,
      maxForms: 1000
    }
  },
  {
    id: 'company-2',
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    plan: 'professional',
    createdAt: '2024-01-15T00:00:00Z',
    settings: {
      allowAnonymousForms: false,
      requireApproval: true,
      maxUsers: 50,
      maxForms: 500
    }
  },
  {
    id: 'company-3',
    name: 'StartupXYZ',
    domain: 'startupxyz.com',
    plan: 'starter',
    createdAt: '2024-02-01T00:00:00Z',
    settings: {
      allowAnonymousForms: true,
      requireApproval: false,
      maxUsers: 10,
      maxForms: 100
    }
  }
]

// Mock data storage
let mockUsers = generateMockUsers()
let mockForms = generateMockForms()
let mockSubmissions = generateMockSubmissions()
let mockTeams = generateMockTeams()
let mockCompanies = generateMockCompanies()
let mockLists = generateMockLists()

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const simulateNetworkDelay = async () => {
  await delay(Math.random() * 500 + 200) // 200-700ms delay
}

const findById = <T extends { id: string }>(array: T[], id: string): T | undefined => {
  return array.find(item => item.id === id)
}

const filterByCompany = <T extends { companyId?: string }>(array: T[], companyId: string): T[] => {
  return array.filter(item => item.companyId === companyId)
}

// Mock API service
export const mockApiService = {
  // Auth endpoints
  login: async (credentials: { username: string; password: string }) => {
    console.log('Mock API login called with:', credentials)
    
    // Validate credentials
    if (!credentials || !credentials.username || !credentials.password) {
      console.log('Login failed - invalid credentials object:', credentials)
      throw new Error('Username and password are required')
    }
    
    // Simple delay simulation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find user by username (case insensitive)
    const user = mockUsers.find(u => 
      u.username.toLowerCase() === credentials.username.toLowerCase()
    )
    
    console.log('Found user:', user)
    
    if (!user) {
      console.log('Login failed - user not found')
      throw new Error('Invalid username or password')
    }
    
    if (!user.isActive) {
      console.log('Login failed - user inactive')
      throw new Error('Account is disabled')
    }
    
    const token = `mock-jwt-token-${user.id}-${Date.now()}`
    console.log('Login successful, returning token:', token)
    
    return {
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.companyName
        },
        token,
        refreshToken: `mock-refresh-token-${user.id}`
      }
    }
  },

  validateToken: async () => {
    await simulateNetworkDelay()
    
    const token = localStorage.getItem('token')
    if (!token || !token.startsWith('mock-jwt-token-')) {
      throw new Error('Invalid or expired token')
    }
    
    const userId = token.replace('mock-jwt-token-', '')
    const user = findById(mockUsers, userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName
      }
    }
  },

  // Company endpoints
  getCompany: async (companyId: string) => {
    await simulateNetworkDelay()
    
    const company = mockCompanies.find(c => c.id === companyId)
    if (!company) {
      throw new Error('Company not found')
    }
    
    return { data: company }
  },

  getAllCompanies: async () => {
    await simulateNetworkDelay()
    
    return {
      data: mockCompanies,
      pagination: {
        page: 1,
        size: 10,
        total: mockCompanies.length,
        totalPages: 1
      }
    }
  },

  // Forms endpoints
  getForms: async (companyId: string) => {
    await simulateNetworkDelay()
    
    const companyForms = filterByCompany(mockForms, companyId)
    return {
      data: companyForms,
      pagination: {
        page: 1,
        size: 10,
        total: companyForms.length,
        totalPages: Math.ceil(companyForms.length / 10)
      }
    }
  },

  getForm: async (companyId: string, formId: string) => {
    await simulateNetworkDelay()
    
    const form = findById(mockForms, formId)
    if (!form || form.companyId !== companyId) {
      throw new Error('Form not found')
    }
    
    return { data: form }
  },

  createForm: async (companyId: string, formData: any) => {
    await simulateNetworkDelay()
    
    const newForm: MockForm = {
      id: `form-${uuidv4()}`,
      title: formData.title,
      description: formData.description,
      schema: formData.schema,
      status: 'draft',
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-1', // Mock current user
      companyId: companyId,
      settings: {
        allowAnonymous: true,
        requireLogin: false,
        maxSubmissions: null,
        expirationDate: null
      }
    }
    
    mockForms.push(newForm)
    return { data: newForm }
  },

  updateForm: async (companyId: string, formId: string, formData: any) => {
    await simulateNetworkDelay()
    
    const formIndex = mockForms.findIndex(f => f.id === formId && f.companyId === companyId)
    if (formIndex === -1) {
      throw new Error('Form not found')
    }
    
    mockForms[formIndex] = {
      ...mockForms[formIndex],
      ...formData,
      updatedAt: new Date().toISOString()
    }
    
    return { data: mockForms[formIndex] }
  },

  deleteForm: async (companyId: string, formId: string) => {
    await simulateNetworkDelay()
    
    const formIndex = mockForms.findIndex(f => f.id === formId && f.companyId === companyId)
    if (formIndex === -1) {
      throw new Error('Form not found')
    }
    
    mockForms.splice(formIndex, 1)
    return { data: { success: true } }
  },

  // Submissions endpoints
  getSubmissions: async (companyId: string, params?: { formId?: string; page?: number; size?: number }) => {
    await simulateNetworkDelay()
    
    let filteredSubmissions = mockSubmissions.filter(sub => {
      const form = findById(mockForms, sub.formId)
      return form && form.companyId === companyId
    })
    
    if (params?.formId) {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.formId === params.formId)
    }
    
    const page = params?.page || 1
    const size = params?.size || 10
    const start = (page - 1) * size
    const end = start + size
    const paginatedSubmissions = filteredSubmissions.slice(start, end)
    
    return {
      data: paginatedSubmissions,
      pagination: {
        page,
        size,
        total: filteredSubmissions.length,
        totalPages: Math.ceil(filteredSubmissions.length / size)
      }
    }
  },

  getSubmission: async (companyId: string, submissionId: string) => {
    await simulateNetworkDelay()
    
    const submission = findById(mockSubmissions, submissionId)
    if (!submission) {
      throw new Error('Submission not found')
    }
    
    const form = findById(mockForms, submission.formId)
    if (!form || form.companyId !== companyId) {
      throw new Error('Submission not found')
    }
    
    return { data: submission }
  },

  // Users endpoints
  getUsers: async (companyId: string) => {
    await simulateNetworkDelay()
    
    const companyUsers = filterByCompany(mockUsers, companyId)
    return {
      data: companyUsers,
      pagination: {
        page: 1,
        size: 10,
        total: companyUsers.length,
        totalPages: Math.ceil(companyUsers.length / 10)
      }
    }
  },

  getUser: async (companyId: string, userId: string) => {
    await simulateNetworkDelay()
    
    const user = findById(mockUsers, userId)
    if (!user || user.companyId !== companyId) {
      throw new Error('User not found')
    }
    
    return { data: user }
  },

  createUser: async (companyId: string, userData: any) => {
    await simulateNetworkDelay()
    
    const newUser: MockUser = {
      id: `user-${uuidv4()}`,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      companyId,
      companyName: 'Affluo Inc',
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=228B22&color=fff`,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    return { data: newUser }
  },

  updateUser: async (companyId: string, userId: string, userData: any) => {
    await simulateNetworkDelay()
    
    const userIndex = mockUsers.findIndex(u => u.id === userId && u.companyId === companyId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData
    }
    
    return { data: mockUsers[userIndex] }
  },

  deleteUser: async (companyId: string, userId: string) => {
    await simulateNetworkDelay()
    
    const userIndex = mockUsers.findIndex(u => u.id === userId && u.companyId === companyId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    mockUsers.splice(userIndex, 1)
    return { data: { success: true } }
  },

  // Teams endpoints
  getTeams: async (companyId: string) => {
    await simulateNetworkDelay()
    
    return {
      data: mockTeams,
      pagination: {
        page: 1,
        size: 10,
        total: mockTeams.length,
        totalPages: Math.ceil(mockTeams.length / 10)
      }
    }
  },

  getTeam: async (companyId: string, teamId: string) => {
    await simulateNetworkDelay()
    
    const team = findById(mockTeams, teamId)
    if (!team) {
      throw new Error('Team not found')
    }
    
    return { data: team }
  },

  // Lists endpoints
  getLists: async (companyId: string) => {
    await simulateNetworkDelay()
    
    // For now, return all lists (in real app, would filter by company)
    return {
      data: mockLists,
      pagination: {
        page: 1,
        size: 10,
        total: mockLists.length,
        totalPages: Math.ceil(mockLists.length / 10)
      }
    }
  },

  getList: async (companyId: string, listId: string) => {
    await simulateNetworkDelay()
    
    const list = findById(mockLists, listId)
    if (!list) {
      throw new Error('List not found')
    }
    
    return { data: list }
  },

  createList: async (companyId: string, listData: any) => {
    await simulateNetworkDelay()
    
    const newList: MockList = {
      id: `list-${uuidv4()}`,
      name: listData.name,
      description: listData.description,
      fields: listData.fields || [],
      items: listData.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockLists.push(newList)
    return { data: newList }
  },

  updateList: async (companyId: string, listId: string, listData: any) => {
    await simulateNetworkDelay()
    
    const listIndex = mockLists.findIndex(l => l.id === listId)
    if (listIndex === -1) {
      throw new Error('List not found')
    }
    
    mockLists[listIndex] = {
      ...mockLists[listIndex],
      ...listData,
      updatedAt: new Date().toISOString()
    }
    
    return { data: mockLists[listIndex] }
  },

  deleteList: async (companyId: string, listId: string) => {
    await simulateNetworkDelay()
    
    const listIndex = mockLists.findIndex(l => l.id === listId)
    if (listIndex === -1) {
      throw new Error('List not found')
    }
    
    mockLists.splice(listIndex, 1)
    return { data: { success: true } }
  },

  // WebSocket mock
  getWebSocketUrl: () => {
    return 'ws://localhost:8080/ws/sync?token=mock-token'
  }
}

// Reset mock data (useful for testing)
export const resetMockData = () => {
  mockUsers = generateMockUsers()
  mockForms = generateMockForms()
  mockSubmissions = generateMockSubmissions()
  mockTeams = generateMockTeams()
  mockLists = generateMockLists()
}
