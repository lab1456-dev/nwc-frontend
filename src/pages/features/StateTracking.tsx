import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const StateTracking: React.FC = () => {
  const featureData = getFeatureByKey('stateTracking');
  
  return <FeaturePageLayout {...featureData} />;
};
export default StateTracking;