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
 * Extended CrowFormData interface with additional hardware fields
 */
interface ExtendedCrowFormData extends Partial<CrowFormData> {
  manufacturer: string | null;
  model: string | null;
  cpu: string | null;
  ram: string | null;
  storage: string | null;
  os_image_version: string | null;
}

/**
 * Provision component - Handles registering a new Crow in the system with hardware details
 */
const Provision: React.FC = () => {
  // Build the API URL once and correctly
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.PROVISION);
  
  // Initialize the API request hook
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess 
  } = useApiRequest(apiUrl);
  
  // Initialize the form hook with validation rules for all required fields
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm 
  } = useCrowForm<ExtendedCrowFormData>(
    {
      crow_id: '',
      manufacturer: '',
      model: '',
      cpu: '',
      ram: '',
      storage: '',
      os_image_version: '',
      site_id: ''
    },
    {
      crow_id: { required: true, message: 'Crow ID is required' },
      manufacturer: { required: true, message: 'Manufacturer is required' },
      model: { required: true, message: 'Model is required' },
      cpu: { required: true, message: 'CPU information is required' },
      ram: { required: true, message: 'RAM specification is required' },
      storage: { required: true, message: 'Storage information is required' },
      os_image_version: { required: true, message: 'OS Image Version is required' }
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
    
    // Create request headers with API key and step information
    const headers = {
      'x-api-key': API_CONFIG.PROVISION_KEY,
      'step': 'provisioned'
    };
    
    // Make the API request with all the hardware details
    await makeRequest(
      { 
        crow_id: values.crow_id || '',
        manufacturer: values.manufacturer || '',
        model: values.model || '',
        cpu: values.cpu || '',
        ram: values.ram || '',
        storage: values.storage || '',
        os_image_version: values.os_image_version || ''
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
        title="Provision New Crow"
        subtitle="Image a new guardian to your network's Watch"
      />

      <ContentCard>
        {success ? (
          <SuccessMessage
            title="Crow successfully provisioned!"
            buttonText="Provision Another Crow"
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
              id="manufacturer"
              label="Manufacturer"
              value={values.manufacturer || ''}
              onChange={(value) => handleChange('manufacturer', value)}
              placeholder="Enter device manufacturer"
              disabled={isLoading}
              error={errors.manufacturer}
            />

            <FormInput
              id="model"
              label="Model"
              value={values.model || ''}
              onChange={(value) => handleChange('model', value)}
              placeholder="Enter device model"
              disabled={isLoading}
              error={errors.model}
            />

            <FormInput
              id="cpu"
              label="CPU"
              value={values.cpu || ''}
              onChange={(value) => handleChange('cpu', value)}
              placeholder="Enter CPU specification"
              disabled={isLoading}
              error={errors.cpu}
            />

            <FormInput
              id="ram"
              label="RAM"
              value={values.ram || ''}
              onChange={(value) => handleChange('ram', value)}
              placeholder="Enter RAM amount (e.g., 8GB)"
              disabled={isLoading}
              error={errors.ram}
            />

            <FormInput
              id="storage"
              label="Storage"
              value={values.storage || ''}
              onChange={(value) => handleChange('storage', value)}
              placeholder="Enter storage capacity (e.g., 256GB)"
              disabled={isLoading}
              error={errors.storage}
            />

            <FormInput
              id="os_image_version"
              label="OS Image Version"
              value={values.os_image_version || ''}
              onChange={(value) => handleChange('os_image_version', value)}
              placeholder="Enter OS image version"
              disabled={isLoading}
              error={errors.os_image_version}
            />
            
            <ErrorMessage message={error || ''} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text="Provision Crow!"
                loadingText="Provisioning..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Use the reusable WorkflowStepDescriptions component */}
      <WorkflowStepDescriptions step="Provision" />
    </PageContainer>
  );
};

export default Provision;