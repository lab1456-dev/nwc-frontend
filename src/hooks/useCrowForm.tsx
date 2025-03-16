// Enhanced version of the useCrowForm hook that handles dynamic validation rules
import { useState, useEffect } from 'react';

interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

export function useCrowForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [rules, setRules] = useState<ValidationRules<T>>(validationRules);
  
  // Update validation rules when they change externally
  useEffect(() => {
    setRules(validationRules);
  }, [validationRules]);

  // Handle field change
  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Validate a single field
  const validateField = (field: keyof T): boolean => {
    const value = values[field];
    const rule = rules[field];
    
    if (!rule) return true;
    
    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      setErrors(prev => ({ ...prev, [field]: rule.message || 'This field is required' }));
      return false;
    }
    
    // Check pattern
    if (rule.pattern && value && !rule.pattern.test(value)) {
      setErrors(prev => ({ ...prev, [field]: rule.message || 'Invalid format' }));
      return false;
    }
    
    // Check min/max for numbers
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        setErrors(prev => ({ ...prev, [field]: rule.message || `Minimum value is ${rule.min}` }));
        return false;
      }
      
      if (rule.max !== undefined && value > rule.max) {
        setErrors(prev => ({ ...prev, [field]: rule.message || `Maximum value is ${rule.max}` }));
        return false;
      }
    }
    
    // Check min/max for strings
    if (typeof value === 'string') {
      if (rule.min !== undefined && value.length < rule.min) {
        setErrors(prev => ({ ...prev, [field]: rule.message || `Minimum length is ${rule.min}` }));
        return false;
      }
      
      if (rule.max !== undefined && value.length > rule.max) {
        setErrors(prev => ({ ...prev, [field]: rule.message || `Maximum length is ${rule.max}` }));
        return false;
      }
    }
    
    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      setErrors(prev => ({ ...prev, [field]: rule.message || 'Invalid value' }));
      return false;
    }
    
    return true;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    // Check each field with rules
    Object.keys(rules).forEach(key => {
      const field = key as keyof T;
      if (!validateField(field)) {
        isValid = false;
        // Preserve error message from validateField
        newErrors[field] = errors[field];
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validateField,
    validateForm,
    resetForm,
    setValues,
    setRules
  };
}