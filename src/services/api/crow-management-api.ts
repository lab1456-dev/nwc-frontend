/**
 * Night's Watch Crow Management System API Specification
 * 
 * This file defines the interfaces and types for integrating with the 
 * Crow Management System API. It includes all the request and response
 * structures for the seven worker APIs.
 */

// Common Types
export type CrowStatus = 'provisioned' | 'received' | 'deployed' | 'retired';
export type MonitoringStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type OperationType = 'provision' | 'receive' | 'deploy' | 'suspendreactivate' | 'replace' | 'transfer' | 'retire';

// Base Interfaces
/**
 * Complete API Request Structure
 * 
 * The Night's Watch Crow Management System API follows a specific pattern with required metadata:
 * - _metadata.operation: Identifies the high-level API operation category (required)
 * - function: Specifies the particular function variant within that operation (required)
 * 
 * Example:
 * {
 *   _metadata: {
 *     operation: "provision",  // High-level operation category
 *     requestId: "client-123"  // Optional client tracking ID
 *   },
 *   _user: {  // Often added by API Gateway authorizer
 *     username: "jon.snow",
 *     groups: ["Operators"]
 *   },
 *   body: {  // The actual payload
 *     function: "batch_provision",  // Specific function variant
 *     crow_ids: ["CROW001", "CROW002"],
 *     manufacturer: "NightsWatchTech",
 *     ...
 *   }
 * }
 */
interface BaseApiRequest {
  _metadata: {
    operation: OperationType;  // High-level operation type
    requestId?: string;        // Optional client-generated request ID for tracking
  };
  _user?: {                    // User context (often added by API Gateway authorizer)
    username: string;
    groups: string[];
  };
  body: ApiRequestBody;        // The actual request payload
}

// The payload structure to be sent in the 'body' property
interface ApiRequestBody {
  function: string;          // Specific function variant
  [key: string]: any;        // Additional parameters specific to the function
}

// What most client code will work with (the body portion)
interface ApiRequest {
  function: string;
  [key: string]: any;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  requestId: string;
  execution_time_ms?: number;
  [key: string]: any;
}

// Error Response
interface ErrorResponse extends ApiResponse {
  error?: string;
}

// =============== 1. Provision Worker APIs ===============

export namespace ProvisionApi {
  // Single provision
  export interface ProvisionRequest extends ApiRequest {
    function: 'provision';
    crow_id: string;
    manufacturer: string;
    model: string;
    firmware_version: string;
    [key: string]: any; // Additional attributes
  }
  
  // Batch provision
  export interface BatchProvisionRequest extends ApiRequest {
    function: 'batch_provision';
    crow_ids: string[];
    manufacturer: string;
    model: string;
    firmware_version?: string;
    [key: string]: any; // Additional attributes
  }
  
  export interface ProvisionResponse extends ApiResponse {
    crow_id: string;
    status: CrowStatus;
  }
  
  export interface BatchProvisionResponse extends ApiResponse {
    results: {
      successful: string[];
      failed: Array<{ crow_id: string; error: string }>;
    };
  }
  
  // Usage example
  export const example = {
    singleProvisionRequest: {
      function: 'provision',
      crow_id: 'CROW001',
      manufacturer: 'NightsWatchTech',
      model: 'Raven-X1',
      firmware_version: '1.0.2'
    } as ProvisionRequest,
    
    batchProvisionRequest: {
      function: 'batch_provision',
      crow_ids: ['CROW002', 'CROW003', 'CROW004'],
      manufacturer: 'NightsWatchTech',
      model: 'Raven-X1',
      firmware_version: '1.0.2'
    } as BatchProvisionRequest
  };
}

// =============== 2. Receive Worker APIs ===============

export namespace ReceiveApi {
  export interface ReceiveRequest extends ApiRequest {
    function: 'receive';
    crow_id: string;
    site_id: string;
    reason?: string;
  }
  
  export interface BatchReceiveRequest extends ApiRequest {
    function: 'batch_receive';
    crow_ids: string[];
    site_id: string;
    reason?: string;
  }
  
  export interface ReceiveResponse extends ApiResponse {
    crow_id: string;
    site_id: string;
    status: CrowStatus;
  }
  
  export interface BatchReceiveResponse extends ApiResponse {
    site_id: string;
    results: {
      successful: string[];
      failed: Array<{ crow_id: string; error: string }>;
    };
  }
  
  // Usage example
  export const example = {
    receiveRequest: {
      function: 'receive',
      crow_id: 'CROW001',
      site_id: 'SITE001'
    } as ReceiveRequest,
    
    batchReceiveRequest: {
      function: 'batch_receive',
      crow_ids: ['CROW002', 'CROW003', 'CROW004'],
      site_id: 'SITE001',
      reason: 'Received from manufacturer shipment #12345'
    } as BatchReceiveRequest
  };
}

// =============== 3. Deploy Worker APIs ===============

export namespace DeployApi {
  export interface DeployRequest extends ApiRequest {
    function: 'deploy';
    crow_id: string;
    workcell_id: string;
    reason?: string;
  }
  
  export interface DeployResponse extends ApiResponse {
    crow_id: string;
    workcell_id: string;
    site_id: string;
    status: CrowStatus;
    monitoring_status: MonitoringStatus;
  }
  
  // Usage example
  export const example = {
    deployRequest: {
      function: 'deploy',
      crow_id: 'CROW001',
      workcell_id: 'WORKCELL001',
      reason: 'Initial deployment for north wall monitoring'
    } as DeployRequest
  };
}

// =============== 4. SuspendReactivate Worker APIs ===============

export namespace MonitoringControlApi {
  export interface SuspendRequest extends ApiRequest {
    function: 'suspend';
    crow_id: string;
    reason: string; // Required
  }
  
  export interface ReactivateRequest extends ApiRequest {
    function: 'reactivate';
    crow_id: string;
    reason: string; // Required
  }
  
  export interface SuspendSiteRequest extends ApiRequest {
    function: 'suspend_site';
    site_id: string;
    reason: string; // Required
  }
  
  export interface ReactivateSiteRequest extends ApiRequest {
    function: 'reactivate_site';
    site_id: string;
    reason: string; // Required
  }
  
  export interface MonitoringControlResponse extends ApiResponse {
    crow_id?: string;
    site_id?: string;
    monitoring_status: MonitoringStatus;
  }
  
  export interface SuspendSiteResponse extends MonitoringControlResponse {
    site_id: string;
    affected_crows_count: number;
  }
  
  // Usage example
  export const example = {
    suspendRequest: {
      function: 'suspend',
      crow_id: 'CROW001',
      reason: 'Maintenance required - unstable readings'
    } as SuspendRequest,
    
    suspendSiteRequest: {
      function: 'suspend_site',
      site_id: 'SITE001',
      reason: 'Planned site maintenance'
    } as SuspendSiteRequest
  };
}

// =============== 5. Replace Worker APIs ===============

export namespace ReplaceApi {
  export interface ReplaceRequest extends ApiRequest {
    function: 'replace';
    current_crow_id: string;
    replacement_crow_id: string;
    reason?: string;
  }
  
  export interface ReplaceResponse extends ApiResponse {
    retired_crow_id: string;
    deployed_crow_id: string;
    site_id: string;
    workcell_id: string;
  }
  
  // Usage example
  export const example = {
    replaceRequest: {
      function: 'replace',
      current_crow_id: 'CROW001',
      replacement_crow_id: 'CROW005',
      reason: 'Replacing defective unit'
    } as ReplaceRequest
  };
}

// =============== 6. Transfer Worker APIs ===============

export namespace TransferApi {
  export interface TransferRequest extends ApiRequest {
    function: 'transfer';
    crow_id: string;
    reason: string; // Required
  }
  
  export interface BatchTransferRequest extends ApiRequest {
    function: 'batch_transfer';
    crow_ids: string[];
    reason: string; // Required
  }
  
  export interface TransferResponse extends ApiResponse {
    crow_id: string;
    previous_site_id: string;
    status: CrowStatus;
  }
  
  export interface BatchTransferResponse extends ApiResponse {
    results: {
      successful: Array<{ crow_id: string; previous_site_id: string }>;
      failed: Array<{ crow_id: string; error: string }>;
    };
  }
  
  // Usage example
  export const example = {
    transferRequest: {
      function: 'transfer',
      crow_id: 'CROW001',
      reason: 'Transferring to Castle Black'
    } as TransferRequest
  };
}

// =============== 7. Retire Worker APIs ===============

export namespace RetireApi {
  export interface RetireRequest extends ApiRequest {
    function: 'retire';
    crow_id: string;
    confirmation_code: string; // Must be crow_id spelled backwards
    reason: string; // Required
  }
  
  export interface RetireResponse extends ApiResponse {
    crow_id: string;
    status: CrowStatus;
    previous_status: CrowStatus;
    retired_by: string;
    retired_at: string;
    site_id?: string;
    workcell_id?: string;
  }
  
  // Usage example
  export const example = {
    retireRequest: {
      function: 'retire',
      crow_id: 'CROW001',
      confirmation_code: '100WORC', // CROW001 backwards
      reason: 'End of service life'
    } as RetireRequest
  };
}

// =============== API URLs and Configuration ===============

export const API_CONFIG = {
  baseUrl: '/api/nightswatch',
  endpoints: {
    provision: '/provision',
    receive: '/receive',
    deploy: '/deploy',
    suspendReactivate: '/monitoring',
    replace: '/replace',
    transfer: '/transfer',
    retire: '/retire'
  },
  // Add the required authorization header
  getAuthHeader: (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
};

// =============== Helper Functions ===============

/**
 * Builds a complete API request with the required metadata structure
 */
export const buildApiRequest = (
  operation: OperationType,
  requestBody: ApiRequest,
  clientRequestId?: string
): BaseApiRequest => {
  return {
    _metadata: {
      operation,
      requestId: clientRequestId || `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    },
    body: requestBody
  };
};

/**
 * Helper utility to determine if a crow status can transition to another status
 */
export const isValidStatusTransition = (
  currentStatus: CrowStatus, 
  targetStatus: CrowStatus
): boolean => {
  const validTransitions: Record<CrowStatus, CrowStatus[]> = {
    'provisioned': ['received', 'retired'],
    'received': ['deployed', 'provisioned', 'retired'],
    'deployed': ['retired'],
    'retired': [] // Terminal state
  };
  
  return validTransitions[currentStatus]?.includes(targetStatus) || false;
};

/**
 * Helper to validate a confirmation code for retiring a crow
 */
export const isValidConfirmationCode = (crowId: string, code: string): boolean => {
  return code === crowId.split('').reverse().join('');
};

/**
 * Generic function for making API calls to the Crow Management System
 */
export const callCrowApi = async <T extends ApiRequest, R extends ApiResponse>(
  operation: OperationType,
  endpoint: string,
  requestBody: T,
  token: string,
  clientRequestId?: string
): Promise<R> => {
  try {
    // Build the complete API request structure
    const completeRequest = buildApiRequest(operation, requestBody, clientRequestId);
    
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: API_CONFIG.getAuthHeader(token),
      body: JSON.stringify(completeRequest)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data as R;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Usage Example:
 * 
 * // In a React component:
 * const handleProvisionCrow = async () => {
 *   try {
 *     const requestBody: ProvisionApi.ProvisionRequest = {
 *       function: 'provision',
 *       crow_id: 'CROW001',
 *       manufacturer: 'NightsWatchTech',
 *       model: 'Raven-X1',
 *       firmware_version: '1.0.2'
 *     };
 *     
 *     const response = await callCrowApi<
 *       ProvisionApi.ProvisionRequest, 
 *       ProvisionApi.ProvisionResponse
 *     >(
 *       'provision',
 *       API_CONFIG.endpoints.provision,
 *       requestBody,
 *       authToken
 *     );
 *     
 *     console.log('Crow provisioned:', response);
 *   } catch (error) {
 *     console.error('Failed to provision crow:', error);
 *   }
 * };
 */
