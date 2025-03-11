import React from 'react';
import Crow from '../components/common/Logo';
import FeatureSection from '../components/landingPage/FeatureSection';

/**
 * Landing Page Component
 */
const LandingPage: React.FC = () => {

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
      <FeatureSection />

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
    </div>
  );
};

export default LandingPage;