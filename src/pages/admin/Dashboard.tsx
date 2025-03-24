// src/pages/admin/Dashboard.tsx
import React from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Centralized management for the Night's Watch Crow system"
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-800/80 to-slate-950/80 p-8 rounded-lg border border-purple-900/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 p-6 rounded-lg border border-blue-900/30 shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Crows:</span>
                <span className="font-medium text-green-400">134</span>
              </div>
              <div className="flex justify-between">
                <span>Deployed Crows:</span>
                <span className="font-medium text-green-400">112</span>
              </div>
              <div className="flex justify-between">
                <span>Incidents:</span>
                <span className="font-medium text-yellow-400">3</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 p-6 rounded-lg border border-blue-900/30 shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-3">User Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span className="font-medium text-green-400">28</span>
              </div>
              <div className="flex justify-between">
                <span>New Deployments Today:</span>
                <span className="font-medium text-green-400">7</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="font-medium text-yellow-400">5</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-slate-800/60 p-6 rounded-lg border border-blue-900/30 shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-2 rounded hover:bg-slate-700/30 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-sm text-gray-300"><span className="text-blue-300">user.john</span> deployed Crow <span className="text-cyan-300">CR-8745</span> to work cell <span className="text-cyan-300">WC-NE-004</span></p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-2 rounded hover:bg-slate-700/30 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-yellow-400"></div>
              <div>
                <p className="text-sm text-gray-300"><span className="text-blue-300">admin.sarah</span> suspended monitoring for Crow <span className="text-cyan-300">CR-2231</span></p>
                <p className="text-xs text-gray-500">42 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-2 rounded hover:bg-slate-700/30 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-400"></div>
              <div>
                <p className="text-sm text-gray-300"><span className="text-blue-300">admin.mike</span> added new site <span className="text-cyan-300">Houston-B4</span> to the system</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;