// src/pages/admin/UserManagement.tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for demo
  const users = [
    { id: 1, username: 'john.smith', name: 'John Smith', email: 'john.smith@example.com', groups: ['Operators'] },
    { id: 2, username: 'sarah.jones', name: 'Sarah Jones', email: 'sarah.jones@example.com', groups: ['Operators', 'Administrators'] },
    { id: 3, username: 'mike.wilson', name: 'Mike Wilson', email: 'mike.wilson@example.com', groups: ['Administrators'] },
    { id: 4, username: 'lisa.brown', name: 'Lisa Brown', email: 'lisa.brown@example.com', groups: ['Operators'] },
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.includes(searchTerm) || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.includes(searchTerm)
  );
  
  return (
    <AdminLayout
      title="User Management"
      description="Manage user accounts and permissions"
    >
      <div className="max-w-5xl mx-auto bg-gradient-to-b from-slate-800/80 to-slate-950/80 p-8 rounded-lg border border-purple-900/30 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors">
            Add New User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Groups
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {user.groups.map((group) => (
                        <span key={group} className={`px-2 py-1 text-xs rounded ${
                          group === 'Administrators' 
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
                            : 'bg-cyan-900/50 text-cyan-300 border border-cyan-700/50'
                        }`}>
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
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

export default UserManagement;