// src/components/landingPage/HeroSection.tsx
import React from 'react';
import Crow from '../common/Logo';

export const HeroSection: React.FC = () => {
  return (
    <header className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <p className="text-3xl font-bold text-center mb-6 text-cyan-100">
          The Shield that Guards the Realms of Your Network
        </p>
      </div>
      
      <div className="flex justify-center">
        <Crow          
          width="w-36" 
          height="h-36" 
          className="mx-auto"
          shadow={true}
          hover={true}
        />
      </div>
    </header>
  );
};
export default HeroSection;