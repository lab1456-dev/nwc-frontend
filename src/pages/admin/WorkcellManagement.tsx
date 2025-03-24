// src/pages/admin/WorkcellManagement.tsx
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const WorkcellManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSite, setFilterSite] = useState('all');
  
  // Mock data for demo
  const sites = [
    { id: 'SITE001', name: 'Seattle HQ' },
    { id: 'SITE002', name: 'Portland Hub' },
    { id: 'SITE003', name: 'San Francisco Office' },
    { id: 'SITE004', name: 'Austin Branch' },
  ];
  
  // Mock data for workcells
  const workcells = [
    { id: 'WC001', name: 'Assembly Line A', site: 'SITE001', status: 'Protected', crow: 'CR-5432' },
    { id: 'WC002', name: 'Packaging Station', site: 'SITE001', status: 'Protected', crow: 'CR-6723' },
    { id: 'WC003', name: 'Testing Lab', site: 'SITE002', status: 'Protected', crow: 'CR-1245' },
    { id: 'WC004', name: 'Quality Control', site: 'SITE003', status: 'Unprotected', crow: null },
    { id: 'WC005', name: 'Shipping Dock', site: 'SITE003', status: 'Protected', crow: 'CR-9821' },
    { id: 'WC006', name: 'Research Lab', site: 'SITE004', status: 'Protected', crow: 'CR-3310' },
  ];
  
  // Filter workcells based on search term and selected site
  const filteredWorkcells = workcells.filter(workcell => {
    const matchesSearch = 
      workcell.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      workcell.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSite = filterSite === 'all' || workcell.site === filterSite;
    
    return matchesSearch && matchesSite;
  });
  
  return (
    <AdminLayout
      title="Workcell Management"
      description="Manage and monitor production workcells"
    >
      <div className="max-w-5xl mx-auto bg-gradient-to-b from-slate-800/80 to-slate-950/80 p-8 rounded-lg border border-purple-900/30 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search workcells..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            
            <select
              value={filterSite}
              onChange={(e) => setFilterSite(e.target.value)}
              className="w-full md:w-auto bg-slate-800/50 border border-slate-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="all">All Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
          
          <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors">
            Add New Workcell
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Site
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Crow
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50 divide-y divide-gray-700">
              {filteredWorkcells.map((workcell) => (
                <tr key={workcell.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">
                    {workcell.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {workcell.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                    {sites.find(s => s.id === workcell.site)?.name || workcell.site}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      workcell.status === 'Protected' 
                        ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                        : 'bg-red-900/50 text-red-300 border border-red-700/50'
                    }`}>
                      {workcell.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                    {workcell.crow || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                    {workcell.status === 'Unprotected' ? (
                      <button className="text-green-400 hover:text-green-300 mr-3">Assign Crow</button>
                    ) : (
                      <button className="text-yellow-400 hover:text-yellow-300 mr-3">Replace Crow</button>
                    )}
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WorkcellManagement;