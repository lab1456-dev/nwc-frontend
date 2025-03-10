import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const DeepPacketInspection: React.FC = () => {
  const featureData = getFeatureByKey('deepPacketInspection');
  
  return <FeaturePageLayout {...featureData} />;
};
export default DeepPacketInspection;