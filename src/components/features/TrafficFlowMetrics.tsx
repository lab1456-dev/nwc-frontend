import React from 'react';

const TrafficFlowMetrics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Traffic Flow Metrics
            </h1>
          <p className="text-xl md:text-2xl text-green-400">
          <h2 className="text-xl md:text-2xl text-cyan-200"> Roadmap: </h2><h2 className="text-xl md:text-2xl text-emerald-400" >MVP</h2>
          </p>
        </div>

        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            Night's Watch Crow Traffic Flow Metrics, a Minimum Viable Product feature, provides extensive traffic monitoring and logging capabilities through its counter, quota, and logging subsystems. Traffic metrics can be collected at multiple levels:
            Statistics Features:
          <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
            <li>Packet and byte counters per rule</li>
            <li>Connection tracking statistics</li>
            <li>Per-rule quota enforcement with customizable thresholds</li>
            <li>Real-time flow monitoring with packet sampling</li>
            <li>Interface-specific metrics collection</li>
            <li>Protocol-specific counters (TCP, UDP, ICMP)</li>
          </ul>
            Logging Framework (in order of increasing verbosity):
            <ul className="list-decimal list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>emerg - System is unusable (default: logged)</li>
              <li>alert - Action must be taken immediately (default: logged)</li>
              <li>crit - Critical conditions (default: logged)</li>
              <li>err - Error conditions (default: logged)</li>
              <li>warning - Warning conditions (default: logged)</li>
              <li>notice - Normal but significant conditions (default: not logged)</li>
              <li>info - Informational messages (default: not logged)</li>
              <li>debug - Debug-level messages (default: not logged)</li>
            </ul> 
            The default logging level is set to warning. Additional logging levels can be enabled for troubleshooting purposes. Log data can be directed to syslog, netlink queues, or custom targets, supporting integration with external monitoring and analysis tools. The device includes rate limiting capabilities to prevent log flooding during high-traffic events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrafficFlowMetrics;
