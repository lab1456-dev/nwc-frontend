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
  SubmitButton, 
  ErrorMessage
} from '../../components/formComponents';

/**
 * Interface for Transfer form data
 */
interface TransferFormData {
  crow_id: string;
  current_site_id: string;
}

/**
 * Transfer component - Handles preparing a Crow to be moved to a new facility
 */
const Transfer: React.FC = () => {
  // API URL for transfer
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TRANSFER);
  
  // Initialize the API request hook
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess 
  } = useApiRequest(apiUrl);
  
  // Initialize the form hook with validation rules
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm 
  } = useCrowForm<TransferFormData>(
    {
      crow_id: '',
      current_site_id: ''
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
      current_site_id: { required: true, message: 'Current Site ID is required' }
    }
  );

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Create request headers with Crow authentication
    const headers = {
      'Authorization': `Crow ${values.crow_id}`,
      'step': 'transfer'
    };
    
    // Make the API request
    await makeRequest(
      { 
        crow_id: values.crow_id,
        current_site_id: values.current_site_id
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
        title="Transfer your Crow"
        subtitle="Prepare a Crow to be moved to a new facility"
      />

      <ContentCard>
        {success ? (
          <div className="text-center">
            <div className="text-green-400 text-xl mb-4">
              Crow successfully prepared for transfer!
            </div>
            <div className="text-cyan-200 mb-6">
              The Crow has been disassociated from its current facility and returned to the "provisioned" state.
              It is now ready to be shipped to a new facility where it can be received through the standard process.
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Transfer Another Crow
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
              id="current_site_id"
              label="Current Site ID"
              value={values.current_site_id}
              onChange={(value) => handleChange('current_site_id', value)}
              placeholder="Enter current site ID"
              disabled={isLoading}
              error={errors.current_site_id}
            />
            
            <ErrorMessage message={error} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Prepare for Transfer"
                loadingText="Processing..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Transfer" />
    </PageContainer>
  );
};

export default Transfer;