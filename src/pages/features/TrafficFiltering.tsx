  import React from 'react';
  import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
  import { getFeatureByKey } from '../../data/featuresData';

  const TrafficFiltering: React.FC = () => {
    const featureData = getFeatureByKey('trafficFiltering');
    
    return <FeaturePageLayout {...featureData} />;
  };
export default TrafficFiltering;
