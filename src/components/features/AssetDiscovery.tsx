import React from 'react';

const AssetDiscovery: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Asset Discovery 
            </h1>
          <p className="text-xl md:text-2xl text-orange-400">
            Roadmap: 2026/2027
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            On Night's Watch Crow's Asset Discovery, a Roadmap 2026/2027 feature, provides active and/or passive asset discovery techniques to maintain real-time awareness of devices connecting to and departing from the protected network. The system can be configured to operate in active-only, passive-only, or combined modes.
            <br />
            <br />
            Active Discovery (Roadmap 2026):
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Low-impact NMAP scanning configured for minimal network interference</li>
              <li>Scheduled host enumeration with customizable scan intervals</li>
              <li>OS fingerprinting and service identification</li>
              <li>Port state monitoring for common services</li>
            </ul>
              Passive Discovery (Roadmap 2027):
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Real-time network traffic analysis</li>
              <li>Protocol-aware device fingerprinting</li>
              <li>Connection pattern analysis</li>
              <li>Service usage detection</li>
              <li>MAC address tracking</li>
              <li>May require enhanced hardware due to continuous monitoring overhead</li>
            </ul>
            The configurable nature of these approaches enables tailored asset tracking with either systematic scanning, real-time detection, or both. While no single discovery method provides perfect coverage, the available monitoring options deliver high-confidence device detection and departure notification. The system maintains a dynamic inventory of network assets that can be leveraged for security policy enforcement and network management decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetDiscovery;