import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const FQDNFiltering: React.FC = () => {
  const featureData = getFeatureByKey('fqdnFiltering');
  
  return <FeaturePageLayout {...featureData} />;
};
export default FQDNFiltering;