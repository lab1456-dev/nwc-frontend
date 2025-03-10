import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const IntrusionDetection: React.FC = () => {
  const featureData = getFeatureByKey('intrusionDetection');
  
  return <FeaturePageLayout {...featureData} />;
};
export default IntrusionDetection;