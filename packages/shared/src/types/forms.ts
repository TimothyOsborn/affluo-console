export interface FormField {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: Record<string, any>;
  options?: Array<{ label: string; value: string }>;
  order: number;
}

export interface Form {
  id: string;
  companyId: string;
  name: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields: FormField[];
  settings?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  companyId: string;
  formId: string;
  submittedBy: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  data: Record<string, any>;
  metadata?: Record<string, any>;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: FormField[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}
