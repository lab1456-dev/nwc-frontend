console.log('AWS Config:', {
  userPoolId: import.meta.env.VITE_USER_POOL_ID,
  region: import.meta.env.VITE_REGION
});

// This file provides polyfills for Node.js globals needed by the amazon-cognito-identity-js library

// Add global to window for amazon-cognito-identity-js
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Other polyfills that might be needed
if (typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {},
    nextTick: (callback: Function) => setTimeout(callback, 0)
  };
}

// Make sure Buffer is available
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = {
    isBuffer: () => false
  };
}

export {};
