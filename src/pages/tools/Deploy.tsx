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
 * Deploy component - Handles associating a Crow with a specific work cell
 */
const Deploy: React.FC = () => {
  // API URL for deployment
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.DEPLOY);
  
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
      site_id: '',
      work_cell_id: '',
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
      site_id: { required: true, message: 'Site ID is required' },
      work_cell_id: { required: true, message: 'Work Cell ID is required' },
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
      'step': 'deployed'
    };
    
    // Make the API request
    await makeRequest(
      { 
        crow_id: values.crow_id,
        site_id: values.site_id,
        work_cell_id: values.work_cell_id
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
        title="Deploy your Crow"
        subtitle="Associate your Crow with a specific Work Cell"
      />

      <ContentCard>
        {success ? (
          <SuccessMessage
            title="Crow successfully deployed!"
            buttonText="Deploy Another Crow to another Work Cell"
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
            
            <FormInput
              id="site_id"
              label="Site ID"
              value={values.site_id || ''}
              onChange={(value) => handleChange('site_id', value)}
              placeholder="Enter site ID"
              disabled={isLoading}
              error={errors.site_id}
            />
            
            <FormInput
              id="work_cell_id"
              label="Work Cell ID"
              value={values.work_cell_id || ''}
              onChange={(value) => handleChange('work_cell_id', value)}
              placeholder="Enter work cell ID"
              disabled={isLoading}
              error={errors.work_cell_id}
            />
            
            <ErrorMessage message={String(error || '')} />

            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Deploy Crow!"
                loadingText="Processing..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Deploy" />
    </PageContainer>
  );
};

export default Deploy;
