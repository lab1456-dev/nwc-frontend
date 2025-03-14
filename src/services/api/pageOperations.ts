/**
 * Page Operations Mapping
 * Maps UI pages to their required API operations
 */

import { ENDPOINTS, OPERATIONS } from './apiConfig';

/**
 * Interface defining the API operations required by a page
 */
interface PageOperations {
  // Primary endpoint and operation for form submission
  submitEndpoint: string;
  submitOperation: string;
  
  // Form data endpoints and operations (if applicable)
  formDataOperations?: Array<{
    endpoint: string;
    operation: string;
    description: string;
  }>;
}

/**
 * Mapping of page routes to their required API operations
 */
export const PAGE_OPERATIONS: Record<string, PageOperations> = {
  // User Operations Pages
  '/provision': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.PROVISION,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.CROW_MODELS,
        description: 'Retrieves manufacturer and model data for selection'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.OS_VERSIONS,
        description: 'Retrieves available OS versions for selection'
      }
    ]
  },
  
  '/receive': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.RECEIVE,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.SITES,
        description: 'Retrieves site data for dropdown selection'
      }
    ]
  },
  
  '/deploy': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.DEPLOY,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.SITES,
        description: 'Retrieves site data for dropdown selection'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.WORKCELLS,
        description: 'Retrieves work cell data for dropdown selection'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.CROWS,
        description: 'Retrieves received crows for validation'
      }
    ]
  },
  
  '/replace': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.REPLACE,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.CROWS,
        description: 'Retrieves crow data for validation and replacement'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.SITES,
        description: 'Retrieves site data for validation'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.WORKCELLS,
        description: 'Retrieves work cell data for validation'
      }
    ]
  },
  
  '/transfer': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.TRANSFER,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.SITES,
        description: 'Retrieves site data for validation and selection'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.CROWS,
        description: 'Retrieves crow data for validation'
      }
    ]
  },
  
  '/suspendreactivate': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.SUSPEND_REACTIVATE,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.CROWS,
        description: 'Retrieves crow data for validation'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.SITES,
        description: 'Retrieves site data for validation'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.WORKCELLS,
        description: 'Retrieves work cell data for validation'
      }
    ]
  },
  
  '/retire': {
    submitEndpoint: ENDPOINTS.USERS,
    submitOperation: OPERATIONS.USER.RETIRE,
    formDataOperations: [
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.CROWS,
        description: 'Retrieves crow data for validation'
      },
      {
        endpoint: ENDPOINTS.FORMS,
        operation: OPERATIONS.FORM.SITES,
        description: 'Retrieves site data for validation'
      }
    ]
  }
};

/**
 * Helper function to get operations for a specific page
 * @param pagePath The page route path
 * @returns The operations for that page or undefined if not found
 */
export const getPageOperations = (pagePath: string): PageOperations | undefined => {
  return PAGE_OPERATIONS[pagePath];
};

/**
 * Helper function to check if a page needs specific form data
 * @param pagePath The page route path
 * @param endpoint The endpoint to check
 * @param operation The operation to check
 * @returns True if the page needs the specified operation
 */
export const pageNeedsOperation = (
  pagePath: string, 
  endpoint: string, 
  operation: string
): boolean => {
  const pageOps = PAGE_OPERATIONS[pagePath];
  if (!pageOps) return false;
  
  // Check submit operation
  if (pageOps.submitEndpoint === endpoint && pageOps.submitOperation === operation) {
    return true;
  }
  
  // Check form data operations
  return !!pageOps.formDataOperations?.some(
    op => op.endpoint === endpoint && op.operation === operation
  );
};