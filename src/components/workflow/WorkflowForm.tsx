import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PageContainer, 
  PageHeader, 
  ContentCard 
} from '../layoutComponents';
import { 
  ErrorMessage,
  SubmitButton
} from '../formComponents';
import WorkflowStepDescriptions from '../../data/WorkflowStepDescriptions';

// Common types for all workflow forms
export type WorkflowStep = 
  | 'Provision' 
  | 'Receive' 
  | 'Deploy' 
  | 'CheckStatus' 
  | 'SuspendReactivate' 
  | 'Replace' 
  | 'Transfer' 
  | 'Retire';

// Props for the workflow form wrapper
interface WorkflowFormProps {
  step: WorkflowStep;
  title: string;
  subtitle: string;
  warningMessage?: string;
  warningDetails?: string;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  formContent: ReactNode;
  successContent: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset?: () => void;
}

/**
 * Shared workflow form wrapper component
 * Provides consistent layout and behavior for all workflow forms
 */
export const WorkflowForm: React.FC<WorkflowFormProps> = ({
  step,
  title,
  subtitle,
  warningMessage,
  warningDetails,
  isLoading,
  isSuccess,
  error,
  formContent,
  successContent,
  onSubmit,
  onReset
}) => {
  const navigate = useNavigate();

  // Handle authentication redirect (could be moved to a hook or context)
  const checkAuthentication = () => {
    // Authentication checks would go here
    // This is a placeholder for real authentication logic
    return true;
  };
  
  // Check authentication on component mount
  React.useEffect(() => {
    if (!checkAuthentication()) {
      navigate('/signin', { state: { returnUrl: window.location.pathname } });
    }
  }, [navigate]);

  return (
    <PageContainer>
      <PageHeader
        title={title}
        subtitle={subtitle}
        warningMessage={warningMessage}
        warningDetails={warningDetails}
      />

      <ContentCard>
        {isSuccess ? (
          // Success state content
          <div className="text-center">
            {successContent}
            {onReset && (
              <button
                onClick={onReset}
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                {`Handle Another ${step}`}
              </button>
            )}
          </div>
        ) : (
          // Form state content
          <form onSubmit={onSubmit} className="space-y-6">
            {formContent}
            
            <ErrorMessage message={error || ''} />
            
            <div className="flex justify-center">
              <SubmitButton
                isLoading={isLoading}
                text={`${step} Crow!`}
                loadingText="Processing..."
              />
            </div>
          </form>
        )}
      </ContentCard>
      
      {/* Workflow step descriptions */}
      <WorkflowStepDescriptions step={step} />
    </PageContainer>
  );
};

export default WorkflowForm;