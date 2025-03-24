import React, { useState, useEffect, useContext } from 'react';
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
  FormSelect,
  SubmitButton, 
  ErrorMessage 
} from '../../components/formComponents';

// Import from the API service specifications
import { ReplaceApi } from '../../services/api/crow-management-api';
import { CrowsFormApi } from '../../services/api/crow-form-apis';
import { callCrowApi, API_CONFIG } from '../../services/api/crow-management-api';
import { callFormApi } from '../../services/api/crow-form-apis';

/**
 * Interface for Crow data
 */
interface CrowData {
  crow_id: string;
  site_id: string;
  work_cell_id?: string;
  status: string;
  [key: string]: any;
}

/**
 * Interface for Replace form data
 */
interface ReplaceFormData {
  existing_crow_id: string;
  new_crow_id: string;
  site_id: string;
  work_cell_id: string;
}

/**
 * Select option interface for dropdowns
 */
interface SelectOption {
  value: string;
  label: string;
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
  
  // States for crow data and validation
  const [existingCrowData, setExistingCrowData] = useState<CrowData | null>(null);
  const [availableCrows, setAvailableCrows] = useState<CrowData[]>([]);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  
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

  /**
   * Check for authentication on component mount
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { returnUrl: '/replace' } });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Lookup the existing Crow and populate form fields
   */
  const lookupExistingCrow = async (): Promise<void> => {
    if (!values.existing_crow_id) {
      return;
    }
    
    setIsLookingUp(true);
    setError(null);
    setExistingCrowData(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required. Please sign in again.');
        navigate('/signin', { state: { returnUrl: '/replace' } });
        return;
      }
      
      // Use the API structure from crow-form-apis.ts
      const request: CrowsFormApi.FetchCrowsByStatusRequest = {
        function: 'fetch_crows_by_status',
        crow_id: values.existing_crow_id,
        status: 'deployed'
      };
      
      const response = await callFormApi<
        CrowsFormApi.FetchCrowsByStatusRequest, 
        CrowsFormApi.CrowsResponse
      >(request, token);
      
      if (response && response.crow) {
        setExistingCrowData(response.crow);
        
        // Populate form with Crow's site and work cell
        setValues({
          ...values,
          site_id: response.crow.site_id || '',
          work_cell_id: response.crow.work_cell_id || ''
        });
        
        // Fetch available replacement Crows at this site
        fetchAvailableCrows(response.crow.site_id);
      } else {
        // If not found with DEPLOYED status, try to look up with any status
        try {
          const anyStatusRequest: CrowsFormApi.FetchCrowsBySiteRequest = {
            function: 'fetch_crows_by_site',
            site_id: values.existing_crow_id
          };
          
          const anyStatusResponse = await callFormApi<
            CrowsFormApi.FetchCrowsBySiteRequest,
            CrowsFormApi.CrowsResponse
          >(anyStatusRequest, token);
          
          if (anyStatusResponse && anyStatusResponse.crow) {
            setError(`Crow ${values.existing_crow_id} has status ${anyStatusResponse.crow.status} but must be DEPLOYED to be replaced.`);
          } else {
            setError(`Crow with ID ${values.existing_crow_id} not found.`);
          }
        } catch (innerError) {
          setError(`Crow with ID ${values.existing_crow_id} not found.`);
        }
      }
    } catch (error: any) {
      console.error('Error during lookup:', error);
      setError(error.message || 'Failed to retrieve Crow information');
    } finally {
      setIsLookingUp(false);
    }
  };

  /**
   * Fetch available Crows that can be used as replacements
   */
  const fetchAvailableCrows = async (siteId: string): Promise<void> => {
    if (!siteId) return;
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication token not available.');
        return;
      }

      // Use the API structure from crow-form-apis.ts
      const request: CrowsFormApi.FetchCrowsBySiteRequest = {
        function: 'fetch_crows_by_site',
        status: 'RECEIVED',
        site_id: siteId
      };
      
      const response = await callFormApi<
        CrowsFormApi.FetchCrowsBySiteRequest,
        CrowsFormApi.CrowsResponse
      >(request, token);
      
      if (response && response.crows && Array.isArray(response.crows)) {
        setAvailableCrows(response.crowsResponse);
        
        // If there's exactly one Crow available, auto-select it
        if (response.crows.length === 1) {
          handleChange('new_crow_id', response.crows[0].crow_id);
        }
      } else {
        setAvailableCrows([]);
      }
    } catch (error: any) {
      console.error('Error fetching available Crows:', error);
      setError(error.message || 'Failed to retrieve available Crows');
    }
  };

  /**
   * Convert available Crows to select options
   */
  const getAvailableCrowOptions = (): SelectOption[] => {
    return availableCrows.map(crow => ({
      value: crow.crow_id,
      label: crow.crow_id
    }));
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
      // Make sure all required values are present
      if (!values.existing_crow_id || !values.new_crow_id || !values.site_id || !values.work_cell_id) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }
      
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required. Please sign in again.');
        navigate('/signin', { state: { returnUrl: '/replace' } });
        return;
      }
      
      // Use the ReplaceApi interface from crow-management-api.ts
      const request: ReplaceApi.ReplaceRequest = {
        function: 'replace',
        current_crow_id: values.existing_crow_id,
        replacement_crow_id: values.new_crow_id,
        site_id: values.site_id,
        work_cell_id: values.work_cell_id
      };
      
      const response = await callCrowApi<
        ReplaceApi.ReplaceRequest,
        ReplaceApi.ReplaceResponse
      >(
        'replace',
        API_CONFIG.endpoints.replace,
        request,
        token
      );
      
      if (response && response.statusCode === 200) {
        setSuccess(true);
      } else {
        setError(response?.message || 'An error occurred during replacement');
      }
    } catch (error: any) {
      console.error('Error during replacement:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle reset after successful submission
   */
  const handleReset = () => {
    setSuccess(false);
    resetForm();
    setExistingCrowData(null);
    setAvailableCrows([]);
  };

  /**
   * Render success message
   */
  const renderSuccessMessage = () => (
    <div className="text-center">
      <div className="text-green-400 text-xl mb-4">
        Crow successfully replaced!
      </div>
      <div className="text-cyan-200 mb-6">
        The Crow has been replaced and the new Crow is now deployed at the site.
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
        >
          Replace Another Crow
        </button>
      </div>
    </div>
  );

  /**
   * Render lookup form section
   */
  const renderLookupForm = () => (
    <div className="flex space-x-4">
      <div className="flex-grow">
        <FormInput
          id="existing_crow_id"
          label="Existing Crow ID"
          value={values.existing_crow_id || ''}
          onChange={(value) => handleChange('existing_crow_id', value)}
          placeholder="Enter the ID of the Crow to be replaced"
          disabled={isLoading || isLookingUp || success}
          error={errors.existing_crow_id}
        />
      </div>
      <div className="flex items-end pb-1">
        <button
          type="button"
          onClick={lookupExistingCrow}
          disabled={isLoading || isLookingUp || !values.existing_crow_id || success}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLookingUp ? "Looking up..." : "Lookup"}
        </button>
      </div>
    </div>
  );

  /**
   * Render replacement form fields
   */
  const renderReplacementForm = () => (
    <>
      {existingCrowData && (
        <div className="bg-slate-800 p-4 rounded-md mb-6">
          <h3 className="text-cyan-300 font-medium mb-2">Existing Crow Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">Crow ID:</span>
              <span className="ml-2 text-white">{existingCrowData.crow_id}</span>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>
              <span className="ml-2 text-white">{existingCrowData.status}</span>
            </div>
            <div>
              <span className="text-slate-400">Site ID:</span>
              <span className="ml-2 text-white">{existingCrowData.site_id}</span>
            </div>
            <div>
              <span className="text-slate-400">Work Cell ID:</span>
              <span className="ml-2 text-white">{existingCrowData.work_cell_id || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      <FormSelect
        id="new_crow_id"
        label="New Crow ID"
        value={values.new_crow_id || ''}
        onChange={(value) => handleChange('new_crow_id', value)}
        options={getAvailableCrowOptions()}
        placeholder="Select a new Crow"
        disabled={isLoading || !existingCrowData || availableCrows.length === 0}
        error={errors.new_crow_id}
        helpText={availableCrows.length === 0 ? "No available Crows found at this site" : ""}
      />

      <FormInput
        id="site_id"
        label="Site ID"
        value={values.site_id || ''}
        onChange={(value) => handleChange('site_id', value)}
        placeholder="Site ID"
        disabled={true}
        error={errors.site_id}
        helpText="Auto-filled based on existing Crow"
      />

      <FormInput
        id="work_cell_id"
        label="Work Cell ID"
        value={values.work_cell_id || ''}
        onChange={(value) => handleChange('work_cell_id', value)}
        placeholder="Work Cell ID"
        disabled={!existingCrowData}
        error={errors.work_cell_id}
        helpText="Auto-filled based on existing Crow, can be modified if needed"
      />
    </>
  );

  return (
    <PageContainer>
      <PageHeader
        title="Replace Crow"
        subtitle="Replace a deployed Crow with a new one while maintaining the same location and configuration"
      />

      <ContentCard>
        {success ? (
          renderSuccessMessage()
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderLookupForm()}
            
            {renderReplacementForm()}
            
            <ErrorMessage message={error || ''} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Replace Crow"
                loadingText="Replacing..."
                disabled={!existingCrowData || !values.new_crow_id}
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      <WorkflowStepDescriptions step="Replace" />
    </PageContainer>
  );
};

export default Replace;