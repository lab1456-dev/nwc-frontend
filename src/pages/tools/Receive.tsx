import React, { useContext } from 'react';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';
import { useCrowForm } from '../../hooks/useCrowForm';
import { useAuthenticatedRequest } from '../../hooks/useAuthenticatedRequest';
import { API_CONFIG, buildApiUrl } from '../../services/apiService';
import { AuthContext } from '../../contexts/AuthContext';
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
  
  // Get auth context for user information if needed
  const { user } = useContext(AuthContext);
  
  // Initialize the authenticated API request hook
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess 
  } = useAuthenticatedRequest(apiUrl);
  
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
    
    // Define any additional headers needed for this specific API
    const additionalHeaders: Record<string, string> = {
      'step': 'received'
    };
    
    // Add user context headers if available
    if (user) {
      if (user.email) {
        additionalHeaders['x-user-email'] = user.email;
      }
      if (user.sub) {
        additionalHeaders['x-user-sub'] = user.sub;
      }
    }
    
    // Make the authenticated API request
    const result = await makeRequest(
      { 
        crow_id: values.crow_id,
        site_id: values.site_id
      },
      additionalHeaders
    );
    
    // Optionally handle specific response details
    if (result.success) {
      console.log('Crow successfully received:', result.data);
    }
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
            
            <ErrorMessage message={error || ''} />
            
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