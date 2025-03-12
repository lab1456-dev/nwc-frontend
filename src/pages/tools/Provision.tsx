import React, { useState, ChangeEvent, useEffect } from 'react';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';
import { useCrowForm } from '../../hooks/useCrowForm';
import { useApiRequest } from '../../hooks/useApiRequest';
import { API_CONFIG, buildApiUrl, getCrowModels, getActiveOsImages } from '../../services/apiService';
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
import { CrowFormData } from '../../types/types';

/**
 * Extended CrowFormData interface with additional hardware fields
 */
interface ExtendedCrowFormData extends Partial<CrowFormData> {
  manufacturer: string;
  model: string;
  cpu: string;
  ram: string;
  storage: string;
  os_image_version: string;
  csvFile?: File | null;
}

/**
 * Interface for manufacturer data
 */
interface Manufacturer {
  id: string;
  name: string;
  models: Model[];
}

/**
 * Interface for model data
 */
interface Model {
  id: string;
  name: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
  };
}

/**
 * Interface for OS image data
 */
interface OsImage {
  id: string;
  name: string;
}

/**
 * Interface for select option
 */
interface SelectOption {
  value: string;
  label: string;
}

/**
 * Provision mode type - single or multiple
 */
type ProvisionMode = 'single' | 'multiple';

/**
 * Provision component - Handles registering Crows in the system with hardware details
 * Supports both single and batch provisioning
 */
const Provision: React.FC = () => {
  // State for toggling between single and multiple provision modes
  const [mode, setMode] = useState<ProvisionMode>('single');
  
  // State for dropdowns
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [osImages, setOsImages] = useState<OsImage[]>([]);
  const [loading, setLoading] = useState({
    manufacturers: false,
    osImages: false
  });
  
  // API setup
  const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.PROVISION);
  
  const { 
    makeRequest, 
    isLoading, 
    error, 
    success, 
    setSuccess 
  } = useApiRequest(apiUrl);
  
  // Initial form values
  const initialFormValues: ExtendedCrowFormData = {
    crow_id: '',
    manufacturer: '',
    model: '',
    cpu: '',
    ram: '',
    storage: '',
    os_image_version: '',
    site_id: '',
    csvFile: null
  };
  
  // Form validation rules based on mode
  const getValidationRules = (currentMode: ProvisionMode) => ({
    crow_id: { required: currentMode === 'single', message: 'Crow ID is required' },
    manufacturer: { required: currentMode === 'single', message: 'Manufacturer is required' },
    model: { required: currentMode === 'single', message: 'Model is required' },
    os_image_version: { required: currentMode === 'single', message: 'OS Image Version is required' },
    csvFile: { required: currentMode === 'multiple', message: 'CSV file is required' }
  });
  
  // Initialize the form hook with validation rules
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm,
    setValues
  } = useCrowForm<ExtendedCrowFormData>(
    initialFormValues,
    getValidationRules(mode)
  );

  /**
   * Fetch manufacturers and models data
   */
  const fetchManufacturers = async () => {
    try {
      setLoading(prev => ({ ...prev, manufacturers: true }));
      
      const response = await getCrowModels("*");
      
      if (response.success && response.data) {
        setManufacturers(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch manufacturers');
      }
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    } finally {
      setLoading(prev => ({ ...prev, manufacturers: false }));
    }
  };

  /**
   * Fetch active OS images
   */
  const fetchOsImages = async () => {
    try {
      setLoading(prev => ({ ...prev, osImages: true }));
      
      const response = await getActiveOsImages();
      
      if (response.success && response.data) {
        setOsImages(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch OS images');
      }
    } catch (error) {
      console.error('Error fetching OS images:', error);
    } finally {
      setLoading(prev => ({ ...prev, osImages: false }));
    }
  };

  /**
   * Load data when component mounts
   */
  useEffect(() => {
    fetchManufacturers();
    fetchOsImages();
  }, []);

  /**
   * Update model specs when model changes
   */
  useEffect(() => {
    if (values.manufacturer && values.model) {
      const selectedManufacturer = manufacturers.find(m => m.id === values.manufacturer);
      if (selectedManufacturer) {
        const selectedModel = selectedManufacturer.models.find(m => m.id === values.model);
        if (selectedModel) {
          setValues(prev => ({
            ...prev,
            cpu: selectedModel.specs.cpu,
            ram: selectedModel.specs.ram,
            storage: selectedModel.specs.storage
          }));
        }
      }
    }
  }, [values.manufacturer, values.model, manufacturers]);

  /**
   * Convert manufacturers to select options
   */
  const getManufacturerOptions = (): SelectOption[] => {
    return manufacturers.map(manufacturer => ({
      value: manufacturer.id,
      label: manufacturer.name
    }));
  };

  /**
   * Get model options based on selected manufacturer
   */
  const getModelOptions = (): SelectOption[] => {
    if (!values.manufacturer) return [];
    
    const selectedManufacturer = manufacturers.find(m => m.id === values.manufacturer);
    if (!selectedManufacturer) return [];
    
    return selectedManufacturer.models.map(model => ({
      value: model.id,
      label: model.name
    }));
  };
  
  /**
   * Fetch models for a specific manufacturer
   */
  const fetchModelsForManufacturer = async (manufacturerId: string) => {
    if (!manufacturerId) return;
    
    try {
      const response = await getCrowModels(manufacturerId, "*");
      
      if (response.success && response.data) {
        // Update just the models for this manufacturer in the manufacturers array
        setManufacturers(prev => {
          const updated = [...prev];
          const index = updated.findIndex(m => m.id === manufacturerId);
          
          if (index !== -1 && response.data[0]) {
            updated[index] = response.data[0];
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error(`Error fetching models for manufacturer ${manufacturerId}:`, error);
    }
  };

  /**
   * Convert OS images to select options
   */
  const getOsImageOptions = (): SelectOption[] => {
    return osImages.map(osImage => ({
      value: osImage.id,
      label: osImage.name
    }));
  };

  /**
   * Handle manufacturer change and reset dependent fields
   */
  const handleManufacturerChange = (value: string) => {
    handleChange('manufacturer', value);
    handleChange('model', '');
    handleChange('cpu', '');
    handleChange('ram', '');
    handleChange('storage', '');
    
    // Fetch models for this manufacturer if needed
    if (value) {
      fetchModelsForManufacturer(value);
    }
  };

  /**
   * Toggle between single and multiple provision modes
   */
  const toggleMode = (newMode: ProvisionMode) => {
    setMode(newMode);
    setSuccess(false);
    resetForm();
  };

  /**
   * Handle CSV file selection
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleChange('csvFile', e.target.files[0]);
    }
  };

  /**
   * Get request headers for API call
   */
  const getRequestHeaders = () => ({
    'x-api-key': API_CONFIG.PROVISION_KEY,
    'step': 'provisioned',
    'mode': mode
  });

  /**
   * Prepare request payload based on mode
   */
  const prepareRequestPayload = () => {
    if (mode === 'single') {
      return { 
        crow_id: values.crow_id || '',
        manufacturer: values.manufacturer || '',
        model: values.model || '',
        os_image_version: values.os_image_version || ''
      };
    } else if (values.csvFile) {
      const formData = new FormData();
      formData.append('csvFile', values.csvFile);
      return formData;
    }
    return null;
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
    
    const headers = getRequestHeaders();
    const payload = prepareRequestPayload();
    
    if (payload) {
      // Use POST method for FormData when in multiple mode
      const method = mode === 'multiple' ? 'POST' : undefined;
      await makeRequest(payload, headers, method);
    }
  };

  /**
   * Handle reset after successful submission
   */
  const handleReset = () => {
    setSuccess(false);
    resetForm();
  };

  /**
   * Render success message
   */
  const renderSuccessMessage = () => (
    <div className="text-center">
      <div className="text-green-400 text-xl mb-4">
        {mode === 'single' 
          ? "Crow successfully provisioned!" 
          : "Crows successfully provisioned!"}
      </div>
      <div className="text-cyan-200 mb-6">
        {mode === 'single'
          ? "The new Crow has been registered in the system and is ready for deployment."
          : "Multiple Crows have been registered in the system. Check the summary report for details."}
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
        >
          {mode === 'single' 
            ? "Provision Another Crow" 
            : "Upload Another Batch"}
        </button>
      </div>
    </div>
  );

  /**
   * Render CSV upload instructions
   */
  const renderCsvInstructions = () => (
    <div className="bg-slate-800 p-4 rounded-md mb-6">
      <h3 className="text-cyan-300 font-medium mb-2">CSV File Format Requirements</h3>
      <p className="text-slate-300 mb-3">
        Your CSV file must contain the following columns:
      </p>
      <ul className="text-slate-300 list-disc ml-5 mb-4 space-y-1">
        <li><span className="text-cyan-200 font-medium">crow_id</span> - Unique identifier for each Crow</li>
        <li><span className="text-cyan-200 font-medium">manufacturer</span> - Device manufacturer name</li>
        <li><span className="text-cyan-200 font-medium">model</span> - Device model number/name</li>
        <li><span className="text-cyan-200 font-medium">os_image_version</span> - OS Image Version</li>
      </ul>
      <p className="text-slate-300 mb-2">
        Example: <span className="text-xs text-cyan-200 font-mono bg-slate-700 p-1 rounded">crow_id,manufacturer,model,os_image_version</span>
      </p>
      <p className="text-slate-300 mb-4">
        <span className="text-cyan-300">Important:</span> The first line of your CSV file must contain these exact column headers as shown in the example above.
      </p>
      <div className="bg-amber-900/40 border border-amber-700/50 p-3 rounded-md mt-3">
        <p className="text-amber-300 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Important Note
        </p>
        <p className="text-amber-100 mt-1">
          The manufacturer/model pair must exist in the system. If the combination does not exist, the CSV line will be rejected. The system will automatically associate the correct CPU, RAM, and storage specifications based on the manufacturer/model pair.
        </p>
      </div>
    </div>
  );

  /**
   * Render CSV file upload field
   */
  const renderCsvUpload = () => (
    <div className="space-y-2">
      <label htmlFor="csvFile" className="block text-sm font-medium text-cyan-200">
        Upload CSV File
      </label>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isLoading}
        className="block w-full text-sm text-slate-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-cyan-700 file:text-cyan-50
          hover:file:bg-cyan-600
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
      />
      {errors.csvFile && (
        <p className="mt-1 text-sm text-red-400">{errors.csvFile}</p>
      )}
      {values.csvFile && (
        <p className="mt-1 text-sm text-green-400">
          File selected: {values.csvFile.name}
        </p>
      )}
    </div>
  );

  /**
   * Render single crow form fields
   */
  const renderSingleCrowForm = () => (
    <>
      <FormInput
        id="crow_id"
        label="Crow ID (scan the QR Code with the Crow image)"
        value={values.crow_id || ''}
        onChange={(value) => handleChange('crow_id', value)}
        placeholder="Enter Crow ID"
        disabled={isLoading}
        error={errors.crow_id}
      />

      <FormSelect
        id="manufacturer"
        label="Manufacturer"
        value={values.manufacturer || ''}
        onChange={handleManufacturerChange}
        options={getManufacturerOptions()}
        placeholder="Select manufacturer"
        disabled={isLoading || loading.manufacturers}
        error={errors.manufacturer}
      />

      <FormSelect
        id="model"
        label="Model"
        value={values.model || ''}
        onChange={(value) => handleChange('model', value)}
        options={getModelOptions()}
        placeholder="Select model"
        disabled={isLoading || !values.manufacturer}
        error={errors.model}
      />

      <FormInput
        id="cpu"
        label="CPU"
        value={values.cpu || ''}
        onChange={(value) => handleChange('cpu', value)}
        placeholder="CPU specification"
        disabled={true}
        error={errors.cpu}
        helpText="Auto-filled based on model selection"
      />

      <FormInput
        id="ram"
        label="RAM"
        value={values.ram || ''}
        onChange={(value) => handleChange('ram', value)}
        placeholder="RAM specification"
        disabled={true}
        error={errors.ram}
        helpText="Auto-filled based on model selection"
      />

      <FormInput
        id="storage"
        label="Storage"
        value={values.storage || ''}
        onChange={(value) => handleChange('storage', value)}
        placeholder="Storage specification"
        disabled={true}
        error={errors.storage}
        helpText="Auto-filled based on model selection"
      />

      <FormSelect
        id="os_image_version"
        label="OS Image Version"
        value={values.os_image_version || ''}
        onChange={(value) => handleChange('os_image_version', value)}
        options={getOsImageOptions()}
        placeholder="Select OS image version"
        disabled={isLoading || loading.osImages}
        error={errors.os_image_version}
      />
    </>
  );

  /**
   * Render mode toggle buttons
   */
  const renderModeToggle = () => (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => toggleMode('single')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
            ${mode === 'single'
              ? 'bg-cyan-700 text-white'
              : 'bg-slate-800 text-cyan-200 hover:bg-slate-700'
            }`}
        >
          Provision a Single Crow
        </button>
        <button
          type="button"
          onClick={() => toggleMode('multiple')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
            ${mode === 'multiple'
              ? 'bg-cyan-700 text-white'
              : 'bg-slate-800 text-cyan-200 hover:bg-slate-700'
            }`}
        >
          Provision Multiple Crows
        </button>
      </div>
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="Provision Crow"
        subtitle={mode === 'single' 
          ? "Image a new guardian to your network's Watch" 
          : "Deploy multiple guardians in batch using CSV upload"}
      />

      <ContentCard>
        {renderModeToggle()}
        
        {success ? (
          renderSuccessMessage()
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'single' ? (
              renderSingleCrowForm()
            ) : (
              <>
                {renderCsvInstructions()}
                {renderCsvUpload()}
              </>
            )}
            
            <ErrorMessage message={error || ''} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text={mode === 'single' ? "Provision Crow!" : "Provision Multiple Crows"}
                loadingText={mode === 'single' ? "Provisioning..." : "Processing Batch..."}
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      <WorkflowStepDescriptions step="Provision" />
    </PageContainer>
  );
};

export default Provision;