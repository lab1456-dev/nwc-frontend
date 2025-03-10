import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const TrafficFlowMetrics: React.FC = () => {
  const featureData = getFeatureByKey('trafficFlowMetrics');
  
  return <FeaturePageLayout {...featureData} />;
};
export default TrafficFlowMetrics;