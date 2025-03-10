import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const ProtocolEnforcement: React.FC = () => {
  const featureData = getFeatureByKey('protocolEnforcement');
  
  return <FeaturePageLayout {...featureData} />;
};
export default ProtocolEnforcement;