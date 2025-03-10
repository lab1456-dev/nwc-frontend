import React, { ReactNode } from 'react';

/**
 * Props for the FeatureContent component
 */
interface FeatureContentProps {
  description: string;
  bulletPoints?: string[];
  additionalContent?: string | ReactNode;
}

/**
 * FeatureContent component - Displays formatted content for a feature page
 */
export const FeatureContent: React.FC<FeatureContentProps> = ({
  description,
  bulletPoints = [],
  additionalContent
}) => {
  return (
    <div className="text-left">
      <p>{description}</p>
      
      {bulletPoints.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
          {bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}
      
      {additionalContent && (
        <div className="mt-4">
          {typeof additionalContent === 'string' ? (
            <p>{additionalContent}</p>
          ) : (
            additionalContent
          )}
        </div>
      )}
    </div>
  );
};
