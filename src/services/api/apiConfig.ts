/**
 * apiConfig.ts
 * 
 * Centralized configuration for the Crow Management System API.
 * This file defines all endpoints, operations, and functions used by the application
 * to ensure consistency across API calls and prevent magic strings.
 * 
 * @author Night's Watch Development Team
 * @version 1.0.0
 * @updated 2025-03-23
 */

/**
 * Base API configuration including environment-specific URLs
 */
export const API_BASE = {
  URL: import.meta.env.VITE_API_URL || 'https://api.nightswatchcrow.com/prod',
  VERSION: '1.0'
};

/**
 * API Endpoint paths - centralized to prevent duplication and ensure consistency
 */
export const API_ENDPOINTS = {
  // Main API entry points
  MANAGE_CROW_USERS: 'manageCrowUsers',    // For workflow operations (provision, receive, deploy, etc.)
  MANAGE_CROW_FORMS: 'manageCrowForms',    // For form data operations (dropdowns, options, etc.)
  MANAGE_CROW_DEVICES: 'manageCrowDevices' // For device operations (check-in, etc.)
};

/**
 * API operation types used as discriminators in request bodies
 * These should align with the backend API operation routing
 */
export const API_OPERATIONS = {
  // User workflow operations
  PROVISION: 'provision' as const,
  RECEIVE: 'receive' as const,
  DEPLOY: 'deploy' as const,
  REPLACE: 'replace' as const,
  TRANSFER: 'transfer' as const,
  SUSPEND_REACTIVATE: 'suspendreactivate' as const,
  RETIRE: 'retire' as const,
  
  // Form data operations
  FETCH_CROWS: 'fetchCrows' as const,
  FETCH_SITES: 'fetchSites' as const,
  FETCH_WORKCELLS: 'fetchWorkcells' as const,
  FETCH_MODELS: 'fetchModels' as const,
  FETCH_OS_VERSIONS: 'fetchOSVersions' as const
};

/**
 * Specific functions for each operation
 * Enforces strict naming convention and prevents typos
 */
export const API_FUNCTIONS = {
  // Provision functions
  PROVISION_SINGLE: 'provision' as const,
  PROVISION_BATCH: 'batch_provision' as const,
  
  // Receive functions
  RECEIVE_SINGLE: 'receive' as const,
  RECEIVE_BATCH: 'batch_receive' as const,
  
  // Deploy functions
  DEPLOY: 'deploy' as const,
  
  // Replace functions
  REPLACE: 'replace' as const,
  
  // Transfer functions
  TRANSFER: 'transfer' as const,
  
  // Suspend/Reactivate functions
  SUSPEND: 'suspend' as const,
  REACTIVATE: 'reactivate' as const,
  
  // Retire functions
  RETIRE: 'retire' as const,
  
  // Form data functions - organized by category
  FORM: {
    // Site functions
    SITES_ALL: 'fetch_sites_all' as const,
    SITES_BY_ID: 'fetch_sites_by_id' as const,
    
    // Workcell functions
    WORKCELLS_ALL: 'fetch_workcells_all' as const,
    WORKCELLS_BY_SITE: 'fetch_workcells_by_site' as const,
    
    // Crow model functions
    MODELS_ALL: 'fetch_crowmodels_all' as const,
    MODELS_BY_MANUFACTURER: 'fetch_crowmodels_by_manufacturer' as const,
    MODEL_DETAILS: 'fetch_crowmodel_details' as const,
    
    // OS version functions
    OS_VERSIONS_ALL: 'fetch_os_versions_all' as const,
    OS_VERSIONS_BY_MODEL: 'fetch_os_versions_by_model' as const,
    
    // Crow functions
    CROWS_ALL: 'fetch_crows_all' as const,
    CROWS_BY_STATUS: 'fetch_crows_by_status' as const,
    CROWS_BY_SITE: 'fetch_crows_by_site_and_status' as const
  }
};

/**
 * Type guard for API operation validation
 * @param operation Any string to check against valid API operations
 * @returns True if operation is valid, false otherwise
 */
export function isValidOperation(operation: string): operation is keyof typeof API_OPERATIONS {
  return Object.values(API_OPERATIONS).includes(operation as any);
}

/**
 * API error types - standardized across the application
 */
export const API_ERROR_TYPES = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  RESOURCE_NOT_FOUND: 'ResourceNotFoundError',
  STATE_TRANSITION_ERROR: 'StateTransitionError',
  DATABASE_ERROR: 'DatabaseError',
  CONFIGURATION_ERROR: 'ConfigurationError',
  INTERNAL_SERVER_ERROR: 'InternalServerError'
};

/**
 * Complete API Configuration object that combines all sub-configurations
 */
export const API_CONFIG = {
  BASE: API_BASE,
  ENDPOINTS: API_ENDPOINTS,
  OPERATIONS: API_OPERATIONS,
  FUNCTIONS: API_FUNCTIONS,
  ERROR_TYPES: API_ERROR_TYPES,
  
  /**
   * Helper method to build complete API URL for an endpoint
   * @param endpoint The API endpoint to call
   * @returns Fully formatted URL
   */
  getUrl: (endpoint: string): string => {
    const baseUrl = API_BASE.URL.endsWith('/') 
      ? API_BASE.URL.slice(0, -1) 
      : API_BASE.URL;
    
    const formattedEndpoint = endpoint.startsWith('/') 
      ? endpoint 
      : `/${endpoint}`;
    
    return `${baseUrl}${formattedEndpoint}`;
  },
  
  /**
   * Helper method to get authentication headers
   * @param token JWT authentication token
   * @returns Headers object with auth token
   */
  getAuthHeaders: (token: string): Record<string, string> => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
};

/**
 * Common types for API requests and responses
 */

/**
 * Base API request interface
 */
export interface ApiRequest<T = any> {
  operation: string;
  body: T;
}

/**
 * Base API response interface
 * All API response types should extend this
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  body: {
    success: boolean;
    requestId?: string;
    data?: T;
    error?: {
      type: string;
      message: string;
    };
  };
}

// Export default for easier imports
export default API_CONFIG;