// src/components/admin/AdminLayout.tsx
import React from 'react';
import { RequireGroup } from '../../components/authRoleComponents';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, description }) => {
  return (
    <RequireGroup groups={['Administrators']} redirectTo="/unauthorized">
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-blue-200 text-transparent bg-clip-text">
              {title}
            </h1>
            {description && (
              <p className="text-xl md:text-2xl text-cyan-200/80">
                {description}
              </p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </RequireGroup>
  );
};

export default AdminLayout;