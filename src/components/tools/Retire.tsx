import React, { useState } from 'react';
import WorkflowStepDescriptions from './WorkflowStepDescriptions';

const Retire = () => {
  const API_URL = `${import.meta.env.VITE_API_URL}/retire`; // Update the .env file with the actual API endpoint

  const [deviceId, setDeviceId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    
    // Validate input
    if (!deviceId.trim()) {
      setError('Crow ID is required');
      return;
    }
    
    if (!siteId.trim()) {
      setError('Site ID is required');
      return;
    }
    
    if (confirmationText !== `RETIRE-${deviceId}`) {
      setError('Please enter the correct confirmation text');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Using device_id for authorization in the headers
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Device ${deviceId}`,
          'step': 'retire'
        },
        body: JSON.stringify({ 
          device_id: deviceId,
          site_id: siteId
        }),
      });
      
      if (response.status === 200) {
        setSuccess(true);
        setDeviceId(''); // Clear the form
        setSiteId(''); // Clear the form
        setConfirmationText(''); // Clear the form
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred during the retirement process');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Retire error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Retire a Crow
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200/80">
            Permanently remove a Crow from service
          </p>
          <div className="mt-4 bg-amber-900/20 border border-amber-700/30 rounded-md p-4 max-w-2xl mx-auto">
            <p className="text-amber-200 font-medium">
              Warning: This action is irreversible without CLS assistance
            </p>
            <p className="text-amber-200/80 text-sm mt-1">
              Only personnel with elevated privileges should perform this action
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          {success ? (
            <div className="text-center">
              <div className="text-green-400 text-xl mb-4">
                Crow successfully retired
              </div>
              <div className="text-cyan-200 mb-6">
                The Crow ID has been permanently removed from active service in the Crow Management System.
                If the physical device is recoverable, it would need to go through the provisioning process 
                again with a new Crow ID.
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                Retire Another Crow
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="deviceId" className="block text-cyan-200 mb-2 font-medium">
                  Crow ID
                </label>
                <input
                  type="text"
                  id="deviceId"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter device ID"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="siteId" className="block text-cyan-200 mb-2 font-medium">
                  Site ID
                </label>
                <input
                  type="text"
                  id="siteId"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter site ID"
                  disabled={isLoading}
                />
              </div>
              
              <div className="border-t border-cyan-900/30 pt-4 mt-4">
                <div className="bg-red-900/20 border border-red-700/30 rounded-md p-4 mb-4">
                  <p className="text-red-200 font-medium">
                    Retirement Confirmation
                  </p>
                  <p className="text-red-200/80 text-sm mt-1">
                    To confirm retirement, please type "RETIRE-" followed by the Crow ID
                    (Example: RETIRE-ABC123)
                  </p>
                </div>
                
                <label htmlFor="confirmationText" className="block text-cyan-200 mb-2 font-medium">
                  Confirmation Text
                </label>
                <input
                  type="text"
                  id="confirmationText"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full bg-slate-800/50 border border-red-700/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder={deviceId ? `RETIRE-${deviceId}` : "Enter confirmation text"}
                  disabled={isLoading}
                />
              </div>
              
              {error && <p className="text-red-400 mt-2">{error}</p>}
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !deviceId || !siteId || confirmationText !== `RETIRE-${deviceId}`}
                  className={`px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
                    ${(isLoading || !deviceId || !siteId || confirmationText !== `RETIRE-${deviceId}`)
                      ? 'bg-red-900/50 cursor-not-allowed text-gray-300' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Permanently Retire Crow'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Use the reusable WorkflowStepDescriptions component */}
        <WorkflowStepDescriptions step="Retire" />
      </div>
    </div>
  );
};

export default Retire;