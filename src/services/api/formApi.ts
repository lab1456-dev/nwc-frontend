// formApi.ts - Specialized API definitions for Form data operations

import { FormApiResponse } from './apiService';
import { API_CONFIG } from './apiConfig';

/**
 * FormApi namespace containing types and functions specific to form data operations
 */
export namespace FormApi {
  // General form request interface
  export interface FormDataRequest {
    function: string;
    [key: string]: any;
  }
  
  // Models
  export interface ModelsResponse extends FormApiResponse {
    data: {
      models: Array<{
        manufacturer: string;
        models: string[] | any;
      }>;
    };
  }
  
  export interface ModelDetailsResponse extends FormApiResponse {
    data: {
      model: {
        manufacturer: string;
        model: string;
        specs?: {
          cpu?: string;
          ram?: string;
          storage?: string;
          [key: string]: any;
        };
        [key: string]: any;
      };
    };
  }
  
  // OS Versions
  export interface OSVersionResponse extends FormApiResponse {
    data: {
      versions: Array<{
        version: string;
        releaseDate?: string;
        status?: string;
        recommended?: boolean;
      }>;
    };
  }
  
  // Sites
  export interface SitesResponse extends FormApiResponse {
    data: {
      sites: Array<{
        site_id: string;
        site_name: string;
        site_code?: string;
        [key: string]: any;
      }>;
    };
  }
  
  // Workcells
  export interface WorkcellsResponse extends FormApiResponse {
    data: {
      workcells: Array<{
        workcell_id: string;
        site_id: string;
        workcell_type: string;
        is_protected: boolean;
        protected_by?: string;
        [key: string]: any;
      }>;
    };
  }
  
  /**
   * Fetch all manufacturers and models
   * 
   * @param token Authentication token
   * @returns Promise resolving to the models response
   */
  export async function fetchAllModels(token: string): Promise<ModelsResponse> {
    // Import here to avoid circular dependencies
    const { callApi } = await import('./apiService');
    
    return callApi<FormDataRequest, ModelsResponse>(
      API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
      {
        operation: API_CONFIG.OPERATIONS.FETCH_MODELS,
        body: {
          function: API_CONFIG.FUNCTIONS.FETCH_MODELS_ALL
        }
      },
      token
    );
  }
  
  /**
   * Fetch models for a specific manufacturer
   * 
   * @param manufacturer Manufacturer identifier
   * @param token Authentication token
   * @returns Promise resolving to the models response
   */
  export async function fetchModelsByManufacturer(
    manufacturer: string,
    token: string
  ): Promise<ModelsResponse> {
    // Import here to avoid circular dependencies
    const { callApi } = await import('./apiService');
    
    return callApi<FormDataRequest, ModelsResponse>(
      API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
      {
        operation: API_CONFIG.OPERATIONS.FETCH_MODELS,
        body: {
          function: API_CONFIG.FUNCTIONS.FETCH_MODELS_BY_MANUFACTURER,
          manufacturer
        }
      },
      token
    );
  }
  
  /**
   * Fetch details for a specific model
   * 
   * @param manufacturer Manufacturer identifier
   * @param model Model identifier
   * @param token Authentication token
   * @returns Promise resolving to the model details response
   */
  export async function fetchModelDetails(
    manufacturer: string,
    model: string,
    token: string
  ): Promise<ModelDetailsResponse> {
    // Import here to avoid circular dependencies
    const { callApi } = await import('./apiService');
    
    return callApi<FormDataRequest, ModelDetailsResponse>(
      API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
      {
        operation: API_CONFIG.OPERATIONS.FETCH_MODELS,
        body: {
          function: API_CONFIG.FUNCTIONS.FETCH_MODEL_DETAILS,
          manufacturer,
          model
        }
      },
      token
    );
  }
  
  /**
   * Fetch all available OS versions
   * 
   * @param token Authentication token
   * @returns Promise resolving to the OS versions response
   */
  export async function fetchAllOSVersions(token: string): Promise<OSVersionResponse> {
    // Import here to avoid circular dependencies
    const { callApi } = await import('./apiService');
    
    return callApi<FormDataRequest, OSVersionResponse>(
      API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
      {
        operation: API_CONFIG.OPERATIONS.FETCH_OS_VERSIONS,
        body: {
          function: API_CONFIG.FUNCTIONS.FETCH_OS_VERSIONS_ALL
        }
      },
      token
    );
  }
}