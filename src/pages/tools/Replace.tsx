import React, { useState, useContext, useEffect } from 'react';
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
import { replaceCrow } from '../../services/api/userApi';
import { getCrows } from '../../services/api/formApi';
import { Crow } from '../../services/api/apiTypes';

/**
 * Interface for Replace form data
 */
interface ReplaceFormData extends Partial<CrowFormData> {
  existing_crow_id: string;
  new_crow_id: string;
}

/**
 * Replace component - Handles replacing a Crow with a new one
 */
const Replace: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthToken } = useContext(AuthContext);
  
  // State for API communication
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  
  // State for crow data operations
  const [crowLookupLoading, setCrowLookupLoading] = useState(false);
  const [availableCrows, setAvailableCrows] = useState<string[]>([]);
  const [isLoadingCrows, setIsLoadingCrows] = useState(false);
  
  // Initialize the form hook with validation rules
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm,
    setValues
  } = useCrowForm<ReplaceFormData>(
    {
      existing_crow_id: '',
      new_crow_id: '',
      crow_id: '', // Required by CrowFormData but not used directly
      site_id: '',
      work_cell_id: ''
    },
    {
      existing_crow_id: { required: true, message: 'Existing Crow ID is required' },
      new_crow_id: { required: true, message: 'New Crow ID is required' },
      site_id: { required: true, message: 'Site ID is required' },
      work_cell_id: { required: true, message: 'Work Cell ID is required' }
    }
  );

  // Check for authentication
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { returnUrl: '/replace' } });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Function to fetch Crow association data
   */
  const fetchCrowAssociation = async () => {
    if (!values.existing_crow_id.trim()) {
      return;
    }

    setCrowLookupLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/login', { state: { returnUrl: '/replace' } });
        return;
      }
      
      // Get information about the existing crow
      const response = await getCrows(
        {
          crow_id: values.existing_crow_id.trim(),
          status: 'deployed'
        },
        token
      );
      
      if (response.success && response.data && response.data.crows.length > 0) {
        const deployedCrow = response.data.crows[0];
        
        // Update form values with fetched data
        setValues(prev => ({
          ...prev,
          site_id: deployedCrow.site_id || '',
          work_cell_id: deployedCrow.work_cell_id || ''
        }));
        
        // After getting site info, fetch available Crows
        if (deployedCrow.site_id) {
          fetchNonDeployedCrows(deployedCrow.site_id);
        }
      } else {
        setError(response.message || 'Crow not found or not in deployed status');
        
        // Reset form values
        setValues(prev => ({
          ...prev,
          site_id: '',
          work_cell_id: ''
        }));
        
        setAvailableCrows([]);
      }
    } catch (err: any) {
      console.error('Error fetching Crow association:', err);
      setError('Error fetching Crow information: ' + (err.message || 'Unknown error'));
      
      // Reset form values
      setValues(prev => ({
        ...prev,
        site_id: '',
        work_cell_id: ''
      }));
      
      setAvailableCrows([]);
    } finally {
      setCrowLookupLoading(false);
    }
  };

  /**
   * Function to fetch non-deployed Crows by site
   */
  const fetchNonDeployedCrows = async (site: string) => {
    if (!site.trim()) {
      setAvailableCrows([]);
      return;
    }

    setIsLoadingCrows(true);
    
    try {
      const token = await getAuthToken();
      if (!token) return;
      
      // Get available crows at this site in 'received' status
      const response = await getCrows(
        {
          status: 'received',
          site_id: site
        },
        token
      );
      
      if (response.success && response.data) {
        const crowIds = response.data.crows.map((crow: Crow) => crow.crow_id);
        setAvailableCrows(crowIds);
        
        // If there's exactly one available Crow, select it automatically
        if (crowIds.length === 1) {
          handleChange('new_crow_id', crowIds[0]);
        } else {
          handleChange('new_crow_id', '');
        }
      } else {
        setAvailableCrows([]);
        handleChange('new_crow_id', '');
      }
    } catch (err) {
      console.error('Error fetching non-deployed Crows:', err);
      setAvailableCrows([]);
      handleChange('new_crow_id', '');
    } finally {
      setIsLoadingCrows(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/login', { state: { returnUrl: '/replace' } });
        return;
      }
      
      // Use the replaceCrow function from userApi
      const response = await replaceCrow(
        {
          existing_crow_id: values.existing_crow_id.trim(),
          new_crow_id: values.new_crow_id.trim(),
          site_id: values.site_id.trim(),
          work_cell_id: values.work_cell_id.trim()
        },
        token
      );
      
      if (response.success) {
        setSuccess(true);
        setResponseData(response.data);
      } else {
        setError(response.message || 'An error occurred during the replacement process.');
      }
    } catch (err: any) {
      console.error('Error during form submission:', err);
      setError(err.message || 'An unexpected error occurred.');
      
      if (err.message?.includes('authentication')) {
        // Handle authentication-specific errors
        navigate('/login', { state: { returnUrl: '/replace', authError: err.message } });
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
    setAvailableCrows([]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Replace your Crow"
        subtitle="Assign a new Crow to an existing Work Cell"
        warningMessage="Warning: This action will transfer protection to a new Crow"
        warningDetails="Ensure the new Crow is on-site and ready to be connected before proceeding"
      />

      <ContentCard>
        {success ? (
          <div className="text-center">
            <div className="text-green-400 text-xl mb-4">
              Crow successfully replaced!
            </div>
            <div className="text-cyan-200 mb-6">
              Please carefully disconnect the existing Crow's network cables one at a time and connect them to the new Crow. 
              Once connected to power, the new Crow will be ready within 15 minutes.
            </div>
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-md p-4 mb-6">
              <p className="text-amber-200 font-medium">
                Important Next Steps
              </p>
              <ol className="list-decimal ml-5 mt-2 text-amber-200/80 space-y-1">
                <li>Disconnect the public network cable from the existing Crow</li>
                <li>Connect it to the same port on the new Crow</li>
                <li>Disconnect the private network cable from the existing Crow</li>
                <li>Connect it to the same port on the new Crow</li>
                <li>Power on the new Crow</li>
              </ol>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Replace Another Crow
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Existing Crow ID with lookup button */}
            <div>
              <label htmlFor="existing_crow_id" className="block text-cyan-200 mb-2 font-medium">
                Existing Crow ID
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="existing_crow_id"
                    value={values.existing_crow_id}
                    onChange={(e) => handleChange('existing_crow_id', e.target.value)}
                    className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Enter existing Crow ID"
                    disabled={isLoading || crowLookupLoading}
                  />
                  {crowLookupLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="animate-spin h-5 w-5 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={fetchCrowAssociation}
                  disabled={!values.existing_crow_id.trim() || isLoading || crowLookupLoading}
                  className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
                    ${(!values.existing_crow_id.trim() || isLoading || crowLookupLoading)
                      ? 'bg-slate-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-cyan-700 hover:bg-cyan-600 text-white'
                    }`}
                >
                  Lookup
                </button>
              </div>
              <p className="text-amber-200/80 text-sm mt-1">
                This is the ID of the Crow currently protecting the work cell
              </p>
              {errors.existing_crow_id && <p className="text-red-400 text-sm mt-1">{errors.existing_crow_id}</p>}
            </div>
            
            {/* Site ID - Read only */}
            <FormInput
              id="site_id"
              label="Site ID"
              value={values.site_id || ''}
              onChange={(value) => handleChange('site_id', value)}
              placeholder="Site ID will be filled automatically"
              disabled={true}
              error={errors.site_id}
              helpText="Site ID is automatically retrieved from existing Crow association"
            />
            
            {/* Work Cell ID - Read only */}
            <FormInput
              id="work_cell_id"
              label="Work Cell ID"
              value={values.work_cell_id || ''}
              onChange={(value) => handleChange('work_cell_id', value)}
              placeholder="Work Cell ID will be filled automatically"
              disabled={true}
              error={errors.work_cell_id}
              helpText="Work Cell ID is automatically retrieved from existing Crow association"
            />
            
            {/* New Crow ID - Dynamic input/select */}
            <div>
              <label htmlFor="new_crow_id" className="block text-cyan-200 mb-2 font-medium">
                New Crow ID
              </label>
              <div className="relative">
                {availableCrows.length > 0 ? (
                  <select
                    id="new_crow_id"
                    value={values.new_crow_id}
                    onChange={(e) => handleChange('new_crow_id', e.target.value)}
                    className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    disabled={isLoading || isLoadingCrows}
                  >
                    <option value="">Select a Crow</option>
                    {availableCrows.map(crowId => (
                      <option key={crowId} value={crowId}>
                        {crowId}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="new_crow_id"
                    value={values.new_crow_id}
                    onChange={(e) => handleChange('new_crow_id', e.target.value)}
                    className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder={values.site_id ? "No available Crows at this site" : "Enter new Crow ID"}
                    disabled={isLoading || isLoadingCrows || (!!values.site_id && availableCrows.length === 0)}
                  />
                )}
                
                {isLoadingCrows && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="animate-spin h-5 w-5 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              {availableCrows.length > 0 ? (
                <p className="text-green-400/80 text-sm mt-1">
                  {availableCrows.length} received {availableCrows.length === 1 ? 'Crow is' : 'Crows are'} available at this site
                </p>
              ) : values.site_id ? (
                <p className="text-amber-200/80 text-sm mt-1">
                  No available Crows found at this site. Please ensure new Crows have been received.
                </p>
              ) : (
                <p className="text-amber-200/80 text-sm mt-1">
                  This is the ID of the replacement Crow that will take over protection
                </p>
              )}
              {errors.new_crow_id && <p className="text-red-400 text-sm mt-1">{errors.new_crow_id}</p>}
            </div>
            
            <ErrorMessage message={String(error || '')} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Replace Crow!"
                loadingText="Processing..."
                disabled={!values.existing_crow_id || !values.new_crow_id || !values.site_id || !values.work_cell_id}
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Replace" />
    </PageContainer>
  );
};

export default Replace;