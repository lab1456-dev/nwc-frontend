import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const QOSPrioritization: React.FC = () => {
  const featureData = getFeatureByKey('qosPrioritization');
  
  return <FeaturePageLayout {...featureData} />;
};
export default QOSPrioritization;