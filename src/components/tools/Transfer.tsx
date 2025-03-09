import React from 'react';

const Transfer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Transfer Crow
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200/80">
            Transfer a Crow to another castle
          </p>
        </div>

        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-cyan-200/70 text-center">
            Transfer form coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transfer;