/**
 * User API Operations
 * Functions for interacting with the manageCrowUsers endpoint
 */

import { ENDPOINTS, OPERATIONS } from './apiConfig';
import { makeApiRequest } from './apiUtils';
import type { 
  ApiResponse, 
  ProvisionRequest,
  ReceiveRequest,
  DeployRequest,
  ReplaceRequest,
  TransferRequest,
  SuspendReactivateRequest,
  RetireRequest
} from './apiTypes';

/**
 * Provision a new Crow in the system
 * @param data Crow provisioning information
 * @returns Promise resolving to API response
 */
export const provisionCrow = async (
  data: ProvisionRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.PROVISION,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Receive a Crow at a specific site
 * @param data Crow and site information
 * @param token Auth token
 * @returns Promise resolving to API response
 */
export const receiveCrow = async (
  data: ReceiveRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.RECEIVE,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Deploy a Crow to a work cell
 * @param data Crow, site, and work cell information
 * @param token Auth token
 * @returns Promise resolving to API response
 */
export const deployCrow = async (
  data: DeployRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.DEPLOY,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Replace an existing Crow with a new one
 * @param data Crow replacement information
 * @param token Auth token
 * @returns Promise resolving to API response
 */
export const replaceCrow = async (
  data: ReplaceRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.REPLACE,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Transfer a Crow to a different site
 * @param data Crow transfer information
 * @param token Auth token
 * @returns Promise resolving to API response
 */
export const transferCrow = async (
  data: TransferRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.TRANSFER,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Suspend or reactivate monitoring for a Crow
 * @param data Crow suspension/reactivation information
 * @param token Auth token
 * @param isReactivation Whether this is a reactivation (true) or suspension (false)
 * @returns Promise resolving to API response
 */
export const toggleCrowMonitoring = async (
  data: SuspendReactivateRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.SUSPEND_REACTIVATE,
      ...data
    },
    'Bearer',
    token
  );
};

/**
 * Retire a Crow from service
 * @param data Crow retirement information
 * @param token Auth token
 * @returns Promise resolving to API response
 */
export const retireCrow = async (
  data: RetireRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.USERS,
    {
      operation: OPERATIONS.USER.RETIRE,
      ...data
    },
    'Bearer',
    token
  );
};