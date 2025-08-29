import { FormField } from '../types/forms';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FormValidator {
  static validateField(field: FormField, value: any): ValidationResult {
    const errors: string[] = [];

    // Required field validation
    if (field.required && (!value || value === '')) {
      errors.push(`${field.label} is required`);
      return { isValid: false, errors };
    }

    // Skip other validations if value is empty and not required
    if (!value || value === '') {
      return { isValid: true, errors: [] };
    }

    // Type-specific validation
    switch (field.type) {
      case 'email':
        if (!this.isValidEmail(value)) {
          errors.push(`${field.label} must be a valid email address`);
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`${field.label} must be a valid number`);
        }
        break;
    }

    // Custom validation rules
    if (field.validation) {
      const customErrors = this.validateCustomRules(field, value);
      errors.push(...customErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateForm(fields: FormField[], formData: Record<string, any>): ValidationResult {
    const errors: string[] = [];

    for (const field of fields) {
      const value = formData[field.id];
      const fieldValidation = this.validateField(field, value);
      errors.push(...fieldValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static validateCustomRules(field: FormField, value: any): string[] {
    const errors: string[] = [];
    const rules = field.validation || {};

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field.label} must be at least ${rules.minLength} characters long`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field.label} must be no more than ${rules.maxLength} characters long`);
    }

    // Min value validation (for numbers)
    if (rules.minValue && Number(value) < rules.minValue) {
      errors.push(`${field.label} must be at least ${rules.minValue}`);
    }

    // Max value validation (for numbers)
    if (rules.maxValue && Number(value) > rules.maxValue) {
      errors.push(`${field.label} must be no more than ${rules.maxValue}`);
    }

    // Pattern validation
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      errors.push(`${field.label} format is invalid`);
    }

    return errors;
  }
}

export class StringValidator {
  static isNotEmpty(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  static isValidLength(value: string, min: number, max?: number): boolean {
    if (value.length < min) return false;
    if (max && value.length > max) return false;
    return true;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

export class NumberValidator {
  static isPositive(value: number): boolean {
    return value > 0;
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static isInteger(value: number): boolean {
    return Number.isInteger(value);
  }
}
