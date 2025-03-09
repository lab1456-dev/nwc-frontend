import React, { useState } from 'react';
import WorkflowStepDescriptions from './WorkflowStepDescriptions';

const Replace = () => {
  const API_URL = `${import.meta.env.VITE_SOME_BASE_URL}/replace`; // Update the .env file with the actual API endpoint

  const [existingDeviceId, setExistingDeviceId] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [workCellId, setWorkCellId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    
    // Validate input
    if (!existingDeviceId.trim()) {
      setError('Existing Crow ID is required');
      return;
    }
    
    if (!newDeviceId.trim()) {
      setError('New Crow ID is required');
      return;
    }
    
    if (!siteId.trim()) {
      setError('Site ID is required');
      return;
    }
    
    if (!workCellId.trim()) {
      setError('Work Cell ID is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Using existing device_id for authorization in the headers
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Device ${existingDeviceId}`,
          'step': 'replaced'
        },
        body: JSON.stringify({ 
          existing_device_id: existingDeviceId,
          new_device_id: newDeviceId,
          site_id: siteId,
          work_cell_id: workCellId
        }),
      });
      
      if (response.status === 200) {
        setSuccess(true);
        setExistingDeviceId(''); // Clear the form
        setNewDeviceId(''); // Clear the form
        setSiteId(''); // Clear the form
        setWorkCellId(''); // Clear the form
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred during the replacement process');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Replace error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Replace your Crow
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200/80">
            Assign a new Crow to an existing Work Cell
          </p>
          <div className="mt-4 bg-amber-900/20 border border-amber-700/30 rounded-md p-4 max-w-2xl mx-auto">
            <p className="text-amber-200 font-medium">
              Warning: This action will transfer protection to a new device
            </p>
            <p className="text-amber-200/80 text-sm mt-1">
              Ensure the new Crow is on-site and ready to be connected before proceeding
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          {success ? (
            <div className="text-center">
              <div className="text-green-400 text-xl mb-4">
                Crow successfully replaced!
              </div>
              <div className="text-cyan-200 mb-6">
                Please carefully disconnect the existing Crow's network cables one at a time and connect them to the new Crow. 
                Once connected to power, the new Crow will be ready within 15 minutes.
              </div>
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-md p-4 mb-6">
                <p className="text-amber-200 font-medium">
                  Important Next Steps
                </p>
                <ol className="list-decimal ml-5 mt-2 text-amber-200/80 space-y-1">
                  <li>Disconnect the public network cable from the existing Crow</li>
                  <li>Connect it to the same port on the new Crow</li>
                  <li>Disconnect the private network cable from the existing Crow</li>
                  <li>Connect it to the same port on the new Crow</li>
                  <li>Power on the new Crow</li>
                </ol>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                Replace Another Crow
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="existingDeviceId" className="block text-cyan-200 mb-2 font-medium">
                  Existing Crow ID
                </label>
                <input
                  type="text"
                  id="existingDeviceId"
                  value={existingDeviceId}
                  onChange={(e) => setExistingDeviceId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter existing device ID"
                  disabled={isLoading}
                />
                <p className="text-amber-200/80 text-sm mt-1">
                  This is the ID of the Crow currently protecting the work cell
                </p>
              </div>
              
              <div>
                <label htmlFor="newDeviceId" className="block text-cyan-200 mb-2 font-medium">
                  New Crow ID
                </label>
                <input
                  type="text"
                  id="newDeviceId"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter new device ID"
                  disabled={isLoading}
                />
                <p className="text-amber-200/80 text-sm mt-1">
                  This is the ID of the replacement Crow that will take over protection
                </p>
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
              
              <div>
                <label htmlFor="workCellId" className="block text-cyan-200 mb-2 font-medium">
                  Work Cell ID
                </label>
                <input
                  type="text"
                  id="workCellId"
                  value={workCellId}
                  onChange={(e) => setWorkCellId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter work cell ID"
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
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600'
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
                    'Replace Crow!'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Use the reusable WorkflowStepDescriptions component */}
        <WorkflowStepDescriptions step="Replace" />
      </div>
    </div>
  );
};

export default Replace;