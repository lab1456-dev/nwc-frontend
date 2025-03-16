import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
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
 * Interface for Replace form data
 */
interface ReplaceFormData extends CrowFormData {
  existing_crow_id: string;
  new_crow_id: string;
}

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
 * Replace component - Handles replacing a Crow with a new one
 */
const Replace: React.FC = () => {
  // States for crow data and validation
  const [existingCrowData, setExistingCrowData] = useState<CrowData | null>(null);
  const [availableCrows, setAvailableCrows] = useState<CrowData[]>([]);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>('');
  
  // API URLs
  const replaceUrl = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS);
  const crowsUrl = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS);

  // Get auth context
  const { getAuthToken } = useContext(AuthContext);
  
  // State for API requests
  const { makeRequest, isLoading, error, success, setSuccess } = useApiRequest(replaceUrl);
  
  // Initialize the form hook with validation rules
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm,
    setValues,
    setErrors
  } = useCrowForm<ReplaceFormData>(
    {
      existing_crow_id: '',
      new_crow_id: '',
      crow_id: '', // Required by CrowFormData but not directly used
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
   * Function to fetch Crow data by ID and status
   */
  const fetchCrowData = async (crowId: string, status: string): Promise<CrowData | null> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        setFetchError('Authentication token not available.');
        return null;
      }

      const response = await fetch(crowsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          operation: 'crows',
          crow_id: crowId,
          status: status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch Crow with status ${status}`);
      }

      const data = await response.json();
      
      if (data.crow) {
        // Single crow data returned
        return data.crow;
      } else if (data.crows && data.crows.length > 0) {
        // List of crows returned
        return data.crows[0];
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching Crow data:`, error);
      throw error;
    }
  };

  /**
   * Lookup the existing Crow and populate form fields
   */
  const lookupExistingCrow = async (): Promise<void> => {
    if (!values.existing_crow_id) {
      setErrors({...errors, existing_crow_id: 'Please enter an existing Crow ID'});
      return;
    }
    
    setIsLookingUp(true);
    setFetchError('');
    setExistingCrowData(null);
    
    try {
      // Try to find the Crow with DEPLOYED status
      const crowData = await fetchCrowData(values.existing_crow_id, 'DEPLOYED');
      
      if (crowData) {
        setExistingCrowData(crowData);
        
        // Populate form with Crow's site and work cell
        setValues({
          ...values,
          site_id: crowData.site_id || '',
          work_cell_id: crowData.work_cell_id || ''
        });
        
        // Fetch available replacement Crows at this site
        fetchAvailableCrows(crowData.site_id);
      } else {
        // If not found with DEPLOYED status, try to look up with any status
        try {
          const anyStatusData = await fetchCrowData(values.existing_crow_id, '*');
          if (anyStatusData) {
            setFetchError(`Crow ${values.existing_crow_id} has status ${anyStatusData.status} but must be DEPLOYED to be replaced.`);
          } else {
            setFetchError(`Crow with ID ${values.existing_crow_id} not found.`);
          }
        } catch (innerError) {
          setFetchError(`Crow with ID ${values.existing_crow_id} not found.`);
        }
      }
    } catch (error: any) {
      setFetchError(error.message || 'Failed to retrieve Crow information');
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
        setFetchError('Authentication token not available.');
        return;
      }

      const response = await fetch(crowsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          operation: 'crows',
          status: 'RECEIVED',
          site_id: siteId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch available Crows');
      }

      const data = await response.json();
      
      if (data.crows && Array.isArray(data.crows)) {
        setAvailableCrows(data.crows);
        
        // If there's exactly one Crow available, auto-select it
        if (data.crows.length === 1) {
          handleChange('new_crow_id', data.crows[0].crow_id);
        }
      } else {
        setAvailableCrows([]);
      }
    } catch (error: any) {
      console.error('Error fetching available Crows:', error);
      setFetchError(error.message || 'Failed to retrieve available Crows');
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
    
    // Create request headers
    const token = await getAuthToken();
    if (!token) {
      setFetchError('Authentication token not available.');
      return;
    }
    
    // Create request body
    const requestBody = {
      operation: 'replace',
      existing_crow_id: values.existing_crow_id,
      new_crow_id: values.new_crow_id,
      site_id: values.site_id,
      work_cell_id: values.work_cell_id
    };