import React from 'react';

const TrafficFiltering: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Traffic Filtering
            </h1>
          <p className="text-xl md:text-2xl text-green-400">
          <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2>
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow Traffic Filtering, a Minimum Viable Product feature, provides stateful packet filtering through a flexible, dynamic ruleset framework. It offers comprehensive packet classification and filtering based on protocol fields across network layers 2-4, including:
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
                <li>Layer 2: MAC addresses, ethertype, bridge port</li>
                <li>Layer 3: IP addresses, IP protocol, IP options, fragmentation</li>
                <li>Layer 4: TCP/UDP ports, TCP flags and connection states, ICMP types/codes</li>
                <li>Prefix List like collections of similar addresses contained in a managable form</li>
            </ul>
              The filtering engine supports advanced matching criteria through stateful connection tracking, rate limiting, and set-based operations for efficient handling of large IP/port ranges. Rules can be organized into type-specific chains (filter, route, nat) and tables, with customizable priorities and hooks into the netfilter packet processing pipeline.
            <br />
            <br />
            Flow control actions include accept, drop, reject (with configurable ICMP responses), queue (to userspace), and jump/goto for rule organization. The framework supports atomic ruleset updates and uses a just-in-time (JIT) compiler to optimize packet processing performance.
          </p>
        </div>
      </div>
    </div>  
  );
};

export default TrafficFiltering;
