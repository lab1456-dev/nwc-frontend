import React, { useState } from 'react';
import WorkflowStepDescriptions from '../components/tools/WorkflowStepDescriptions';

const Transfer = () => {
  const API_URL = `${import.meta.env.VITE_API_URL}/transfer`; // Update the .env file with the actual API endpoint

  const [deviceId, setDeviceId] = useState('');
  const [currentSiteId, setCurrentSiteId] = useState('');
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
    
    if (!currentSiteId.trim()) {
      setError('Current Site ID is required');
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
          'step': 'transfer'
        },
        body: JSON.stringify({ 
          device_id: deviceId,
          current_site_id: currentSiteId
        }),
      });
      
      if (response.status === 200) {
        setSuccess(true);
        setDeviceId(''); // Clear the form
        setCurrentSiteId(''); // Clear the form
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred during the transfer process');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Transfer error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Transfer your Crow
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200/80">
            Prepare a Crow to be moved to a new facility
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          {success ? (
            <div className="text-center">
              <div className="text-green-400 text-xl mb-4">
                Crow successfully prepared for transfer!
              </div>
              <div className="text-cyan-200 mb-6">
                The Crow has been disassociated from its current facility and returned to the "provisioned" state.
                It is now ready to be shipped to a new facility where it can be received through the standard process.
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                Transfer Another Crow
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
                <label htmlFor="currentSiteId" className="block text-cyan-200 mb-2 font-medium">
                  Current Site ID
                </label>
                <input
                  type="text"
                  id="currentSiteId"
                  value={currentSiteId}
                  onChange={(e) => setCurrentSiteId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter current site ID"
                  disabled={isLoading}
                />
              </div>
              
              {error && <p className="text-red-400 mt-2">{error}</p>}
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
                    ${isLoading 
                      ? 'bg-cyan-900 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
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
                    'Prepare for Transfer'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Use the reusable WorkflowStepDescriptions component */}
        <WorkflowStepDescriptions step="transfer" />
      </div>
    </div>
  );
};

export default Transfer;