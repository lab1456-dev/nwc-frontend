import React, { useState } from 'react';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';
import { useCrowForm } from '../../hooks/useCrowForm';
import { useApiRequest } from '../../hooks/useApiRequest';
import { API_CONFIG, buildApiUrl } from '../../services/api/apiService';
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
import { CrowFormData, WorkflowStep } from '../../types/types';

/**
 * Interface for SuspendReactivate form data
 */
interface SuspendReactivateFormData extends CrowFormData {
  maintenance_window?: string;
}

/**
 * SuspendReactivate component - Handles suspending and reactivating monitoring for Crows
 */
const SuspendReactivate: React.FC = () => {
  // State for toggling between suspend and reactivate actions
  const [action, setAction] = useState<WorkflowStep>('suspend');
  
  // API URL for status monitoring
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.MONITOR_STATUS);
  
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
    validateForm
  } = useCrowForm<SuspendReactivateFormData>(
    {
      crow_id: '',
      site_id: '',
      work_cell_id: '',
      maintenance_window: ''
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
      site_id: { required: true, message: 'Site ID is required' },
      work_cell_id: { required: true, message: 'Work Cell ID is required' },
      maintenance_window: { 
        required: action === 'suspend', 
        message: 'Maintenance window duration is required' 
      }
    }
  );

  /**
   * Toggle between suspend and reactivate actions
   */
  const toggleAction = () => {
    setAction(prevAction => prevAction === 'suspend' ? 'reactivate' : 'suspend');
    setSuccess(false);
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
    
    // Create request headers with Crow authentication
    const headers = {
      'Authorization': `Crow ${values.crow_id}`,
      'step': action
    };
    
    // Create request body based on action
    const requestBody = {
      crow_id: values.crow_id,
      site_id: values.site_id,
      work_cell_id: values.work_cell_id,
      ...(action === 'suspend' && { maintenance_window: values.maintenance_window })
    };
    
    // Make the API request
    await makeRequest(requestBody, headers);
  };

  /**
   * Handle reset after successful submission
   */
  const handleReset = () => {
    setSuccess(false);
  };

  /**
   * Get maintenance window duration options
   */
  const getMaintenanceWindowOptions = () => [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: '12 hours (maximum)' }
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`${action === 'suspend' ? 'Suspend' : 'Reactivate'} Crow Monitoring`}
        subtitle={action === 'suspend' 
          ? 'Temporarily pause monitoring during planned maintenance' 
          : 'Resume monitoring after maintenance completion'}
      />

      <ContentCard>
        {/* Action toggle buttons */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setAction('suspend')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
                ${action === 'suspend'
                  ? 'bg-cyan-700 text-white'
                  : 'bg-slate-800 text-cyan-200 hover:bg-slate-700'
                }`}
            >
              Suspend
            </button>
            <button
              type="button"
              onClick={() => setAction('reactivate')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
                ${action === 'reactivate'
                  ? 'bg-cyan-700 text-white'
                  : 'bg-slate-800 text-cyan-200 hover:bg-slate-700'
                }`}
            >
              Reactivate
            </button>
          </div>
        </div>
        
        {success ? (
          <div className="text-center">
            <div className="text-green-400 text-xl mb-4">
              {action === 'suspend' 
                ? 'Crow monitoring successfully suspended!' 
                : 'Crow monitoring successfully reactivated!'}
            </div>
            <div className="text-cyan-200 mb-6">
              {action === 'suspend'
                ? `Monitoring will be suspended for the specified maintenance window. Remember to reactivate after maintenance is complete.`
                : `The Crow will resume normal check-in monitoring. The system will now alert if check-ins are missed.`}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleAction}
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                {action === 'suspend' ? 'Switch to Reactivate' : 'Switch to Suspend'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
              >
                {action === 'suspend' ? 'Suspend Another Crow' : 'Reactivate Another Crow'}
              </button>
            </div>
          </div>
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
            
            {action === 'suspend' && (
              <FormSelect
                id="maintenance_window"
                label="Maintenance Window (hours)"
                value={values.maintenance_window || ''}
                onChange={(value) => handleChange('maintenance_window', value)}
                options={getMaintenanceWindowOptions()}
                placeholder="Select duration"
                disabled={isLoading}
                error={errors.maintenance_window}
                helpText="Maximum suspension period is 12 hours"
              />
            )}
            
            <ErrorMessage message={String(error || '')} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text={action === 'suspend' ? 'Suspend Monitoring' : 'Reactivate Monitoring'}
                loadingText="Processing..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="SuspendReactivate" />
    </PageContainer>
  );
};

export default SuspendReactivate;