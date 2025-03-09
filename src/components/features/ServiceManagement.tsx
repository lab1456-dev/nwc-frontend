import React from 'react';

const ServiceManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Service Management
          </h1>
          <p className="text-xl md:text-2xl text-green-400">
          <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2>
          </p>
        </div>

        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow Service Management, a Minimum Viable Product feature, enables transparent service redirection through its redirect and destination NAT mechanisms, allowing network services to be mapped to specific hosts regardless of the original destination. Key capabilities include:
          <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
            <li>Redirection of service requests based on protocol and port matching</li>
            <li>Support for both UDP and TCP based services</li>
            <li>Ability to intercept and redirect traffic at prerouting and output hooks</li>
            <li>Full tuple matching for granular control over which traffic gets redirected</li>
            <li>Stateful tracking of redirected connections</li>
            <li>Support for both IPv4 and IPv6 traffic redirection</li>
          </ul>
            The framework allows administrators to centralize services like DNS, NTP, and HTTP proxies by intercepting requests and redirecting them to designated internal servers, while maintaining connection state tracking for proper response handling. This can be implemented either globally or with specific source/destination criteria for selective redirection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;