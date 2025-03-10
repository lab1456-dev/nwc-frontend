// src/components/landingPage/CallToActionSection.tsx
import React from 'react';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const CallToActionSection: React.FC<CallToActionProps> = ({
  title,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-8 text-cyan-100">
        {title}
      </h2>
      <p className="text-xl text-cyan-200/70 mb-8">
        {description}
      </p>
      <button 
        className="cta-button"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </section>
  );
};