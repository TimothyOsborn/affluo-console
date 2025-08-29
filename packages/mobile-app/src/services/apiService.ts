import { Form, FormSubmission } from '../types/navigation';

class ApiService {
  private baseURL = 'http://localhost:8080/api/v1';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Forms
  async getForms(companyId: string): Promise<Form[]> {
    return this.request<Form[]>(`/companies/${companyId}/forms`);
  }

  async getForm(companyId: string, formId: string): Promise<Form> {
    return this.request<Form>(`/companies/${companyId}/forms/${formId}`);
  }

  // Submissions
  async getSubmissions(companyId: string): Promise<FormSubmission[]> {
    return this.request<FormSubmission[]>(`/companies/${companyId}/submissions`);
  }

  async getSubmissionsByForm(
    companyId: string,
    formId: string
  ): Promise<FormSubmission[]> {
    return this.request<FormSubmission[]>(
      `/companies/${companyId}/submissions?formId=${formId}`
    );
  }

  async submitForm(
    companyId: string,
    submission: Omit<FormSubmission, 'id' | 'submittedAt'>
  ): Promise<FormSubmission> {
    return this.request<FormSubmission>(
      `/companies/${companyId}/submissions`,
      {
        method: 'POST',
        body: JSON.stringify(submission),
      }
    );
  }

  async getSubmission(
    companyId: string,
    submissionId: string
  ): Promise<FormSubmission> {
    return this.request<FormSubmission>(
      `/companies/${companyId}/submissions/${submissionId}`
    );
  }
}

export const apiService = new ApiService();
