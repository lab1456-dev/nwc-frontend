  import React from 'react';
  import { FeaturePageLayout } from '../../components/featurePages/FeaturePageLayout';
  import { getFeatureByKey } from '../../data/featuresData';
  
  const AddressTranslation: React.FC = () => {
    const featureData = getFeatureByKey('addressTranslation');
    
    return <FeaturePageLayout {...featureData} />;
  };
export default AddressTranslation;