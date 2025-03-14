/**
 * API Type Definitions
 * TypeScript interfaces and types for API requests and responses
 */

// API Response interface
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    requestId?: string;
  }
  
  // HTTP Methods
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
  
  // Authentication types
  export type AuthType = 'Bearer' | 'ApiKey' | 'None';
  
  // Common data interfaces
  export interface CrowData {
    crow_id: string;
    site_id?: string;
    work_cell_id?: string;
  }
  
  // User Operations
  
  export interface ProvisionRequest {
    crow_id: string;
    manufacturer: string;
    model: string;
    os_image_version: string;
  }
  
  export interface ReceiveRequest {
    crow_id: string;
    site_id: string;
  }
  
  export interface DeployRequest {
    crow_id: string;
    site_id: string;
    work_cell_id: string;
  }
  
  export interface ReplaceRequest {
    existing_crow_id: string;
    new_crow_id: string;
    site_id: string;
    work_cell_id: string;
  }
  
  export interface TransferRequest {
    crow_id: string;
    current_site_id: string;
  }
  
  export interface SuspendReactivateRequest {
    crow_id: string;
    site_id: string;
    work_cell_id: string;
    maintenance_window?: string;
  }
  
  export interface RetireRequest {
    crow_id: string;
    site_id: string;
    confirmation_text?: string;
  }
  
  // Device Operations
  
  export interface CheckInRequest {
    crow_id: string;
    timestamp: string;
    status: string;
  }
  
  export interface VersionRequest {
    crow_id: string;
    current_version: string;
  }
  
  export interface ConfigRequest {
    crow_id: string;
    config_id?: string;
  }
  
  // Form Operations
  
  export interface GetCrowsRequest {
    crow_id?: string;
    status: string;
  }
  
  export interface GetSitesRequest {
    site_id: string;
  }
  
  export interface GetWorkCellsRequest {
    site_id?: string;
    work_cell_id?: string;
  }
  
  export interface GetCrowModelsRequest {
    manufacturer?: string;
    model?: string;
  }
  
  export interface GetOsVersionsRequest {
    // No specific parameters needed
  }
  
  // Form Response Types
  
  export interface Site {
    site_id: string;
    site_name: string;
    location?: string;
  }
  
  export interface WorkCell {
    workcell_id: string;
    site_id: string;
    name: string;
    type?: string;
  }
  
  export interface CrowModel {
    manufacturer_id: string;
    manufacturer_name: string;
    model_id: string;
    model_name: string;
    cpu?: string;
    ram?: string;
    storage?: string;
  }
  
  export interface OsVersion {
    id: string;
    name: string;
    release_date?: string;
  }
  
  export interface Crow {
    crow_id: string;
    status: string;
    site_id?: string;
    work_cell_id?: string;
    model_id?: string;
    manufacturer_id?: string;
    created_at?: string;
    updated_at?: string;
  }