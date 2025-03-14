import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';
import { useCrowForm } from '../../hooks/useCrowForm';
import { useAuthenticatedRequest } from '../../hooks/useAuthenticatedRequest';
import { API_CONFIG } from '../../services/apiService';
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
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Use the authenticated request hook with the main controller endpoint
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess,
    data
  } = useAuthenticatedRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS,
    ['Operators', 'Administrators'],
    true // Bypass group check temporarily
  );
  
  // Check for authentication
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { returnUrl: '/receive' } });
      return;
    }

    // Temporary debugging to see user object
    console.log('User object in Receive:', user);
    
  }, [isAuthenticated, user, navigate]);
  
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
      crow_id: { 
        required: true, 
        message: 'Crow ID is required'
      },
      site_id: { 
        required: true, 
        message: 'Site ID is required'
      }
    }
  );

  /**
   * Custom validation for form values
   */
  const customValidate = () => {
    const newErrors: Record<string, string> = {};
    
    if (values.crow_id && values.crow_id.length < 2) {
      newErrors.crow_id = 'Crow ID must be at least 2 characters';
    }
    
    if (values.site_id && values.site_id.length < 2) {
      newErrors.site_id = 'Site ID must be at least 2 characters';
    }
    
    // If there are errors, return false
    if (Object.keys(newErrors).length > 0) {
      // Update form errors
      Object.keys(newErrors).forEach(key => {
        handleChange(key as keyof CrowFormData, values[key as keyof CrowFormData] || '');
      });
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Perform both custom validation and form validation
    if (!customValidate() || !validateForm()) {
      return;
    }
    
    try {
      // Format the request body to match the expected Lambda controller format
      const requestData = {
        operation: API_CONFIG.OPERATIONS.RECEIVE, // Use the operation from API_CONFIG
        crow_id: values.crow_id?.toUpperCase().trim(),
        site_id: values.site_id?.toUpperCase().trim()
      };
      
      // Additional headers for the operation
      const additionalHeaders = {
        
      };
      
      console.log('Sending request data:', requestData);
      
      // Make the API request
      await makeRequest(
        requestData,
        additionalHeaders
      );
    } catch (err: any) {
      console.error('Error during form submission:', err);
      
      if (err.message?.includes('authentication')) {
        // Handle authentication-specific errors
        navigate('/login', { state: { returnUrl: '/receive', authError: err.message } });
      }
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
            message={data?.message || `Crow ${values.crow_id} has been received at site ${values.site_id}.`}
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
              helpText="ID will be converted to uppercase automatically"
            />
            
            <FormInput
              id="site_id"
              label="Site ID"
              value={values.site_id || ''}
              onChange={(value) => handleChange('site_id', value)}
              placeholder="Enter site ID"
              disabled={isLoading}
              error={errors.site_id}
              helpText="ID will be converted to uppercase automatically"
            />
            
            <ErrorMessage message={String(error || '')} />
            
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