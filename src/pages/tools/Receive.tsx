import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';
import { useCrowForm } from '../../hooks/useCrowForm';
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

// Import from the new API service
import { receiveCrow } from '../../services/api/userApi';
import { getSites } from '../../services/api/formApi';
import { Site } from '../../services/api/apiTypes';

/**
 * Receive component - Handles registering a Crow at a specific site
 */
const Receive: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthToken } = useContext(AuthContext);
  
  // State for API communication
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  
  // Check for authentication
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { returnUrl: '/receive' } });
      return;
    }
    
    // Load sites for dropdown (optional enhancement)
    const loadSites = async () => {
      try {
        setSitesLoading(true);
        const token = await getAuthToken();
        if (!token) return;
        
        const response = await getSites({ site_id: '*' }, token);
        if (response.success && response.data) {
          setSites(response.data.sites || []);
        }
      } catch (err) {
        console.error('Error loading sites:', err);
      } finally {
        setSitesLoading(false);
      }
    };
    
    loadSites();
  }, [isAuthenticated, getAuthToken, navigate]);
  
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
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/login', { state: { returnUrl: '/receive' } });
        return;
      }
      
      // Use the new receiveCrow function from userApi
      const response = await receiveCrow(
        {
          crow_id: values.crow_id?.toUpperCase().trim() || '',
          site_id: values.site_id?.toUpperCase().trim() || ''
        },
        token
      );
      
      if (response.success) {
        setSuccess(true);
        setResponseData(response.data);
      } else {
        setError(response.message || 'An error occurred during the receiving process.');
      }
    } catch (err: any) {
      console.error('Error during form submission:', err);
      setError(err.message || 'An unexpected error occurred.');
      
      if (err.message?.includes('authentication')) {
        // Handle authentication-specific errors
        navigate('/login', { state: { returnUrl: '/receive', authError: err.message } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle reset after successful submission
   */
  const handleReset = () => {
    setSuccess(false);
    setResponseData(null);
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
            message={responseData?.message || `Crow ${values.crow_id} has been received at site ${values.site_id}.`}
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
            
            {/* Optional enhancement: Use a select dropdown if sites are loaded */}
            {sites.length > 0 ? (
              <div>
                <label htmlFor="site_id" className="block text-cyan-200 mb-2 font-medium">
                  Site
                </label>
                <select
                  id="site_id"
                  value={values.site_id || ''}
                  onChange={(e) => handleChange('site_id', e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  disabled={isLoading || sitesLoading}
                >
                  <option value="">Select a site</option>
                  {sites.map((site) => (
                    <option key={site.site_id} value={site.site_id}>
                      {site.site_name} ({site.site_id})
                    </option>
                  ))}
                  <option value="custom">Enter Custom Site ID...</option>
                </select>
                {values.site_id === 'custom' && (
                  <FormInput
                    id="custom_site_id"
                    label="Custom Site ID"
                    value={values.site_id === 'custom' ? '' : values.site_id || ''}
                    onChange={(value) => handleChange('site_id', value)}
                    placeholder="Enter site ID"
                    disabled={isLoading}
                    error={errors.site_id}
                  />
                )}
                {errors.site_id && <p className="text-red-400 text-sm mt-1">{errors.site_id}</p>}
              </div>
            ) : (
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
            )}
            
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