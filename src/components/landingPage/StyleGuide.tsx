// src/components/landingPage/StyleGuide.tsx
import React from 'react';

interface StyleGuideProps {
  onClose: () => void;
}

export const StyleGuide: React.FC<StyleGuideProps> = ({ onClose }) => {
  // Style guide content
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-cyan-100">Windi CSS Reference Guide</h2>
        {/* ... all style guide content ... */}
        <div className="text-center">
          <button 
            onClick={onClose} 
            className="cta-button"
          >
            Close Style Guide
          </button>
        </div>
      </div>
    </div>
  );
};