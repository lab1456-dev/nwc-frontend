import React from 'react';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';
import { useCrowForm } from '../../hooks/useCrowForm';
import { useApiRequest } from '../../hooks/useApiRequest';
import { API_CONFIG, buildApiUrl } from '../../services/apiService';
import { 
  PageContainer, 
  PageHeader, 
  ContentCard 
} from '../../components/layoutComponents';
import { 
  FormInput, 
  ErrorMessage 
} from '../../components/formComponents';

/**
 * Interface for Retire form data
 */
interface RetireFormData {
  crow_id: string;
  site_id: string;
  confirmation_text: string;
}

/**
 * Retire component - Handles permanently removing a Crow from service
 */
const Retire: React.FC = () => {
  // API URL for retirement
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.RETIRE);
  
  // Initialize the API request hook
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess,
    setError
  } = useApiRequest(apiUrl);
  
  // Initialize the form hook with validation rules
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm 
  } = useCrowForm<RetireFormData>(
    {
      crow_id: '',
      site_id: '',
      confirmation_text: ''
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
      site_id: { required: true, message: 'Site ID is required' },
      confirmation_text: { required: true, message: 'Confirmation text is required' }
    }
  );

  // Check if the form is valid for submission (including confirmation text)
  const isFormValid = values.crow_id && 
                     values.site_id && 
                     values.confirmation_text === `RETIRE-${values.crow_id}`;

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate basic form inputs
    if (!validateForm()) {
      return;
    }
    
    // Additional validation for confirmation text
    if (values.confirmation_text !== `RETIRE-${values.crow_id}`) {
      setError('Please enter the correct confirmation text');
      return;
    }
    
    // Create request headers with Device authentication
    const headers = {
      'Authorization': `Device ${values.crow_id}`,
      'step': 'retire'
    };
    
    // Make the API request
    await makeRequest(
      { 
        crow_id: values.crow_id,
        site_id: values.site_id
      },
      headers
    );
  };

  /**
   * Handle reset after successful submission
   */
  const handleReset = () => {
    setSuccess(false);
    resetForm();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Retire a Crow"
        subtitle="Permanently remove a Crow from service"
        warningMessage="Warning: This action is irreversible without CLS assistance"
        warningDetails="Only personnel with elevated privileges should perform this action"
      />

      <ContentCard>
        {success ? (
          <div className="text-center">
            <div className="text-green-400 text-xl mb-4">
              Crow successfully retired
            </div>
            <div className="text-cyan-200 mb-6">
              The Crow ID has been permanently removed from active service in the Crow Management System.
              If the physical device is recoverable, it would need to go through the provisioning process 
              again with a new Crow ID.
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Retire Another Crow
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="crow_id"
              label="Crow ID"
              value={values.crow_id}
              onChange={(value) => handleChange('crow_id', value)}
              placeholder="Enter Crow ID"
              disabled={isLoading}
              error={errors.crow_id}
            />
            
            <FormInput
              id="site_id"
              label="Site ID"
              value={values.site_id}
              onChange={(value) => handleChange('site_id', value)}
              placeholder="Enter site ID"
              disabled={isLoading}
              error={errors.site_id}
            />
            
            <div className="border-t border-cyan-900/30 pt-4 mt-4">
              <div className="bg-red-900/20 border border-red-700/30 rounded-md p-4 mb-4">
                <p className="text-red-200 font-medium">
                  Retirement Confirmation
                </p>
                <p className="text-red-200/80 text-sm mt-1">
                  To confirm retirement, please type "RETIRE-" followed by the Crow ID
                  (Example: RETIRE-ABC123)
                </p>
              </div>
              
              <label htmlFor="confirmation_text" className="block text-cyan-200 mb-2 font-medium">
                Confirmation Text
              </label>
              <input
                type="text"
                id="confirmation_text"
                value={values.confirmation_text}
                onChange={(e) => handleChange('confirmation_text', e.target.value)}
                className="w-full bg-slate-800/50 border border-red-700/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder={values.crow_id ? `RETIRE-${values.crow_id}` : "Enter confirmation text"}
                disabled={isLoading}
              />
              {errors.confirmation_text && <p className="text-red-400 text-sm mt-1">{errors.confirmation_text}</p>}
            </div>
            
            <ErrorMessage message={error} />
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
                  ${(isLoading || !isFormValid)
                    ? 'bg-red-900/50 cursor-not-allowed text-gray-300' 
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Permanently Retire Crow'
                )}
              </button>
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Retire" />
    </PageContainer>
  );
};

export default Retire;