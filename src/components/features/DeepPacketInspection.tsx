import React from 'react';

const DeepPacketInspection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Deep Packet Inspection
            </h1>
          <p className="text-xl md:text-2xl text-yellow-400">
            Roadmap: 2026
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow Deep Packet Inspection (DPI), a Roadmap 2026 feature, provides granular network traffic analysis and application-layer visibility. This resource-intensive service requires substantial hardware capacity that scales with traffic volume and analysis depth. The system delivers detailed traffic insights through:
          <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Application protocol identification and classification</li>
              <li>Content-based traffic categorization</li>
              <li>User behavior and application usage patterns</li>
              <li>File type identification in network streams</li>
              <li>Protocol compliance monitoring</li>
              <li>Traffic metadata extraction and analysis</li>
              <li>Application-specific security policy enforcement</li>
              <li>Bandwidth usage analysis per application</li>
              <li>Data exfiltration detection capabilities</li>
              <li>SSL/TLS certificate and cipher analysis</li>
              <li>Application command monitoring</li>
              <li>Resource access pattern analysis</li>
              <li>Session reconstruction capabilities</li>
              <li>Performance profiling of application protocols</li>
              <li>Hardware requirements scale with inspection depth and traffic volume</li>
            </ul>
          DPI analysis provides essential visibility into network applications and user behaviors, complementing IDS capabilities with detailed protocol and application-layer insights. The service can be tuned to balance inspection depth with performance requirements, allowing focused analysis of critical traffic patterns while managing hardware resource utilization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeepPacketInspection;