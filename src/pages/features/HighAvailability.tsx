import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const HighAvailability: React.FC = () => {
  const featureData = getFeatureByKey('highAvailability');
  
  return <FeaturePageLayout {...featureData} />;
};
export default HighAvailability;