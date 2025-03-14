/**
 * API Service
 * Export all API functionality from a single entry point
 */

// Re-export configuration
export * from './apiConfig';

// Re-export types
export * from './apiTypes';

// Re-export utility functions
export * from './apiUtils';

// Re-export API operations
export * from './userApi';
export * from './deviceApi';
export * from './formApi';

// Re-export page mappings
export * from './pageOperations';

// Export a default object with everything for backward compatibility
import * as apiConfig from './apiConfig';
import * as apiUtils from './apiUtils';
import * as userApi from './userApi';
import * as deviceApi from './deviceApi';
import * as formApi from './formApi';
import * as pageOperations from './pageOperations';

// This maintains backward compatibility with the original apiService.ts
const api = {
  config: apiConfig,
  utils: apiUtils,
  user: userApi,
  device: deviceApi,
  form: formApi,
  pages: pageOperations
};

export default api;