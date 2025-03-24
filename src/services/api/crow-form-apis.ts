/**
 * Night's Watch Crow Management System Form API Specification
 * 
 * TypeScript interfaces for the form API endpoints that support React UI elements
 * with dropdowns, validations, and data relationships.
 */

// Common Types
export type FormOperationType = 'form';
export type CrowStatus = 'provisioned' | 'received' | 'deployed' | 'retired';
export type MonitoringStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

// Base Interfaces
interface FormApiRequest {
  _metadata: {
    operation: FormOperationType;  // Always 'form'
    requestId?: string;
  };
  _user?: {
    username: string;
    groups: string[];
  };
  body: FormRequestBody;
}

interface FormRequestBody {
  function: string;
  [key: string]: any;
}

interface FormApiResponse {
  statusCode: number;
  message: string;
  requestId: string;
  execution_time_ms?: number;
  [key: string]: any;
}

// =============== Crows Form API ===============

export namespace CrowsFormApi {
  export interface FetchAllCrowsRequest extends FormRequestBody {
    function: 'fetch_crows_all';
    limit?: number;
  }
  
  export interface FetchCrowsByStatusRequest extends FormRequestBody {
    function: 'fetch_crows_by_status';
    status: CrowStatus;
  }
  
  export interface FetchCrowsBySiteRequest extends FormRequestBody {
    function: 'fetch_crows_by_site';
    site_id: string;
  }
  
  export interface FetchCrowDetailsRequest extends FormRequestBody {
    function: 'fetch_crows_details';
    crow_id: string;
  }
  
  export interface FetchAvailableCrowsRequest extends FormRequestBody {
    function: 'fetch_available_crows';
    operation: string; // 'receive', 'deploy', 'suspend', etc.
  }
  
  export interface CrowsResponse extends FormApiResponse {
    crows: Array<{
      crow_id: string;
      status: CrowStatus;
      site_id?: string;
      workcell_id?: string;
      manufacturer?: string;
      model?: string;
      [key: string]: any;
    }>;
    count: number;
  }
  
  export interface CrowDetailsResponse extends FormApiResponse {
    crow: {
      crow_id: string;
      status: CrowStatus;
      site_id?: string;
      workcell_id?: string;
      manufacturer: string;
      model: string;
      firmware_version: string;
      monitoring_status?: MonitoringStatus;
      [key: string]: any;
    };
  }
}

// =============== Crow Models Form API ===============

export namespace CrowModelsFormApi {
  export interface FetchAllModelsRequest extends FormRequestBody {
    function: 'fetch_crowmodels_all';
  }
  
  export interface FetchModelsByManufacturerRequest extends FormRequestBody {
    function: 'fetch_crowmodels_by_manufacturer';
    manufacturer: string;
  }
  
  export interface FetchModelDetailsRequest extends FormRequestBody {
    function: 'fetch_crowmodel_details';
    manufacturer: string;
    model: string;
  }
  
  export interface ModelsResponse extends FormApiResponse {
    models: Array<{
      manufacturer: string;
      models?: string[];
      model?: string;
      specs?: {
        cpu?: string;
        ram?: string;
        storage?: string;
        [key: string]: any;
      };
      [key: string]: any;
    }>;
    count: number;
  }
  
  export interface ModelDetailsResponse extends FormApiResponse {
    model: {
      manufacturer: string;
      model: string;
      status: string;
      specs: {
        cpu: string;
        ram: string;
        storage: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

// =============== Sites Form API ===============

export namespace SitesFormApi {
  export interface FetchAllSitesRequest extends FormRequestBody {
    function: 'fetch_sites_all';
    limit?: number;
  }
  
  export interface FetchSiteDetailsRequest extends FormRequestBody {
    function: 'fetch_site_details';
    site_id: string;
  }
  
  export interface SitesResponse extends FormApiResponse {
    sites: Array<{
      site_id: string;
      name: string;
      location: string;
      [key: string]: any;
    }>;
    count: number;
  }
  
  export interface SiteDetailsResponse extends FormApiResponse {
    site: {
      site_id: string;
      name: string;
      location: string;
      [key: string]: any;
    };
  }
}

// =============== Workcells Form API ===============

export namespace WorkcellsFormApi {
  export interface FetchAllWorkcellsRequest extends FormRequestBody {
    function: 'fetch_workcells_all';
    limit?: number;
  }
  
  export interface FetchWorkcellsBySiteRequest extends FormRequestBody {
    function: 'fetch_workcells_by_site';
    site_id: string;
  }
  
  export interface FetchWorkcellDetailsRequest extends FormRequestBody {
    function: 'fetch_workcell_details';
    workcell_id: string;
  }
  
  export interface WorkcellsResponse extends FormApiResponse {
    workcells: Array<{
      workcell_id: string;
      site_id: string;
      name: string;
      [key: string]: any;
    }>;
    count: number;
  }
  
  export interface WorkcellDetailsResponse extends FormApiResponse {
    workcell: {
      workcell_id: string;
      site_id: string;
      name: string;
      [key: string]: any;
    };
  }
}

// =============== User Groups Form API ===============

export namespace UserGroupsFormApi {
  export interface FetchAllUserGroupsRequest extends FormRequestBody {
    function: 'fetch_usergroups_all';
  }
  
  export interface UserGroupsResponse extends FormApiResponse {
    userGroups: Array<{
      name: string;
      description: string;
      [key: string]: any;
    }>;
    count: number;
  }
}

// =============== Validation Rules API ===============

export namespace ValidationRulesFormApi {
  export interface FetchValidationRulesRequest extends FormRequestBody {
    function: 'fetch_validation_rules';
    operation: string; // 'provision', 'receive', etc.
  }
  
  export interface ValidationRulesResponse extends FormApiResponse {
    validation_rules: {
      [fieldName: string]: {
        required?: boolean;
        pattern?: string;
        message?: string;
        options?: string[] | string;
        depends_on?: string;
        min_length?: number;
        max_length?: number;
        min?: number;
        max?: number;
        status?: string;
        not_status?: string;
        monitoring_status?: string;
        special_validation?: string;
        [key: string]: any;
      };
    };
  }
}

// =============== Relationships API ===============

export namespace RelationshipsFormApi {
  export interface FetchSiteWorkcellsRequest extends FormRequestBody {
    function: 'fetch_site_workcells';
    site_id: string;
  }
  
  export interface FetchSiteSummaryRequest extends FormRequestBody {
    function: 'fetch_site_summary';
    site_id: string;
  }
  
  export interface FetchDependenciesRequest extends FormRequestBody {
    function: 'fetch_dependencies';
    operation: string; // 'provision', 'receive', etc.
  }
  
  export interface SiteWorkcellsResponse extends FormApiResponse {
    workcells: Array<{
      workcell_id: string;
      site_id: string;
      name: string;
      [key: string]: any;
    }>;
    count: number;
  }
  
  export interface SiteSummaryResponse extends FormApiResponse {
    site: {
      site_id: string;
      name: string;
      location: string;
      [key: string]: any;
    };
    workcells_count: number;
    crows_count: number;
    crows_by_status: {
      [status: string]: number;
    };
    monitoring_statuses: {
      [status: string]: number;
    };
  }
  
  export interface DependenciesResponse extends FormApiResponse {
    dependencies: {
      [field: string]: {
        affects: string;
        source: string;
      };
    };
  }
}

// =============== History API ===============

export namespace HistoryFormApi {
  export interface FetchCrowHistoryRequest extends FormRequestBody {
    function: 'fetch_crow_history';
    crow_id: string;
  }
  
  export interface FetchSiteHistoryRequest extends FormRequestBody {
    function: 'fetch_site_history';
    site_id: string;
  }
  
  export interface FetchRecentActivitiesRequest extends FormRequestBody {
    function: 'fetch_recent_activities';
    days?: number;
    limit?: number;
  }
  
  export interface HistoryResponse extends FormApiResponse {
    history: Array<{
      timestamp: string;
      user: string;
      action: string;
      details: any;
      [key: string]: any;
    }>;
    count: number;
  }
  
  export interface RecentActivitiesResponse extends FormApiResponse {
    activities: Array<{
      timestamp: string;
      entity_id: string;
      entity_type: string;
      user: string;
      action: string;
      details: any;
      [key: string]: any;
    }>;
    count: number;
    days: number;
  }
}

// =============== OS Versions Form API ===============

export namespace OSVersionsFormApi {
  export interface FetchAllOSVersionsRequest extends FormRequestBody {
    function: 'fetch_os_versions_all';
  }
  
  export interface FetchOSVersionsByModelRequest extends FormRequestBody {
    function: 'fetch_os_versions_by_model';
    manufacturer: string;
    model: string;
  }
  
  export interface FetchRecommendedVersionRequest extends FormRequestBody {
    function: 'fetch_recommended_version';
    manufacturer: string;
    model: string;
  }
  
  export interface OSVersionsResponse extends FormApiResponse {
    versions: Array<{
      version: string;
      release_date?: string;
      supported: boolean;
      recommended?: boolean;
    }>;
    count: number;
  }
  
  export interface RecommendedVersionResponse extends FormApiResponse {
    recommended_version: {
      version: string;
      release_date?: string;
      supported: boolean;
      recommended: boolean;
    };
  }
}

// Helper functions for API calls
export const API_CONFIG = {
  baseUrl: '/api/nightswatch',
  endpoints: {
    forms: '/manageCrowForms'
  },
  getAuthHeader: (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
};

/**
 * Builds a complete API request with the required metadata structure
 */
export const buildFormApiRequest = (
  requestBody: FormRequestBody,
  clientRequestId?: string
): FormApiRequest => {
  return {
    _metadata: {
      operation: 'form',
      requestId: clientRequestId || `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    },
    body: requestBody
  };
};

/**
 * Generic function for making API calls to the Form API
 */
export const callFormApi = async <T extends FormRequestBody, R extends FormApiResponse>(
  requestBody: T,
  token: string,
  clientRequestId?: string
): Promise<R> => {
  try {
    // Build the complete API request structure
    const completeRequest = buildFormApiRequest(requestBody, clientRequestId);
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.forms}`, {
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