import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const LatencyControl: React.FC = () => {
  const featureData = getFeatureByKey('latencyControl');
  
  return <FeaturePageLayout {...featureData} />;
};
export default LatencyControl;