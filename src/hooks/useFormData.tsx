import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { callFormApi } from '../services/api/crow-form-apis';

/**
 * Custom hook for fetching form data for dropdowns and other form elements
 */
export const useFormData = <ResponseType extends any>(
  requestFunction: (token: string) => Promise<ResponseType>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getAuthToken } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await requestFunction(token);
        setData(response);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        console.error('Error in useFormData:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  return {
    data,
    isLoading,
    error,
    refetch: async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await requestFunction(token);
        setData(response);
        return response;
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        console.error('Error in useFormData refetch:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  };
};

// Specialized hooks for common form data types

/**
 * Hook for fetching sites data
 */
export const useSitesData = (siteId?: string) => {
  const fetchSites = async (token: string) => {
    const request = {
      function: 'fetch_sites_all',
      site_id: siteId || '*'
    };
    
    return await callFormApi(request, token);
  };
  
  return useFormData(fetchSites, [siteId]);
};

/**
 * Hook for fetching work cells data
 */
export const useWorkCellsData = (siteId?: string) => {
  const fetchWorkCells = async (token: string) => {
    const request = {
      function: siteId ? 'fetch_workcells_by_site' : 'fetch_workcells_all',
      site_id: siteId
    };
    
    return await callFormApi(request, token);
  };
  
  return useFormData(fetchWorkCells, [siteId]);
};

/**
 * Hook for fetching crow models data
 */
export const useCrowModelsData = (manufacturer?: string) => {
  const fetchCrowModels = async (token: string) => {
    const request = {
      function: manufacturer ? 'fetch_crowmodels_by_manufacturer' : 'fetch_crowmodels_all',
      manufacturer
    };
    
    return await callFormApi(request, token);
  };
  
  return useFormData(fetchCrowModels, [manufacturer]);
};

/**
 * Hook for fetching OS versions data
 */
export const useOsVersionsData = (manufacturer?: string, model?: string) => {
  const fetchOsVersions = async (token: string) => {
    const request = {
      function: (manufacturer && model) ? 'fetch_os_versions_by_model' : 'fetch_os_versions_all',
      manufacturer,
      model
    };
    
    return await callFormApi(request, token);
  };
  
  return useFormData(fetchOsVersions, [manufacturer, model]);
};

/**
 * Hook for fetching crows data
 */
export const useCrowsData = (status?: string, siteId?: string) => {
  const fetchCrows = async (token: string) => {
    let functionName = 'fetch_crows_all';
    
    if (status && siteId) {
      functionName = 'fetch_crows_by_site';
    } else if (status) {
      functionName = 'fetch_crows_by_status';
    }
    
    const request = {
      function: functionName,
      status,
      site_id: siteId
    };
    
    return await callFormApi(request, token);
  };
  
  return useFormData(fetchCrows, [status, siteId]);
};