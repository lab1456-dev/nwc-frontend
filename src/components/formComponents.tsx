import React from 'react';

/**
 * FormInput - Reusable form input component with label and error handling
 */
interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  type?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error,
  helpText,
  type = 'text'
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-cyan-200 mb-2 font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        placeholder={placeholder}
        disabled={disabled}
      />
      {helpText && <p className="text-cyan-200/70 text-sm mt-1">{helpText}</p>}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

/**
 * FormSelect - Reusable select component with label and error handling
 */
interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error,
  helpText
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-cyan-200 mb-2 font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <p className="text-cyan-200/70 text-sm mt-1">{helpText}</p>}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

/**
 * SubmitButton - Reusable submit button with loading state
 */
interface SubmitButtonProps {
  onClick?: () => void;
  isLoading: boolean;
  disabled?: boolean;
  text: string;
  loadingText?: string;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
  text,
  loadingText = 'Processing...',
  className = ''
}) => {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
        ${isLoading || disabled
          ? 'bg-cyan-900 cursor-not-allowed' 
          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
        } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </div>
      ) : (
        text
      )}
    </button>
  );
};

/**
 * ErrorMessage - Reusable error message component
 */
interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <p className="text-red-400 mt-2">{message}</p>
  );
};

/**
 * SuccessMessage - Reusable success message component with action button
 */
interface SuccessMessageProps {
  title: string;
  message?: string;
  buttonText: string;
  onButtonClick: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  buttonText,
  onButtonClick
}) => {
  return (
    <div className="text-center">
      <div className="text-green-400 text-xl mb-4">
        {title}
      </div>
      {message && (
        <div className="text-cyan-200 mb-6">
          {message}
        </div>
      )}
      <button
        onClick={onButtonClick}
        className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
      >
        {buttonText}
      </button>
    </div>
  );
};
