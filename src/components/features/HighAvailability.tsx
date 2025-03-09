import React from 'react';

const HighAvailability: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            High Availability
            </h1>
          <p className="text-xl text-center">
            <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2><h2 className="text-xl md:text-2xl text-yellow-400" >2026</h2><h2 className="text-xl md:text-2xl text-red-400" >2027 </h2>
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
          Night's Watch Crow High Availability (HA), a droad map 2026/2027 feature, will be offered in three distinct configurations to meet varying redundancy requirements and hardware investments
          <br />
          <br />
          <h3 className="text-emerald-400" >Rapid Restore/Replace:</h3>
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Sub 15 minute restore/replace through direct device interaction (reboot/replace)</li>
              <li>Link state monitoring and health checks</li>
              <li>Simple configuration and management</li>
              <li>Basic protection against hardware failure or misapplied config</li>
              <li>Requires State Connection rebuild</li>
            </ul>
            <h3 className="text-yellow-400" >Multi-Interface Redundancy:</h3>
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Multiple network interfaces connecting to separate upstream switches</li>
              <li>Active traffic distribution across available interfaces</li>
              <li>Automatic failover on interface or switch failure</li>
              <li>Link state monitoring and health checks</li>
              <li>Minimal additional hardware requirements</li>
              <li>Simple configuration and management</li>
              <li>Basic protection against hardware and network failures</li>
              <li>Maintains existing stateful connection tracking</li>
            </ul>
          <h3 className="text-red-400" >Full Hardware Redundancy:</h3>
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Dual firewall deployment with synchronized state</li>
              <li>Multiple public interfaces per firewall</li>
              <li>Active-passive or active-active configuration options</li>
              <li>Automatic failover with configurable triggers</li>
              <li>State synchronization for seamless transition</li>
              <li>Configuration synchronization between units</li>
              <li>Heartbeat monitoring and health checks</li>
              <li>Zero-downtime maintenance capabilities</li>
              <li>Requires significant additional hardware investment</li>
              <li>Complex deployment and management requirements</li>
              <li>Enhanced protection against all failure scenarios</li>
            </ul>
          The implementation roadmap prioritizes "Rapid Restore/Replace" as an initial offering, multi-interface redundancy as an intermediary offering, with full hardware redundancy planned for future deployment based on customer requirements. The future feature offerings require careful consideration of hardware capacity to maintain performance during normal operations and failover scenarios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HighAvailability;