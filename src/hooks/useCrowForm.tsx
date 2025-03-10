import { useState } from 'react';

/**
 * Types for form field validation
 */
interface FieldValidation {
  required?: boolean;
  message?: string;
}

interface FieldValidations {
  [key: string]: FieldValidation;
}

/**
 * Custom hook for managing form state and validation
 * 
 * @param initialValues - Initial form field values
 * @param validations - Validation rules for form fields
 */
export const useCrowForm = <T extends Record<string, any>>(
  initialValues: T,
  validations: FieldValidations = {}
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Update a form field value
   * 
   * @param field - The field name to update
   * @param value - The new value
   */
  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  /**
   * Reset the form to initial values
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  /**
   * Validate all form fields
   * 
   * @returns true if valid, false if invalid
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Check required fields
    Object.entries(validations).forEach(([field, validation]) => {
      if (validation.required && !values[field as keyof T]) {
        newErrors[field] = validation.message || `${field} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    resetForm,
    validateForm,
    setValues,
    setErrors
  };
};
