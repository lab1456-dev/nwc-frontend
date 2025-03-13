import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  PageContainer, 
  PageHeader, 
  ContentCard 
} from '../layoutComponents';

/**
 * Unauthorized page component
 * Displays when a user attempts to access a page without required permissions
 */
const Unauthorized: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get information about the required permissions from location state
  const state = location.state as { 
    requiredGroups?: string[], 
    currentGroups?: string[] 
  } | undefined;
  
  const requiredGroups = state?.requiredGroups || [];
  const currentGroups = state?.currentGroups || [];
  
  return (
    <PageContainer>
      <PageHeader
        title="Access Denied"
        subtitle="You don't have permission to access this page"
      />
      
      <ContentCard>
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="text-red-500 w-16 h-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-cyan-200">Permission Required</h2>
          
          <p className="text-gray-300">
            This page requires additional permissions that you don't currently have.
          </p>
          
          {requiredGroups.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-300">Required permissions:</p>
              <ul className="list-disc list-inside text-cyan-200 mt-2">
                {requiredGroups.map((group) => (
                  <li key={group}>{group}</li>
                ))}
              </ul>
            </div>
          )}
          
          {currentGroups.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-300">Your current permissions:</p>
              <ul className="list-disc list-inside text-gray-400 mt-2">
                {currentGroups.map((group) => (
                  <li key={group}>{group}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
            >
              Go to Home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default Unauthorized;