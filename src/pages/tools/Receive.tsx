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
 * Receive component - Handles registering a Crow at a specific site
 */
const Receive: React.FC = () => {
  // API URL for receiving
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.RECEIVE);
  
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
  } = useCrowForm<Partial<CrowFormData>>(
    {
      crow_id: '',
      site_id: ''
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
      site_id: { required: true, message: 'Site ID is required' }
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
      'step': 'received'
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
        title="Receive Crow"
        subtitle="Acquire site information from your guardian"
      />

      <ContentCard>
        {success ? (
          <SuccessMessage
            title="Crow successfully received!"
            buttonText="Receive Another Crow"
            onButtonClick={handleReset}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="crow_id"
              label="Crow ID (scan the QR Code with the Crow image)"
              value={values.crow_id || ''}
              onChange={(value) => handleChange('crow_id', value)}
              placeholder="Enter Crow ID"
              disabled={isLoading}
              error={errors.crow_id}
            />
            
            <FormInput
              id="site_id"
              label="Site ID"
              value={values.site_id || ''}
              onChange={(value) => handleChange('site_id', value)}
              placeholder="Enter site ID"
              disabled={isLoading}
              error={errors.site_id}
            />
            
            <ErrorMessage message={error} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Receive Your Crow!"
                loadingText="Processing..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Receive" />
    </PageContainer>
  );
};

export default Receive;