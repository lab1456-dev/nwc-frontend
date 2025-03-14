/**
 * API Configuration
 * Central location for API endpoints and operation names
 */

// Base API URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// API key for special operations like provisioning
export const API_PROVISION_KEY = import.meta.env.VITE_PROVISION_API_KEY;

// Main controller endpoints
export const ENDPOINTS = {
  USERS: '/manageCrowUsers',    // For user operations (receive, deploy, etc.)
  DEVICES: '/manageCrowDevices', // For device operations (check-in, version, etc.)
  FORMS: '/manageCrowForms',    // For form data operations
  USER_GROUPS: '/usergroups'    // For user group operations
};

// Operations by controller
export const OPERATIONS = {
  // User operations
  USER: {
    PROVISION: 'provision',
    RECEIVE: 'receive',
    DEPLOY: 'deploy',
    REPLACE: 'replace',
    TRANSFER: 'transfer',
    SUSPEND_REACTIVATE: 'suspendreactivate',
    RETIRE: 'retire'
  },
  
  // Device operations
  DEVICE: {
    CHECK_IN: 'checkin',
    VERSION: 'version',
    CONFIG: 'config'
  },
  
  // Form data operations
  FORM: {
    CROWS: 'crows',
    SITES: 'sites',
    WORKCELLS: 'workcells',
    CROW_MODELS: 'crowmodels',
    OS_VERSIONS: 'osversions'
  },
  
  // User group operations
  USER_GROUP: {
    GET_GROUPS: 'usergroups'
  }
};