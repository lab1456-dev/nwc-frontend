import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const AssetDiscovery: React.FC = () => {
  const featureData = getFeatureByKey('assetDiscovery');
  
  return <FeaturePageLayout {...featureData} />;
};
export default AssetDiscovery;