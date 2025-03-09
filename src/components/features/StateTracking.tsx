import React from 'react';

const StateTracking: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            State Tracking
            </h1>
          <p className="text-xl md:text-2xl text-green-400">
          <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2>
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
          Night's Watch Crow State Tracking, a Minimum Viable Product feature, manages a connection tracking subsystem to provide comprehensive stateful packet inspection and connection management. The state tracking system:
          <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
            <li>Maintains detailed connection state information across all supported protocols</li>
            <li>Tracks standard connection states: new, established, related, invalid, untracked</li>
            <li>Supports complex protocols with multiple related connections (e.g., FTP, SIP)</li>
            <li>Provides timeout configuration for different connection states</li>
            <li>Enables state-based filtering decisions for enhanced security</li>
            <li>Maintains connection status across NAT operations</li>
            <li>Tracks connection metrics including bytes, packets, and duration</li>
            <li>Supports helper modules for protocol-specific tracking requirements</li>
            <li>Allows manual state table management for administrative control</li>
            <li>Provides tunable memory limits and garbage collection parameters</li>
          </ul>
            Connection state information is preserved during ruleset updates through Crow's atomic replacement mechanism, ensuring uninterrupted tracking of existing connections when firewall rules are modified. The connection tracking system automatically times out inactive connections and supports administrative clearing of connection states.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StateTracking;
