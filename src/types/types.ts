/**
 * Common type definitions used across components
 */

// Form data types
export interface CrowFormData {
  crow_id: string;
  site_id: string;
  work_cell_id?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Authentication types
export type AuthMethod = 'Crow' | 'Device' | 'Bearer' | 'ApiKey';

// Status types
export type CrowStatus = 
  | 'provisioned' 
  | 'received' 
  | 'deployed' 
  | 'suspended' 
  | 'reactivated' 
  | 'retired' 
  | 'transferred' 
  | 'replaced';

// Step types for API calls
export type WorkflowStep =
  | 'provisioned'
  | 'received'
  | 'deployed'
  | 'replaced'
  | 'transfer'
  | 'suspend'
  | 'reactivate'
  | 'retire';
