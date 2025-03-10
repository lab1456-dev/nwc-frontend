// src/components/landingPage/FeaturesSection.tsx
import React from 'react';
import { FeatureCard } from './FeatureCard';
import { featuresData } from '../../data/featuresData';

export const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-cyan-950/50 to-slate-900/50 backdrop-blur-sm py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl text-center mb-6 text-cyan-100">
          Our Oath to Your Security
        </h2>
        
        {/* Roadmap section */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl text-cyan-200 mb-2">Roadmap:</h2>
          <div className="flex justify-center space-x-4">
            <h2 className="text-xl md:text-2xl text-emerald-400">MVP</h2>
            <h2 className="text-xl md:text-2xl text-yellow-400">2026</h2>
            <h2 className="text-xl md:text-2xl text-red-400">2027</h2>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};