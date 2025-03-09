import React from 'react';

const AddressTranslation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Address Translation 
          </h1>
          <p className="text-xl md:text-2xl text-green-400">
          <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2>
          </p>
        </div>

        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow Address Translation, a Minimum Viable Product feature, implements flexible network address translation (NAT) through its NAT table type, supporting all standard NAT operations including source NAT (SNAT), destination NAT (DNAT), masquerading, and bidirectional NAT (port forwarding). 
            <br />
            <br />
            The service provides:
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Full tuple matching (source/destination address, port, protocol) for translation</li>
              <li>Dynamic address translation masquerading for varying WAN IP scenarios</li>
              <li>Static NAT mappings with optional port translation (1:1 NAT)</li>
              <li>Port forwarding with support for port ranges and multiple protocols</li>
              <li>Address and port randomization for enhanced security</li>
              <li>Fully stateful NAT tracking integrated with the connection tracking system</li>
            </ul>
            NAT rules can be configured with fine-grained control over address/port selection and can be combined with filtering rules for comprehensive network policy enforcement. The implementation maintains translation state tables for connection tracking and supports atomic ruleset updates for seamless configuration changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressTranslation;