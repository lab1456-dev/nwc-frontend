import React from 'react';

const IntrusionDetection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            Intrusion Detection
            </h1>
          <p className="text-xl md:text-2xl text-yellow-400">
            Roadmap: 2026
          </p>
        </div>
        {/* Provision form would go here */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
          Night's Watch Crow's Intrusion Detection System (IDS), a Roadmap 2026 feature, provides real-time network security monitoring through deep packet inspection and traffic analysis. Due to the intensive nature of continuous packet inspection, this service requires enhanced hardware resources to maintain performance. The system offers comprehensive threat detection through:
            <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
              <li>Multi-layered packet inspection and protocol analysis</li>
              <li>Signature-based threat detection using regularly updated rulesets</li>
              <li>Protocol anomaly detection and behavioral analysis</li>
              <li>Pattern matching across packet streams</li>
              <li>Application layer protocol inspection</li>
              <li>Network flow analysis for detecting anomalous patterns</li>
              <li>Custom rule creation for environment-specific threats</li>
              <li>Alert correlation and aggregation</li>
              <li>Configurable alerting thresholds and severity levels</li>
              <li>Support for encrypted traffic analysis capabilities</li>
              <li>Real-time alert generation with detailed context</li>
              <li>Traffic logging for forensic analysis</li>
              <li>Performance optimization through selective inspection rules</li>
              <li>Hardware resource requirements scale with traffic volume and inspection depth</li>
            </ul>
          The system analyzes network traffic in real-time, providing threat detection capabilities while maintaining throughput performance. Alert generation includes detailed metadata about detected threats, enabling rapid incident response and investigation. The modular architecture supports rule customization and tuning to minimize false positives while maintaining comprehensive security coverage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntrusionDetection;
