import React, { useState } from 'react';
import WorkflowStepDescriptions from './WorkflowStepDescriptions';

const Replace = () => {
  const API_URL = `${import.meta.env.VITE_SOME_BASE_URL}`; // Base URL for all API endpoints
  const REPLACE_ENDPOINT = `${API_URL}/replace`;
  const CROW_ASSOCIATION_ENDPOINT = `${API_URL}/crow-association`;
  const NON_DEPLOYED_CROWS_ENDPOINT = `${API_URL}/non-deployed-crows-at-site`;

  const [existingDeviceId, setExistingDeviceId] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [workCellId, setWorkCellId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // State for dropdown options
  const [availableCrows, setAvailableCrows] = useState<string[]>([]);
  const [isLoadingCrows, setIsLoadingCrows] = useState(false);
  const [crowAssociationLoading, setCrowAssociationLoading] = useState(false);
  const [crowAssociationError, setCrowAssociationError] = useState('');

  // Function to fetch Crow association data on demand (not automatically on every change)
  const fetchCrowAssociation = async () => {
    if (!existingDeviceId.trim()) {
      setError('Existing Crow ID is required');
      return;
    }

    setCrowAssociationLoading(true);
    setCrowAssociationError('');
    setError('');
    
    try {
      const response = await fetch(`${CROW_ASSOCIATION_ENDPOINT}?crow_id=${existingDeviceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Device ${existingDeviceId}`
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setSiteId(data.site_id || '');
        setWorkCellId(data.work_cell_id || '');
        
        // After getting site info, fetch available Crows
        if (data.site_id) {
          fetchNonDeployedCrows(data.site_id);
        }
      } else {
        const errorData = await response.json();
        setCrowAssociationError(errorData.message || 'Failed to retrieve Crow association information');
        setSiteId('');
        setWorkCellId('');
        setAvailableCrows([]);
      }
    } catch (error) {
      console.error('Error fetching Crow association:', error);
      setCrowAssociationError('Network error while retrieving Crow information');
      setSiteId('');
      setWorkCellId('');
      setAvailableCrows([]);
    } finally {
      setCrowAssociationLoading(false);
    }
  };

  // Function to fetch non-deployed Crows by site
  const fetchNonDeployedCrows = async (site: string) => {
    if (!site.trim()) {
      setAvailableCrows([]);
      return;
    }

    setIsLoadingCrows(true);
    
    try {
      const response = await fetch(`${NON_DEPLOYED_CROWS_ENDPOINT}?site_id=${site}`, {
        method: 'GET',
        headers: {
          'Authorization': `Device ${existingDeviceId}`
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setAvailableCrows(data.crows || []);
        // If there's exactly one available Crow, select it automatically
        if (data.crows && data.crows.length === 1) {
          setNewDeviceId(data.crows[0]);
        } else {
          setNewDeviceId('');
        }
      } else {
        setAvailableCrows([]);
        setNewDeviceId('');
      }
    } catch (error) {
      console.error('Error fetching non-deployed Crows:', error);
      setAvailableCrows([]);
      setNewDeviceId('');
    } finally {
      setIsLoadingCrows(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    
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
      const response = await fetch(REPLACE_ENDPOINT, {
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
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      id="existingDeviceId"
                      value={existingDeviceId}
                      onChange={(e) => setExistingDeviceId(e.target.value)}
                      className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="Enter existing device ID"
                      disabled={isLoading || crowAssociationLoading}
                    />
                    {crowAssociationLoading && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="animate-spin h-5 w-5 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={fetchCrowAssociation}
                    disabled={!existingDeviceId.trim() || isLoading || crowAssociationLoading}
                    className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 
                      ${(!existingDeviceId.trim() || isLoading || crowAssociationLoading)
                        ? 'bg-slate-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-cyan-700 hover:bg-cyan-600 text-white'
                      }`}
                  >
                    Lookup
                  </button>
                </div>
                <p className="text-amber-200/80 text-sm mt-1">
                  This is the ID of the Crow currently protecting the work cell
                </p>
                {crowAssociationError && <p className="text-red-400 text-sm mt-1">{crowAssociationError}</p>}
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
                  disabled={true} // Read-only as it's populated from API
                  readOnly
                />
                <p className="text-cyan-200/70 text-sm mt-1">
                  Site ID is automatically retrieved from existing Crow association
                </p>
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
                  disabled={true} // Read-only as it's populated from API
                  readOnly
                />
                <p className="text-cyan-200/70 text-sm mt-1">
                  Work Cell ID is automatically retrieved from existing Crow association
                </p>
              </div>
              
              <div>
                <label htmlFor="newDeviceId" className="block text-cyan-200 mb-2 font-medium">
                  New Crow ID
                </label>
                <div className="relative">
                  {availableCrows.length > 0 ? (
                    <select
                      id="newDeviceId"
                      value={newDeviceId}
                      onChange={(e) => setNewDeviceId(e.target.value)}
                      className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      disabled={isLoading || isLoadingCrows}
                    >
                      <option value="">Select a Crow</option>
                      {availableCrows.map(crowId => (
                        <option key={crowId} value={crowId}>
                          {crowId}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="newDeviceId"
                      value={newDeviceId}
                      onChange={(e) => setNewDeviceId(e.target.value)}
                      className="w-full bg-slate-800/50 border border-cyan-900/50 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder={siteId ? "No available Crows at this site" : "Enter new device ID"}
                      disabled={isLoading || isLoadingCrows || (!!siteId && availableCrows.length === 0)}
                    />
                  )}
                  
                  {isLoadingCrows && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="animate-spin h-5 w-5 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                {availableCrows.length > 0 ? (
                  <p className="text-green-400/80 text-sm mt-1">
                    {availableCrows.length} received {availableCrows.length === 1 ? 'Crow is' : 'Crows are'} available at this site
                  </p>
                ) : siteId ? (
                  <p className="text-amber-200/80 text-sm mt-1">
                    No available Crows found at this site. Please ensure new Crows have been received.
                  </p>
                ) : (
                  <p className="text-amber-200/80 text-sm mt-1">
                    This is the ID of the replacement Crow that will take over protection
                  </p>
                )}
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