import React from 'react';
import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
import { getFeatureByKey } from '../../data/featuresData';

const ServiceManagement: React.FC = () => {
  const featureData = getFeatureByKey('serviceManagement');
  
  return <FeaturePageLayout {...featureData} />;
};
export default ServiceManagement;