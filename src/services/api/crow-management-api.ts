/**
 * Night's Watch Crow Management System API Service
 * 
 * This file provides type definitions, interfaces, and helper functions for 
 * interacting with the Night's Watch Crow Management System API. It handles
 * request/response types for all the core operations (provision, receive, deploy, etc.)
 * and provides a consistent interface for making API calls.
 * 
 * @author Night's Watch Front-End Development Team
 * @last-updated 2025-03-19
 */

// =============== Common Types and Interfaces ===============

/**
 * Core status type definitions used throughout the system
 */
export type CrowStatus = 'Provisioned' | 'Received' | 'Deployed' | 'Retired';
export type MonitoringStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type OperationType = 'provision' | 'receive' | 'deploy' | 'suspendreactivate' | 'replace' | 'transfer' | 'retire';

/**
 * Standard API request interface - follows the pattern defined in apiService.ts
 * for consistency across the application
 */
export interface ApiRequest<T = any> {
  operation: string;  // Operation identifier
  body: T;            // Request body specific to the operation
}

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  body: {
    success: boolean;
    data?: T;
    error?: {
      type: string;
      message: string;
    };
    requestId?: string;
  };
}

// =============== API Configuration ===============

/**
 * API endpoints and operation constants
 */
export const API_CONFIG = {
  ENDPOINTS: {
    MANAGE_CROW_USERS: 'manageCrowUsers',    // For workflow operations (provision, receive, deploy, etc.)
    MANAGE_CROW_FORMS: 'manageCrowForms',    // For form data operations (dropdowns, options, etc.)
    MANAGE_CROW_DEVICES: 'manageCrowDevices' // For device operations (check-in, etc.)
  },
  OPERATIONS: {
    PROVISION: 'provision',
    RECEIVE: 'receive',
    DEPLOY: 'deploy',
    REPLACE: 'replace',
    TRANSFER: 'transfer',
    SUSPEND_REACTIVATE: 'suspendreactivate',
    RETIRE: 'retire'
  },
  FUNCTIONS: {
    // Provision functions
    PROVISION_SINGLE: 'provision',
    PROVISION_BATCH: 'batch_provision',
    // Receive functions
    RECEIVE_SINGLE: 'receive',
    RECEIVE_BATCH: 'batch_receive',
    // Deploy functions
    DEPLOY: 'deploy',
    // SuspendReactivate functions
    SUSPEND: 'suspend',
    REACTIVATE: 'reactivate',
    SUSPEND_SITE: 'suspend_site',
    REACTIVATE_SITE: 'reactivate_site',
    // Replace functions
    REPLACE: 'replace',
    // Transfer functions
    TRANSFER: 'transfer',
    TRANSFER_BATCH: 'batch_transfer',
    // Retire functions
    RETIRE: 'retire'
  }
};

// =============== 1. Provision API Types ===============

export namespace ProvisionApi {
  /**
   * Single provision request body
   */
  export interface SingleProvisionBody {
    function: typeof API_CONFIG.FUNCTIONS.PROVISION_SINGLE;
    crow_id: string;
    manufacturer: string;
    model: string;
    firmware_version: string;
    notes?: string;
    [key: string]: any; // Additional attributes for future extensibility
  }
  
  /**
   * Batch provision request body using CSV data
   */
  export interface BatchProvisionCsvBody {
    function: typeof API_CONFIG.FUNCTIONS.PROVISION_BATCH;
    csvData: string;
    validation_only: boolean;
  }
  
  /**
   * Batch provision request body using a list of crow objects
   */
  export interface BatchProvisionListBody {
    function: typeof API_CONFIG.FUNCTIONS.PROVISION_BATCH;
    crow_list: Array<{
      crow_id: string;
      manufacturer: string;
      model: string;
      firmware_version: string;
    }>;
    validation_only: boolean;
  }
  
  /**
   * Union type for all provision request bodies
   */
  export type ProvisionBody = SingleProvisionBody | BatchProvisionCsvBody | BatchProvisionListBody;
  
  /**
   * Full provision request with operation and body
   */
  export type ProvisionRequest = ApiRequest<ProvisionBody>;
  
  /**
   * Single provision response data
   */
  export interface SingleProvisionData {
    crow: {
      crow_id: string;
      status: CrowStatus;
      provisioned_date: string;
      provisioned_by: string;
    };
  }
  
  /**
   * Batch provision response data
   */
  export interface BatchProvisionData {
    provision_results: Array<{
      crow_id: string;
      success: boolean;
      message?: string;
    }>;
    successful_count: number;
    failed_count: number;
  }
  
  /**
   * Union type for provision response data
   */
  export type ProvisionResponseData = SingleProvisionData | BatchProvisionData;
  
  /**
   * Full provision response
   */
  export type ProvisionResponse = ApiResponse<ProvisionResponseData>;
}

// =============== 2. Receive API Types ===============

export namespace ReceiveApi {
  /**
   * Single receive request body
   */
  export interface SingleReceiveBody {
    function: typeof API_CONFIG.FUNCTIONS.RECEIVE_SINGLE;
    crow_id: string;
    site_id: string;
    notes?: string;
  }
  
  /**
   * Batch receive request body
   */
  export interface BatchReceiveBody {
    function: typeof API_CONFIG.FUNCTIONS.RECEIVE_BATCH;
    crow_ids: string[];
    site_id: string;
    notes?: string;
  }
  
  /**
   * Union type for all receive request bodies
   */
  export type ReceiveBody = SingleReceiveBody | BatchReceiveBody;
  
  /**
   * Full receive request with operation and body
   */
  export type ReceiveRequest = ApiRequest<ReceiveBody>;
  
  /**
   * Single receive response data
   */
  export interface SingleReceiveData {
    crow: {
      crow_id: string;
      status: CrowStatus;
      site_id: string;
      received_date: string;
      received_by: string;
    };
  }
  
  /**
   * Batch receive response data
   */
  export interface BatchReceiveData {
    site_id: string;
    results: {
      successful: string[];
      failed: Array<{ crow_id: string; error: string }>;
    };
    successful_count: number;
    failed_count: number;
  }
  
  /**
   * Union type for receive response data
   */
  export type ReceiveResponseData = SingleReceiveData | BatchReceiveData;
  
  /**
   * Full receive response
   */
  export type ReceiveResponse = ApiResponse<ReceiveResponseData>;
}

// =============== 3. Deploy API Types ===============

export namespace DeployApi {
  /**
   * Deploy request body
   */
  export interface DeployBody {
    function: typeof API_CONFIG.FUNCTIONS.DEPLOY;
    crow_id: string;
    workcell_id: string;
    notes?: string;
  }
  
  /**
   * Full deploy request with operation and body
   */
  export type DeployRequest = ApiRequest<DeployBody>;
  
  /**
   * Deploy response data
   */
  export interface DeployData {
    crow: {
      crow_id: string;
      status: CrowStatus;
      site_id: string;
      workcell_id: string;
      deployment_date: string;
      deployed_by: string;
    };
    workcell: {
      workcell_id: string;
      is_protected: boolean;
      protected_by: string;
      protection_date: string;
    };
  }
  
  /**
   * Full deploy response
   */
  export type DeployResponse = ApiResponse<DeployData>;
}

// =============== 4. SuspendReactivate API Types ===============

export namespace SuspendReactivateApi {
  /**
   * Suspend request body
   */
  export interface SuspendBody {
    function: typeof API_CONFIG.FUNCTIONS.SUSPEND;
    crow_id: string;
    reason: string;
    duration_hours?: number;
  }
  
  /**
   * Reactivate request body
   */
  export interface ReactivateBody {
    function: typeof API_CONFIG.FUNCTIONS.REACTIVATE;
    crow_id: string;
    reason: string;
  }
  
  /**
   * Suspend site request body
   */
  export interface SuspendSiteBody {
    function: typeof API_CONFIG.FUNCTIONS.SUSPEND_SITE;
    site_id: string;
    reason: string;
    duration_hours?: number;
  }
  
  /**
   * Reactivate site request body
   */
  export interface ReactivateSiteBody {
    function: typeof API_CONFIG.FUNCTIONS.REACTIVATE_SITE;
    site_id: string;
    reason: string;
  }
  
  /**
   * Union type for all suspend/reactivate request bodies
   */
  export type SuspendReactivateBody = SuspendBody | ReactivateBody | SuspendSiteBody | ReactivateSiteBody;
  
  /**
   * Full suspend/reactivate request with operation and body
   */
  export type SuspendReactivateRequest = ApiRequest<SuspendReactivateBody>;
  
  /**
   * Crow monitoring status response data
   */
  export interface CrowMonitoringData {
    crow_id: string;
    monitoring_status: MonitoringStatus;
    suspension_reason?: string;
    suspension_start?: string;
    suspension_end?: string;
  }
  
  /**
   * Site monitoring status response data
   */
  export interface SiteMonitoringData {
    site_id: string;
    monitoring_status: MonitoringStatus;
    affected_crows_count: number;
    suspension_reason?: string;
    suspension_start?: string;
    suspension_end?: string;
  }
  
  /**
   * Union type for suspend/reactivate response data
   */
  export type SuspendReactivateData = CrowMonitoringData | SiteMonitoringData;
  
  /**
   * Full suspend/reactivate response
   */
  export type SuspendReactivateResponse = ApiResponse<SuspendReactivateData>;
}

// =============== 5. Replace API Types ===============

export namespace ReplaceApi {
  /**
   * Replace request body
   */
  export interface ReplaceBody {
    function: typeof API_CONFIG.FUNCTIONS.REPLACE;
    deployed_crow_id: string;
    replacement_crow_id: string;
    reason: string;
    notes?: string;
  }
  
  /**
   * Full replace request with operation and body
   */
  export type ReplaceRequest = ApiRequest<ReplaceBody>;
  
  /**
   * Replace response data
   */
  export interface ReplaceData {
    previous_crow: {
      crow_id: string;
      status: CrowStatus;
      site_id: string;
      replacement_reason: string;
    };
    new_crow: {
      crow_id: string;
      status: CrowStatus;
      site_id: string;
      workcell_id: string;
      replacing: string;
    };
    workcell_id: string;
  }
  
  /**
   * Full replace response
   */
  export type ReplaceResponse = ApiResponse<ReplaceData>;
}

// =============== 6. Transfer API Types ===============

export namespace TransferApi {
  /**
   * Transfer request body
   */
  export interface TransferBody {
    function: typeof API_CONFIG.FUNCTIONS.TRANSFER;
    crow_id: string;
    reason: string;
    destination_site_id: string;
    notes?: string;
  }
  
  /**
   * Batch transfer request body
   */
  export interface BatchTransferBody {
    function: typeof API_CONFIG.FUNCTIONS.TRANSFER_BATCH;
    crow_ids: string[];
    reason: string;
    destination_site_id: string;
    notes?: string;
  }
  
  /**
   * Union type for all transfer request bodies
   */
  export type TransferBodyType = TransferBody | BatchTransferBody;
  
  /**
   * Full transfer request with operation and body
   */
  export type TransferRequest = ApiRequest<TransferBodyType>;
  
  /**
   * Single transfer response data
   */
  export interface TransferData {
    crow: {
      crow_id: string;
      status: CrowStatus;
      transfer_date: string;
      transfer_reason: string;
    };
    origin_site: string;
    destination_site: string;
  }
  
  /**
   * Batch transfer response data
   */
  export interface BatchTransferData {
    results: {
      successful: Array<{ crow_id: string; origin_site: string }>;
      failed: Array<{ crow_id: string; error: string }>;
    };
    successful_count: number;
    failed_count: number;
    destination_site: string;
  }
  
  /**
   * Union type for transfer response data
   */
  export type TransferResponseData = TransferData | BatchTransferData;
  
  /**
   * Full transfer response
   */
  export type TransferResponse = ApiResponse<TransferResponseData>;
}

// =============== 7. Retire API Types ===============

export namespace RetireApi {
  /**
   * Retire request body
   */
  export interface RetireBody {
    function: typeof API_CONFIG.FUNCTIONS.RETIRE;
    crow_id: string;
    confirmation_code: string;
    reason: string;
    notes?: string;
  }
  
  /**
   * Full retire request with operation and body
   */
  export type RetireRequest = ApiRequest<RetireBody>;
  
  /**
   * Retire response data
   */
  export interface RetireData {
    crow_id: string;
    previous_state: CrowStatus;
    crow: {
      crow_id: string;
      status: CrowStatus;
      retirement_date: string;
      retirement_reason: string;
    };
  }
  
  /**
   * Full retire response
   */
  export type RetireResponse = ApiResponse<RetireData>;
}

// =============== API Helper Functions ===============

/**
 * Generic function for making API calls to the Crow Management System
 * This function follows the same pattern and structure as callApi in apiService.ts
 * 
 * @param operation The operation type (provision, receive, deploy, etc.)
 * @param endpoint The API endpoint to call
 * @param requestBody The request body containing operation-specific data
 * @param token Authentication token
 * @param clientRequestId Optional request ID for tracking
 * @returns Promise with the API response
 */
export async function callCrowApi<T, R>(
  operation: OperationType,
  endpoint: string,
  requestBody: T,
  token: string,
): Promise<R> {
  try {
    // Create the API request structure
    const request: ApiRequest<T> = {
      operation: operation,
      body: requestBody
    };
    
    // Get the headers with authentication token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Log the request (with sensitive data redacted)
    console.debug('API Request:', {
      endpoint,
      operation,
      headers: {
        ...headers,
        Authorization: '[REDACTED]'
      }
    });
    
    // Make the API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    });
    
    // Parse the response based on content type
    const contentType = response.headers.get('content-type');
    let responseData: any;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const textResponse = await response.text();
      responseData = {
        statusCode: response.status,
        body: {
          success: response.ok,
          data: textResponse
        }
      };
    }
    
    // Handle successful response
    if (response.ok) {
      return responseData;
    }
    
    // Handle error response
    const errorMessage = responseData.body?.error?.message || 
                         responseData.message || 
                         `Request failed with status: ${response.status}`;
    
    console.error('API error response:', {
      status: response.status,
      message: errorMessage,
      requestId: responseData.body?.requestId
    });
    
    throw new Error(errorMessage);
  } catch (error) {
    // Log and rethrow to allow component-level handling
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

/**
 * Helper utility to determine if a crow status can transition to another status
 * 
 * @param currentStatus The current crow status
 * @param targetStatus The target status to transition to
 * @returns Boolean indicating if the transition is valid
 */
export const isValidStatusTransition = (
  currentStatus: CrowStatus, 
  targetStatus: CrowStatus
): boolean => {
  const validTransitions: Record<CrowStatus, CrowStatus[]> = {
    'Provisioned': ['Received', 'Retired'],
    'Received': ['Deployed', 'Provisioned', 'Retired'],
    'Deployed': ['Received', 'Retired'],
    'Retired': [] // Terminal state
  };
  
  return validTransitions[currentStatus]?.includes(targetStatus) || false;
};

/**
 * Helper to validate a confirmation code for retiring a crow
 * The confirmation code must be the crow_id reversed
 * 
 * @param crowId The crow ID
 * @param code The confirmation code to validate
 * @returns Boolean indicating if the code is valid
 */
export const isValidConfirmationCode = (crowId: string, code: string): boolean => {
  return code === crowId.split('').reverse().join('');
};