import React from 'react';
import { Link } from 'react-router-dom';
import type { FeatureData } from '../../data/featuresData';

/**
 * Feature Card Component
 */
interface FeatureCardProps {
  feature: FeatureData;
}

/**
 * Feature Card component that displays a feature with its icon, title, and description
 * Links to the feature's dedicated page
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <Link to={`/${feature.urlPath}`} className="block">  
      <div className="feature-card">
        <div className="flex justify-center mb-4">
          {feature.icon}
        </div>
        <h3 className="flex justify-center text-l md:text-2xl text-cyan-200 mb-2">
          {feature.title}
        </h3>
        <p className="flex justify-center to-light-blue-500">
          {feature.shortDescription}
        </p>
      </div>
    </Link> 
  ); 
};

export default FeatureCard;