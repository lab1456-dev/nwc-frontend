import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { 
  buildApiRequest, 
  callCrowApi,
  API_CONFIG,
  OperationType
} from '../services/api/crow-management-api';
import type { ApiRequest, ApiResponse } from '../services/api/crow-management-api';

/**
 * Custom hook for interacting with Crow Management APIs
 * Provides standardized methods for API calls with authentication and state management
 */
export const useCrowApi = <RequestType extends ApiRequest, ResponseType extends ApiResponse>(
  operation: OperationType,
  endpoint: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<ResponseType | null>(null);
  
  const { getAuthToken } = useAuthContext();
  
  /**
   * Make an API request with the provided data
   */
  const executeRequest = async (requestBody: RequestType): Promise<ResponseType | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Get auth token
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please sign in again.');
      }
      
      // Call the API
      const response = await callCrowApi<RequestType, ResponseType>(
        operation,
        endpoint,
        requestBody,
        token
      );
      
      // Update state with response
      setData(response);
      setSuccess(true);
      return response;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Reset the hook state
   */
  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
    setData(null);
  };
  
  return {
    executeRequest,
    isLoading,
    error,
    success,
    data,
    reset,
    setSuccess,
    setError
  };
};