/**
 * Provision.tsx
 * 
 * BARE BONES IMPLEMENTATION
 * 
 * This is a stripped-down version with:
 * - Simple text inputs only
 * - No dropdown menus or API calls for populating forms
 * - No CSV upload functionality
 * - Only the final submit API call
 * 
 * @author Development Team
 * @version 1.0.0
 * @date March 2025
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * =====================================================================
 * TYPE DEFINITIONS
 * =====================================================================
 */

/**
 * Form data for provisioning a crow
 */
interface ProvisionFormData {
  crow_id: string;
  manufacturer: string;
  model: string;
  cpu: string;
  ram: string;
  storage: string;
  os_version: string;
}

/**
 * Form field errors
 */
interface FormErrors {
  [key: string]: string;
}

/**
 * API Response interface
 */
interface ApiResponse {
  statusCode: number;
  body: {
    success: boolean;
    message?: string;
    requestId?: string;
    error?: {
      type: string;
      message: string;
    };
    data?: {
      crow?: {
        crow_id: string;
        status: string;
      };
    };
  };
}

/**
 * =====================================================================
 * API CONFIGURATION
 * =====================================================================
 */

/**
 * API Configuration - Centralized API settings
 */
const API_CONFIG = {
  // Base URL for API endpoints
  BASE_URL: import.meta.env.VITE_API_URL || 'https://5j53c4vz9b.execute-api.us-east-1.amazonaws.com/prod',
  
  // API endpoints
  ENDPOINTS: {
    MANAGE_CROW_WORKFLOWS: 'manageCrowWorkflows',
  },
  
  // Operation types
  OPERATIONS: {
    PROVISION: 'provision',
  },
  
  // Function types
  FUNCTIONS: {
    PROVISION_SINGLE: 'single',
    PROVISION_MULTIPLE: 'multiple',
  }
};

/**
 * =====================================================================
 * PROVISION COMPONENT
 * =====================================================================
 */

const Provision: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthToken, user } = useContext(AuthContext);
  
  /**
   * =====================================================================
   * STATE MANAGEMENT
   * =====================================================================
   */
  
  // Form data state
  const [formData, setFormData] = useState<ProvisionFormData>({
    crow_id: '',
    manufacturer: '',
    model: '',
    cpu: '',
    ram: '',
    storage: '',
    os_version: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // API error message
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Success state
  const [success, setSuccess] = useState<boolean>(false);
  const [successCrowId, setSuccessCrowId] = useState<string>('');
  
  /**
   * =====================================================================
   * FORM HANDLING METHODS
   * =====================================================================
   */
  
  /**
   * Handle form field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Check required fields
    if (!formData.crow_id) {
      newErrors.crow_id = 'Crow ID is required';
    } else if (!/^[A-Z0-9\-]{3,50}$/.test(formData.crow_id)) {
      newErrors.crow_id = 'Crow ID must be 3-50 uppercase alphanumeric characters or dashes';
    }
    
    if (!formData.manufacturer) {
      newErrors.manufacturer = 'Manufacturer is required';
    }
    
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.cpu) {
      newErrors.cpu = 'CPU is required';
    }
    
    if (!formData.ram) {
      newErrors.ram = 'RAM is required';
    }
    
    if (!formData.storage) {
      newErrors.storage = 'Storage is required';
    }
    
    if (!formData.os_version) {
      newErrors.os_version = 'OS Version is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Call the API to provision a crow
   */
  const callProvisionApi = async (): Promise<ApiResponse> => {
    // Get authentication token
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Build URL
    const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
      ? API_CONFIG.BASE_URL.slice(0, -1)
      : API_CONFIG.BASE_URL;
    const url = `${baseUrl}/${API_CONFIG.ENDPOINTS.MANAGE_CROW_WORKFLOWS}`;
    
    // Extract username from user context
    const username = user?.username || 'unknown user';
    
    // Build request
    const request = {
      operation: API_CONFIG.OPERATIONS.PROVISION,
      body: {
        function: API_CONFIG.FUNCTIONS.PROVISION_SINGLE,
        crow_id: formData.crow_id,
        manufacturer: formData.manufacturer,
        model: formData.model,
        cpu: formData.cpu,
        ram: formData.ram,
        storage: formData.storage,
        os_version: formData.os_version,
        notes: `Provisioned through web interface by ${username}`
      }
    };
    
    // Headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Make API call
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    });
    
    // Parse response
    const responseData = await response.json();
    return responseData as ApiResponse;
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Check authentication
      if (!isAuthenticated) {
        navigate('/signin', { state: { returnUrl: '/provision' } });
        return;
      }
      
      // Call API
      const response = await callProvisionApi();
      
      // Handle successful response
      if (response && response.body && response.body.success) {
        setSuccess(true);
        setSuccessCrowId(formData.crow_id);
      } else {
        throw new Error(response.body.error?.message || 'Provision operation failed - no response received');
      }
    } catch (error) {
      console.error('Error during provision:', error);
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle reset after successful submission
   */
  const handleReset = () => {
    setSuccess(false);
    setSuccessCrowId('');
    setApiError(null);
    
    // Reset form data
    setFormData({
      crow_id: '',
      manufacturer: '',
      model: '',
      cpu: '',
      ram: '',
      storage: '',
      os_version: '',
    });
    
    // Clear errors
    setErrors({});
  };
  
  /**
   * =====================================================================
   * UI RENDERING
   * =====================================================================
   */
  
  /**
   * Render text input field
   */
  const renderTextInput = (
    name: keyof ProvisionFormData,
    label: string,
    placeholder: string = '',
  ) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-cyan-200 mb-2">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={isSubmitting}
        className={`w-full bg-slate-800/50 border rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
          errors[name] ? 'border-red-500' : 'border-cyan-900/50'
        }`}
      />
      {errors[name] && <p className="text-red-400 text-sm mt-1">{errors[name]}</p>}
    </div>
  );
  
  /**
   * Render success message
   */
  const renderSuccessMessage = () => (
    <div className="text-center">
      <div className="text-green-400 text-xl mb-4">
        Crow {successCrowId} successfully provisioned!
      </div>
      <div className="text-cyan-200 mb-6">
        The new Crow has been registered in the system and is ready to be received at a facility.
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
        >
          Provision Another Crow
        </button>
      </div>
    </div>
  );
  
  /**
   * =====================================================================
   * MAIN COMPONENT RENDER
   * =====================================================================
   */
  
  return (
    // Page Container
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Provision Crow
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200/80">
            Register a new guardian to your network's Watch
          </p>
        </div>
        
        {/* Content Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          {/* Success or Form */}
          {success ? (
            renderSuccessMessage()
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              {renderTextInput('crow_id', 'Crow ID', 'Enter Crow ID')}
              {renderTextInput('manufacturer', 'Manufacturer', 'Enter manufacturer')}
              {renderTextInput('model', 'Model', 'Enter model')}
              {renderTextInput('cpu', 'CPU', 'Enter CPU specifications')}
              {renderTextInput('ram', 'RAM', 'Enter RAM specifications')}
              {renderTextInput('storage', 'Storage', 'Enter storage specifications')}
              {renderTextInput('os_version', 'OS Version', 'Enter OS version')}
              
              {/* Error Message */}
              {apiError && (
                <div className="text-red-400 my-4 p-3 border border-red-500/50 bg-red-900/20 rounded-md">
                  {apiError}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
                    ${isSubmitting
                      ? 'bg-cyan-900 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Provisioning...
                    </div>
                  ) : (
                    "Provision Crow"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Provision;