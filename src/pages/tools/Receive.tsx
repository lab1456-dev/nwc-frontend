import React, { useContext, useEffect, useState } from 'react';
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
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  // Switch to useAuthenticatedRequest which handles tokens automatically
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess,
    data
  } = useAuthenticatedRequest(API_CONFIG.ENDPOINTS.RECEIVE);
  
  // Check for authentication and group membership
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { returnUrl: '/receive' } });
      return;
    }

    // Check for required group membership (Operators or Administrators)
    const userGroups = user?.['cognito:groups'] || [];
    const requiredGroups = ['Operators', 'Administrators'];
    
    // Convert to array if it's a string (comma-separated)
    const groupsArray = typeof userGroups === 'string' 
      ? userGroups.split(',').map(g => g.trim())
      : userGroups;
    
    // Check if user has any of the required groups
    const hasRequiredGroup = requiredGroups.some(group => 
      groupsArray.includes(group)
    );
    
    setIsAuthorized(hasRequiredGroup);
    
    // Redirect to unauthorized page if not in required groups
    if (!hasRequiredGroup) {
      navigate('/unauthorized', { 
        state: { 
          requiredGroups: requiredGroups,
          currentGroups: groupsArray 
        } 
      });
    }
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
        message: 'Crow ID is required',
        // Additional validation to match expected format
        validate: (value) => {
          if (value.length < 2) return 'Crow ID must be at least 2 characters';
          return '';
        }
      },
      site_id: { 
        required: true, 
        message: 'Site ID is required',
        validate: (value) => {
          if (value.length < 2) return 'Site ID must be at least 2 characters';
          return '';
        }
      }
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
    
    try {
      // Format the request body to match the expected Lambda controller format
      const requestData = {
        operation: 'receive', // Required by the controller Lambda
        crow_id: values.crow_id?.toUpperCase().trim(),
        site_id: values.site_id?.toUpperCase().trim()
      };
      
      // Additional headers for the operation
      const additionalHeaders = {
        'step': 'received'
      };
      
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

  // Display loading state while checking authorization
  if (!isAuthenticated || isAuthorized === undefined) {
    return (
      <PageContainer>
        <PageHeader
          title="Checking Permissions"
          subtitle="Please wait while we verify your access..."
        />
        <ContentCard>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

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