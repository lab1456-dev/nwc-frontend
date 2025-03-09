import React from 'react';

const DHCPServices: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            DHCP Services
          </h1>
          <p className="text-xl text-center">
            <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2><h2 className="text-xl md:text-2xl text-yellow-400" >2026</h2>
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow DHCP Services, a Minimum Viable Product feature, provides domain host control protocol (DHCP) functionality through multiple implementations (primarily ISC DHCP and dnsmasq), offering comprehensive IPv4 and IPv6 address management services. Key capabilities include:
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Dynamic IP address allocation with lease management</li>
              <li>Fixed address assignments based on MAC or client identifiers</li>
              <li>Support for DHCP options including DNS servers, gateways, NTP servers</li>
              <li>DHCP relay functionality for multi-segment networks</li>
              <li>IPv6 stateful (DHCPv6) and stateless (SLAAC) address configuration</li>
              <li>Subnet declaration with range definition and pool management</li>
              <li>Conditional configuration based on client parameters</li>
              <li>Integration with DNS for dynamic DNS updates</li>
              <li>Lease database maintenance and failover support</li>
              <li>Event script execution for lease events</li>
              <li>Class-based configuration for different client types</li>
            </ul>
            The framework supports both simple and complex network configurations, from basic home networks to enterprise environments with multiple subnets and sophisticated address allocation policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DHCPServices;
