import React from 'react';

const QOSPrioritization: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Quality of Service Prioritization
            </h1>
          <p className="text-xl md:text-2xl text-red-400">
            Roadmap: 2027
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow Quality of Service (QoS), a Roadmap 2027 feature, provides traffic flow control functionality through its packet classification and queueing disciplines. The QoS implementation enables:
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Traffic classification based on multiple criteria (ports, protocols, addresses)</li>
              <li>Bandwidth allocation and rate limiting</li>
              <li>Priority-based packet scheduling</li>
              <li>Hierarchical traffic class management</li>
              <li>Queue discipline configuration</li>
              <li>Packet marking for downstream handling</li>
              <li>Burst allowance configuration</li>
              <li>Traffic policing and shaping</li>
              <li>Configurable drop policies</li>
              <li>Per-flow rate control</li>
              <li>DSCP/TOS field manipulation</li>
              <li>Integration with connection tracking</li>
              <li>Real-time queue statistics</li>
              <li>Atomic rule updates for configuration changes</li>
            </ul>
            The framework leverages nftables' packet classification capabilities to provide granular traffic control while maintaining the benefits of atomic ruleset updates. QoS policies can be dynamically adjusted without disrupting existing traffic flows, enabling flexible bandwidth management and traffic prioritization based on network requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QOSPrioritization;
