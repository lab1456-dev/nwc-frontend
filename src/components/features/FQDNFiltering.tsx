import React from 'react';

const FQDNHostResolution: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
          FQDN Filtering
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400">
          <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2>
          </p>
        </div>

        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow's FQDN Based Filtering, a Minimum Viable Product feature, provides dynamic IP address management for Crow's filtering rules by actively monitoring and resolving domain names to their corresponding IP addresses. This service enhances Crow's' filtering capabilities by:
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Automatic resolution and tracking of fully qualified domain names (FQDNs)</li>
              <li>Pre-emptive updates of Crow's filtering rules based on DNS Time to Live (TTL) values</li>
              <li>Atomic set updates to maintain connection state consistency</li>
              <li>Multi-threaded resolution for high-performance environments</li>
              <li>Caching of DNS responses with TTL-aware expiration</li>
            </ul>
            The service maintains synchronized IP address sets, ensuring that domain-based filtering rules remain current without manual intervention. By leveraging Crow's atomic update capabilities, the service updates IP address sets without disrupting existing connections or creating temporary security gaps during updates. This provides a robust solution for maintaining current domain-based filtering in dynamic environments where IP addresses frequently change.
            </p>
        </div>
      </div>
    </div>
  );
};

export default FQDNHostResolution;