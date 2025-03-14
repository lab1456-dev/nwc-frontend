/**
 * Form API Operations
 * Functions for interacting with the manageCrowForms endpoint
 */

import { ENDPOINTS, OPERATIONS } from './apiConfig';
import { makeApiRequest } from './apiUtils';
import type { 
  ApiResponse, 
  GetCrowsRequest,
  GetSitesRequest,
  GetWorkCellsRequest,
  GetCrowModelsRequest,
  GetOsVersionsRequest,
  Site,
  WorkCell,
  CrowModel,
  OsVersion,
  Crow
} from './apiTypes';

/**
 * Get Crows by status and optionally ID
 * @param data Crow query parameters
 * @param token Auth token
 * @returns Promise resolving to API response with Crows
 */
export const getCrows = async (
  data: GetCrowsRequest,
  token: string
): Promise<ApiResponse<{crows: Crow[], count: number}>> => {
  return makeApiRequest(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.CROWS,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Get Sites by ID (or all sites)
 * @param data Site query parameters
 * @param token Auth token
 * @returns Promise resolving to API response with Sites
 */
export const getSites = async (
  data: GetSitesRequest,
  token: string
): Promise<ApiResponse<{sites: Site[], count: number}>> => {
  return makeApiRequest<{sites: Site[], count: number}>(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.SITES,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Get Work Cells by site and optionally ID
 * @param data Work Cell query parameters
 * @param token Auth token
 * @returns Promise resolving to API response with Work Cells
 */
export const getWorkCells = async (
  data: GetWorkCellsRequest,
  token: string
): Promise<ApiResponse<{workcells: WorkCell[], count: number}>> => {
  return makeApiRequest(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.WORKCELLS,
      ...data
    },
    'Bearer',
    token
  );
};
/**
 * Get OS Version by site and optionally ID
 * @param data Work Cell query parameters
 * @param token Auth token
 * @returns Promise resolving to API response with Work Cells
 */
export const getOsVersion = async (
  data:  GetOsVersionsRequest,
  token: string
): Promise<ApiResponse<{workcells: OsVersion[], count: number}>> => {
  return makeApiRequest(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.WORKCELLS,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Get Crow Models by manufacturer and optionally model
 * @param manufacturerId Optional manufacturer ID
 * @param modelId Optional model ID
 * @param token Optional auth token
 * @returns Promise resolving to API response with Crow Models
 */
export const getCrowModels = async (
  manufacturerId?: string,
  modelId?: string,
  token?: string
): Promise<ApiResponse<CrowModel[]>> => {
  const data: GetCrowModelsRequest = {};
  
  if (manufacturerId) {
    data.manufacturer = manufacturerId;
  }
  
  if (modelId) {
    data.model = modelId;
  }
  
  return makeApiRequest(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.CROW_MODELS,
      ...data
    },
    token ? 'Bearer' : 'None',
    token
  );
};

/**
 * Get active OS image versions
 * @param token Optional auth token
 * @returns Promise resolving to API response with OS Versions
 */
export const getOsVersions = async (
  token?: string
): Promise<ApiResponse<OsVersion[]>> => {
  return makeApiRequest(
    ENDPOINTS.FORMS,
    { operation: OPERATIONS.FORM.OS_VERSIONS },
    token ? 'Bearer' : 'None',
    token
  );
};

/**
 * Get available Crows for a specific site
 * @param siteId The site ID to filter crows by
 * @param status The status to filter crows by (defaults to 'received')
 * @param token Auth token
 * @returns Promise resolving to API response with available Crows
 */
export const getAvailableCrowsForSite = async (
  siteId: string,
  status: string = 'received',
  token: string
): Promise<ApiResponse<{crows: Crow[], count: number}>> => {
  return makeApiRequest(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.CROWS,
      site_id: siteId,
      status: status
    },
    'Bearer',
    token
  );
};

/**
 * Get work cells for a specific site
 * @param siteId The site ID to filter work cells by
 * @param token Auth token
 * @returns Promise resolving to API response with work cells
 */
export const getWorkCellsForSite = async (
  siteId: string,
  token: string
): Promise<ApiResponse<{workcells: WorkCell[], count: number}>> => {
  return makeApiRequest(
    ENDPOINTS.FORMS,
    {
      operation: OPERATIONS.FORM.WORKCELLS,
      site_id: siteId
    },
    'Bearer',
    token
  );
};

/**
 * Get user groups for the current user
 * @param token Auth token
 * @returns Promise resolving to API response with user groups
 */
export const getUserGroups = async (
  token: string
): Promise<ApiResponse<string[]>> => {
  return makeApiRequest(
    ENDPOINTS.USER_GROUPS,
    { operation: OPERATIONS.USER_GROUP.GET_GROUPS },
    'Bearer',
    token
  );
};