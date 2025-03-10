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
  ErrorMessage, 
  SuccessMessage 
} from '../../components/formComponents';
import { CrowFormData } from '../../types/types';

/**
 * Provision component - Handles registering a new Crow in the system
 */
const Provision: React.FC = () => {
  // API URL for provisioning
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.PROVISION);
  
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
  } = useCrowForm<CrowFormData>(
    {
      crow_id: '',
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
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
    
    // Create request headers with API key and step information
    const headers = {
      'x-api-key': API_CONFIG.API_KEYS.PROVISION,
      'step': 'provisioned'
    };
    
    // Make the API request
    await makeRequest(
      { 
        crow_id: values.crow_id.toUpperCase(),
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
        title="Provision New Crow"
        subtitle="Image a new guardian to your network's Watch"
      />

      <ContentCard>
        {success ? (
          <SuccessMessage
            title="Crow successfully provisioned!"
            buttonText="Provision Another Crow"
            onButtonClick={handleReset}
          />
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
            
            <ErrorMessage message={error} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Provision Crow!"
                loadingText="Provisioning..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Provision" />
    </PageContainer>
  );
};

export default Provision;