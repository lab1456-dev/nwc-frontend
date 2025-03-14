/**
 * Device API Operations
 * Functions for interacting with the manageCrowDevices endpoint
 */

import { ENDPOINTS, OPERATIONS } from './apiConfig';
import { makeApiRequest } from './apiUtils';
import type { 
  ApiResponse, 
  CheckInRequest,
  VersionRequest,
  ConfigRequest
} from './apiTypes';

/**
 * Send a check-in heartbeat from a Crow device
 * @param data Crow check-in information
 * @param token Device-specific auth token
 * @returns Promise resolving to API response
 */
export const checkInCrow = async (
  data: CheckInRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.DEVICES,
    {
      operation: OPERATIONS.DEVICE.CHECK_IN,
      ...data
    },
    'Bearer',
    token,
    { 'device-auth': 'true' } // Special header for device auth
  );
};

/**
 * Check for new versions available for a Crow
 * @param data Crow version information
 * @param token Device-specific auth token
 * @returns Promise resolving to API response
 */
export const checkCrowVersion = async (
  data: VersionRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.DEVICES,
    {
      operation: OPERATIONS.DEVICE.VERSION,
      ...data
    },
    'Bearer',
    token,
    { 'device-auth': 'true' }
  );
};

/**
 * Fetch configuration for a Crow device
 * @param data Crow configuration request
 * @param token Device-specific auth token
 * @returns Promise resolving to API response
 */
export const fetchCrowConfig = async (
  data: ConfigRequest,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    ENDPOINTS.DEVICES,
    {
      operation: OPERATIONS.DEVICE.CONFIG,
      ...data
    },
    'Bearer',
    token,
    { 'device-auth': 'true' }
  );
};