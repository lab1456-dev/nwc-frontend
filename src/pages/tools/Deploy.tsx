import React, { useContext, useState, useEffect } from 'react';
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
  ErrorMessage, 
  SuccessMessage 
} from '../../components/formComponents';
import { CrowFormData } from '../../types/types';

// Import from the new API service structure
import { deployCrow } from '../../services/api/userApi';
import { getSites, getWorkCells } from '../../services/api/formApi';
import type { Site, WorkCell } from '../../services/api/apiTypes';

/**
 * Deploy component - Handles associating a Crow with a specific work cell
 */
const Deploy: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthToken } = useContext(AuthContext);
  
  // State for API communication
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  
  // State for dropdown options
  const [sites, setSites] = useState<Site[]>([]);
  const [workCells, setWorkCells] = useState<WorkCell[]>([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [workCellsLoading, setWorkCellsLoading] = useState(false);
  
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

  // Check for authentication and load sites on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/signin', { state: { returnUrl: '/deploy' } });
      return;
    }
    
    // Load sites for dropdown
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
  
  // Load work cells when site changes
  useEffect(() => {
    if (!values.site_id) {
      setWorkCells([]);
      return;
    }
    
    const loadWorkCells = async () => {
      try {
        setWorkCellsLoading(true);
        const token = await getAuthToken();
        if (!token) return;
        
        const response = await getWorkCells({ site_id: values.site_id || '' }, token);
        if (response.success && response.data) {
          setWorkCells(response.data.workcells || []);
        }
      } catch (err) {
        console.error('Error loading work cells:', err);
      } finally {
        setWorkCellsLoading(false);
      }
    };
    
    loadWorkCells();
  }, [values.site_id, getAuthToken]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Additional validation to ensure values aren't undefined
    if (!values.crow_id || !values.site_id || !values.work_cell_id) {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/signin', { state: { returnUrl: '/deploy' } });
        return;
      }
      
      // Use the deployCrow function from the userApi
      const response = await deployCrow(
        {
          crow_id: values.crow_id || '',
          site_id: values.site_id || '',
          work_cell_id: values.work_cell_id || ''
        },
        token
      );
      
      if (response.success) {
        setSuccess(true);
        setResponseData(response.data);
      } else {
        setError(response.message || 'An error occurred while deploying the Crow.');
      }
    } catch (err: any) {
      console.error('Error during deployment:', err);
      setError(err.message || 'An unexpected error occurred.');
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
    setResponseData(null);
  };
  
  /**
   * Convert sites to select options
   */
  const getSiteOptions = () => {
    return sites.map(site => ({
      value: site.site_id,
      label: `${site.site_name} (${site.site_id})`
    }));
  };
  
  /**
   * Convert work cells to select options
   */
  const getWorkCellOptions = () => {
    return workCells.map(workCell => ({
      value: workCell.workcell_id,
      label: `${workCell.name} (${workCell.workcell_id})`
    }));
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
            message={responseData?.message || `Crow ${values.crow_id || ''} has been deployed to work cell ${values.work_cell_id || ''} at site ${values.site_id || ''}.`}
            buttonText="Deploy Another Crow"
            onButtonClick={handleReset}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="crow_id"
              label="Crow ID"
              value={values.crow_id || ''}
              onChange={(value) => handleChange('crow_id', value)}
              placeholder="Enter Crow ID"
              disabled={isLoading}
              error={errors.crow_id}
              helpText="ID will be converted to uppercase automatically"
            />
            
            {sites.length > 0 ? (
              <FormSelect
                id="site_id"
                label="Site"
                value={values.site_id || ''}
                onChange={(value) => handleChange('site_id', value)}
                options={getSiteOptions()}
                placeholder="Select a site"
                disabled={isLoading || sitesLoading}
                error={errors.site_id}
                helpText={sitesLoading ? "Loading sites..." : "Select the site where the Crow is located"}
              />
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
            
            {workCells.length > 0 ? (
              <FormSelect
                id="work_cell_id"
                label="Work Cell"
                value={values.work_cell_id || ''}
                onChange={(value) => handleChange('work_cell_id', value)}
                options={getWorkCellOptions()}
                placeholder="Select a work cell"
                disabled={isLoading || workCellsLoading || !values.site_id}
                error={errors.work_cell_id}
                helpText={workCellsLoading ? "Loading work cells..." : "Select the work cell to deploy the Crow to"}
              />
            ) : (
              <FormInput
                id="work_cell_id"
                label="Work Cell ID"
                value={values.work_cell_id || ''}
                onChange={(value) => handleChange('work_cell_id', value)}
                placeholder="Enter work cell ID"
                disabled={isLoading}
                error={errors.work_cell_id}
                helpText="ID will be converted to uppercase automatically"
              />
            )}
            
            <ErrorMessage message={error || ''} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Deploy Crow!"
                loadingText="Deploying..."
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