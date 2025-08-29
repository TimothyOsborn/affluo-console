import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, User, Form, FormSubmission } from '../types';

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          this.token = null;
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'An error occurred',
        code: error.response.data.code,
        details: error.response.data.details,
      };
    }
    return {
      message: error.message || 'Network error occurred',
    };
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Authentication
  async login(username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/auth/login', { username, password });
    return response.data;
  }

  async validateToken(): Promise<ApiResponse<boolean>> {
    const response = await this.client.get('/auth/validate');
    return response.data;
  }

  // Forms
  async getForms(companyId: string): Promise<ApiResponse<Form[]>> {
    const response = await this.client.get(`/companies/${companyId}/forms`);
    return response.data;
  }

  async getForm(companyId: string, formId: string): Promise<ApiResponse<Form>> {
    const response = await this.client.get(`/companies/${companyId}/forms/${formId}`);
    return response.data;
  }

  async createForm(companyId: string, form: Partial<Form>): Promise<ApiResponse<Form>> {
    const response = await this.client.post(`/companies/${companyId}/forms`, form);
    return response.data;
  }

  async updateForm(companyId: string, formId: string, form: Partial<Form>): Promise<ApiResponse<Form>> {
    const response = await this.client.put(`/companies/${companyId}/forms/${formId}`, form);
    return response.data;
  }

  async deleteForm(companyId: string, formId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/companies/${companyId}/forms/${formId}`);
    return response.data;
  }

  // Submissions
  async getSubmissions(companyId: string): Promise<ApiResponse<FormSubmission[]>> {
    const response = await this.client.get(`/companies/${companyId}/submissions`);
    return response.data;
  }

  async getSubmission(companyId: string, submissionId: string): Promise<ApiResponse<FormSubmission>> {
    const response = await this.client.get(`/companies/${companyId}/submissions/${submissionId}`);
    return response.data;
  }

  async submitForm(companyId: string, submission: Partial<FormSubmission>): Promise<ApiResponse<FormSubmission>> {
    const response = await this.client.post(`/companies/${companyId}/submissions`, submission);
    return response.data;
  }

  async updateSubmission(
    companyId: string,
    submissionId: string,
    submission: Partial<FormSubmission>
  ): Promise<ApiResponse<FormSubmission>> {
    const response = await this.client.put(`/companies/${companyId}/submissions/${submissionId}`, submission);
    return response.data;
  }
}

// Create a default instance
export const apiClient = new ApiClient(process.env.API_BASE_URL || 'http://localhost:8080/api/v1');
