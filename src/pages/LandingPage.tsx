import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Crow from '../components/common/Logo';
import { getAllFeatures } from '../data/featuresData';
import type { FeatureData } from '../data/featuresData';

/**
 * Feature Card Component
 */
interface FeatureCardProps {
  feature: FeatureData;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <Link to={`/${feature.urlPath}`} className="block">  
      <div className="feature-card">
        <div className="flex justify-center mb-4">
          {feature.icon}
        </div>
        <h3 className="flex justify-center text-l md:text-2xl text-cyan-200 mb-2">
          {feature.title}
        </h3>
        <p className="flex justify-center to-light-blue-500">
          {feature.shortDescription}
        </p>
      </div>
    </Link> 
  ); 
};

/**
 * Landing Page Component
 */
const LandingPage: React.FC = () => {
  // State for style guide visibility
  const [showStyleGuide, setShowStyleGuide] = useState(false);

  // Get features data from our unified data structure
  const features = getAllFeatures();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100">
      {/* Hero Section */}
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

      {/* Main Features */}
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
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Start Your Watch */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-cyan-100">
          Take the Black
        </h2>
        <p className="text-xl text-cyan-200/70 mb-8">
          Join the ranks of those who protect their networks with unwavering dedication.
        </p>
        <button className="cta-button">
          Start Your Watch
        </button>
      </section> 

      {/* Call to Action - Summon the Maesters */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-cyan-100">
          Summon the Maesters
        </h2>
        <p className="text-xl text-cyan-200/70 mb-8">
          We are here to serve you and your network, summon us when you need us.
        </p>
        <button className="cta-button">
          Summon the Maesters
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-cyan-950/30 to-slate-900 py-8">
        <div className="container mx-auto px-4 text-center text-cyan-200/70">
          <p>"I am the shield that guards the realms of networks"</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;