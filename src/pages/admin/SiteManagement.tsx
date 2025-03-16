// src/pages/admin/SiteManagement.tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const SiteManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for demo
  const sites = [
    { id: 'SITE001', name: 'Seattle HQ', location: 'Seattle, WA', crowCount: 32, activeCount: 28 },
    { id: 'SITE002', name: 'Portland Hub', location: 'Portland, OR', crowCount: 18, activeCount: 16 },
    { id: 'SITE003', name: 'San Francisco Office', location: 'San Francisco, CA', crowCount: 24, activeCount: 22 },
    { id: 'SITE004', name: 'Austin Branch', location: 'Austin, TX', crowCount: 15, activeCount: 12 },
  ];
  
  // Filter sites based on search term
  const filteredSites = sites.filter(site => 
    site.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout
      title="Site Management"
      description="Manage facility locations and configuration"
    >
      <div className="max-w-5xl mx-auto bg-gradient-to-b from-slate-800/80 to-slate-950/80 p-8 rounded-lg border border-purple-900/30 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sites..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors">
            Add New Site
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSites.map((site) => (
            <div key={site.id} className="bg-slate-800/60 p-5 rounded-lg border border-blue-900/30 shadow-lg hover:border-purple-900/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-200">{site.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{site.location}</p>
                  <p className="text-sm text-purple-300 mt-1">ID: {site.id}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-xs text-gray-400">Total Crows</p>
                  <p className="text-xl font-semibold text-cyan-300">{site.crowCount}</p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-xs text-gray-400">Active Crows</p>
                  <p className="text-xl font-semibold text-green-400">{site.activeCount}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SiteManagement;