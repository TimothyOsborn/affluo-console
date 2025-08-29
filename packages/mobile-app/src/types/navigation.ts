export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  FormsList: undefined;
  FormFiller: { formId: string; formName: string };
  Submissions: undefined;
};

export type FormField = {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: Record<string, any>;
  options?: Array<{ label: string; value: string }>;
  order: number;
};

export type Form = {
  id: string;
  name: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields: FormField[];
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type FormSubmission = {
  id: string;
  formId: string;
  submittedBy: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  data: Record<string, any>;
  metadata?: Record<string, any>;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: string;
  companyName: string;
};
