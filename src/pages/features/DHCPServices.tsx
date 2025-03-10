import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const DHCPServices: React.FC = () => {
  const featureData = getFeatureByKey('dhcpServices');
  
  return <FeaturePageLayout {...featureData} />;
};
export default DHCPServices;
