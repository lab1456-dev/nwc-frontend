import React, { ReactNode } from 'react';

/**
 * PageContainer - Base layout container for all pages
 */
interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        {children}
      </div>
    </div>
  );
};

/**
 * PageHeader - Header component with title and subtitle
 */
interface PageHeaderProps {
  title: string;
  subtitle: string;
  warningMessage?: string;
  warningDetails?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  warningMessage,
  warningDetails
}) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-cyan-200/80">
        {subtitle}
      </p>
      
      {warningMessage && (
        <div className="mt-4 bg-amber-900/20 border border-amber-700/30 rounded-md p-4 max-w-2xl mx-auto">
          <p className="text-amber-200 font-medium">
            {warningMessage}
          </p>
          {warningDetails && (
            <p className="text-amber-200/80 text-sm mt-1">
              {warningDetails}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * ContentCard - Card container for page content
 */
interface ContentCardProps {
  children: ReactNode;
}

export const ContentCard: React.FC<ContentCardProps> = ({ children }) => {
  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
      {children}
    </div>
  );
};

/**
 * FormContainer - Container specifically for forms
 */
interface FormContainerProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  onSubmit,
  children
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
    </form>
  );
};

/**
 * ButtonContainer - Centered container for buttons
 */
interface ButtonContainerProps {
  children: ReactNode;
}

export const ButtonContainer: React.FC<ButtonContainerProps> = ({ children }) => {
  return (
    <div className="flex justify-center">
      {children}
    </div>
  );
};
