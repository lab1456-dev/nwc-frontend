import React from 'react';
import { 
  Shield, PenTool, Map, Route, Search, ScanLine, Activity, Network, 
  ScanFace, Radar, BarChart, Zap, FileCode, History, ArrowUpCircle 
} from 'lucide-react';
import type { RoadmapStage } from '../components/featurePages/FeaturePageLayout';

/**
 * Unified interface for feature data
 */
export interface FeatureData {
  title: string;
  icon: React.ReactNode;
  shortDescription: string; // For landing page display
  roadmapStage: RoadmapStage;
  description: string; // Full description for feature page
  bulletPoints?: string[];
  additionalContent?: string;
  urlPath?: string; // Derived from title, added for convenience
}

/**
 * All feature data in a record format for easy lookup
 */
export const featuresData: Record<string, FeatureData> = {
  trafficFiltering: {
    title: 'Traffic Filtering',
    icon: <Shield className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Standing firm as the ancient Wall between wildlings and the realm, our segmentation firewall filters every packet, ensuring only authorized traffic reaches your protected network.",
    roadmapStage: 'MVP',
    description: "Night's Watch Crow Traffic Filtering, a Minimum Viable Product feature, provides stateful packet filtering through a flexible, dynamic ruleset framework. It offers comprehensive packet classification and filtering based on protocol fields across network layers 2-4, including:",
    bulletPoints: [
      'Layer 2: MAC addresses, ethertype, bridge port',
      'Layer 3: IP addresses, IP protocol, IP options, fragmentation',
      'Layer 4: TCP/UDP ports, TCP flags and connection states, ICMP types/codes',
      'Prefix List like collections of similar addresses contained in a managable form'
    ],
    additionalContent: "The filtering engine supports advanced matching criteria through stateful connection tracking, rate limiting, and set-based operations for efficient handling of large IP/port ranges. Rules can be organized into type-specific chains (filter, route, nat) and tables, with customizable priorities and hooks into the netfilter packet processing pipeline.\n\nFlow control actions include accept, drop, reject (with configurable ICMP responses), queue (to userspace), and jump/goto for rule organization. The framework supports atomic ruleset updates and uses a just-in-time (JIT) compiler to optimize packet processing performance."
  },

  addressTranslation: {
    title: 'Address Translation',
    icon: <PenTool className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Masters of disguise like the Faceless Men, our NAT system transforms and shields your network identities, keeping your true addresses hidden from prying eyes.",
    roadmapStage: 'MVP',
    description: "Night's Watch Crow Address Translation, a Minimum Viable Product feature, implements flexible network address translation (NAT) through its NAT table type, supporting all standard NAT operations including source NAT (SNAT), destination NAT (DNAT), masquerading, and bidirectional NAT (port forwarding).",
    bulletPoints: [
      'Full tuple matching (source/destination address, port, protocol) for translation',
      'Dynamic address translation masquerading for varying WAN IP scenarios',
      'Static NAT mappings with optional port translation (1:1 NAT)',
      'Port forwarding with support for port ranges and multiple protocols',
      'Address and port randomization for enhanced security',
      'Fully stateful NAT tracking integrated with the connection tracking system'
    ],
    additionalContent: "NAT rules can be configured with fine-grained control over address/port selection and can be combined with filtering rules for comprehensive network policy enforcement. The implementation maintains translation state tables for connection tracking and supports atomic ruleset updates for seamless configuration changes."
  },

  stateTracking: {
    title: 'State Tracking',
    icon: <History className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Attentive as a Maester tracking the seasons' change, our state monitoring system observes every industrial connection, preserving the proper sequence of operations.",
    roadmapStage: 'MVP',
    description: "Night's Watch Crow State Tracking, a Minimum Viable Product feature, manages a connection tracking subsystem to provide comprehensive stateful packet inspection and connection management. The state tracking system:",
    bulletPoints: [
      'Maintains detailed connection state information across all supported protocols',
      'Tracks standard connection states: new, established, related, invalid, untracked',
      'Supports complex protocols with multiple related connections (e.g., FTP, SIP)',
      'Provides timeout configuration for different connection states',
      'Enables state-based filtering decisions for enhanced security',
      'Maintains connection status across NAT operations',
      'Tracks connection metrics including bytes, packets, and duration',
      'Supports helper modules for protocol-specific tracking requirements',
      'Allows manual state table management for administrative control',
      'Provides tunable memory limits and garbage collection parameters'
    ],
    additionalContent: "Connection state information is preserved during ruleset updates through Crow's atomic replacement mechanism, ensuring uninterrupted tracking of existing connections when firewall rules are modified. The connection tracking system automatically times out inactive connections and supports administrative clearing of connection states."
  },

  serviceManagement: {
    title: 'Service Management',
    icon: <Route className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Disciplined as the Night's Watch manning their posts, our service mapping system directs vital traffic through trusted channels, maintaining order in your network realm.",
    roadmapStage: 'MVP',
    description: "Night's Watch Crow Service Management, a Minimum Viable Product feature, enables transparent service redirection through its redirect and destination NAT mechanisms, allowing network services to be mapped to specific hosts regardless of the original destination. Key capabilities include:",
    bulletPoints: [
      'Redirection of service requests based on protocol and port matching',
      'Support for both UDP and TCP based services',
      'Ability to intercept and redirect traffic at prerouting and output hooks',
      'Full tuple matching for granular control over which traffic gets redirected',
      'Stateful tracking of redirected connections',
      'Support for both IPv4 and IPv6 traffic redirection'
    ],
    additionalContent: "The framework allows administrators to centralize services like DNS, NTP, and HTTP proxies by intercepting requests and redirecting them to designated internal servers, while maintaining connection state tracking for proper response handling. This can be implemented either globally or with specific source/destination criteria for selective redirection."
  },

  trafficFlowMetrics: {
    title: 'Traffic Flow Metrics',
    icon: <BarChart className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Meticulous as the Citadel's ancient records, our flow analysis system captures every network interaction, transforming raw data into actionable intelligence.",
    roadmapStage: 'MVP',
    description: "Night's Watch Crow Traffic Flow Metrics, a Minimum Viable Product feature, provides extensive traffic monitoring and logging capabilities through its counter, quota, and logging subsystems. Traffic metrics can be collected at multiple levels:",
    bulletPoints: [
      'Packet and byte counters per rule',
      'Connection tracking statistics',
      'Per-rule quota enforcement with customizable thresholds',
      'Real-time flow monitoring with packet sampling',
      'Interface-specific metrics collection',
      'Protocol-specific counters (TCP, UDP, ICMP)'
    ],
    additionalContent: "The framework offers a comprehensive logging system with multiple severity levels from emergency to debug, with configurable verbosity. The default logging level is set to warning, with additional levels available for troubleshooting. Log data can be directed to syslog, netlink queues, or custom targets, supporting integration with external monitoring and analysis tools. Rate limiting capabilities prevent log flooding during high-traffic events."
  },

  fqdnFiltering: {
    title: 'FQDN Filtering',
    icon: <Map className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Armed with the precision of a Grand Maester's maps, our domain resolution service charts the true path to every destination, ensuring messages find their intended targets.",
    roadmapStage: 'MVP',
    description: "Night's Watch Crow's FQDN Based Filtering, a Minimum Viable Product feature, provides dynamic IP address management for Crow's filtering rules by actively monitoring and resolving domain names to their corresponding IP addresses. This service enhances Crow's filtering capabilities by:",
    bulletPoints: [
      'Automatic resolution and tracking of fully qualified domain names (FQDNs)',
      'Pre-emptive updates of Crow\'s filtering rules based on DNS Time to Live (TTL) values',
      'Atomic set updates to maintain connection state consistency',
      'Multi-threaded resolution for high-performance environments',
      'Caching of DNS responses with TTL-aware expiration'
    ],
    additionalContent: "The service maintains synchronized IP address sets, ensuring that domain-based filtering rules remain current without manual intervention. By leveraging Crow's atomic update capabilities, the service updates IP address sets without disrupting existing connections or creating temporary security gaps during updates. This provides a robust solution for maintaining current domain-based filtering in dynamic environments where IP addresses frequently change."
  },

  highAvailability: {
    title: 'High Availability',
    icon: <Activity className="w-12 h-12 text-emerald-400" />,
    shortDescription: "Blessed with R'hllor's power of resurrection, our system springs back to life in moments of darkness, ensuring your network's watch never falters.",
    roadmapStage: 'MVP,2026,2027',
    description: "Night's Watch Crow High Availability (HA), a roadmap 2026/2027 feature, will be offered in three distinct configurations to meet varying redundancy requirements and hardware investments:",
    bulletPoints: [
      'Rapid Restore/Replace (MVP): Sub 15 minute restore/replace through direct device interaction',
      'Rapid Restore/Replace (MVP): Basic protection against hardware failure or misapplied config',
      'Multi-Interface Redundancy (2026): Multiple network interfaces connecting to separate upstream switches',
      'Multi-Interface Redundancy (2026): Automatic failover on interface or switch failure',
      'Multi-Interface Redundancy (2026): Maintains existing stateful connection tracking',
      'Full Hardware Redundancy (2027): Dual firewall deployment with synchronized state',
      'Full Hardware Redundancy (2027): Active-passive or active-active configuration options',
      'Full Hardware Redundancy (2027): Zero-downtime maintenance capabilities',
      'Full Hardware Redundancy (2027): Enhanced protection against all failure scenarios'
    ],
    additionalContent: "The implementation roadmap prioritizes \"Rapid Restore/Replace\" as an initial offering, multi-interface redundancy as an intermediary offering, with full hardware redundancy planned for future deployment based on customer requirements. The future feature offerings require careful consideration of hardware capacity to maintain performance during normal operations and failover scenarios."
  },

  dhcpServices: {
    title: 'DHCP Services',
    icon: <Network className="w-12 h-12 text-yellow-400" />,
    shortDescription: "Organized as the Lord Commander assigning quarters at Castle Black, our DHCP service grants each device its rightful place, maintaining perfect order in your network's ranks.",
    roadmapStage: 'MVP,2026',
    description: "Night's Watch Crow DHCP Services, a Minimum Viable Product feature, provides domain host control protocol (DHCP) functionality through multiple implementations (primarily ISC DHCP and dnsmasq), offering comprehensive IPv4 and IPv6 address management services. Key capabilities include:",
    bulletPoints: [
      'Dynamic IP address allocation with lease management',
      'Fixed address assignments based on MAC or client identifiers',
      'Support for DHCP options including DNS servers, gateways, NTP servers',
      'DHCP relay functionality for multi-segment networks',
      'IPv6 stateful (DHCPv6) and stateless (SLAAC) address configuration',
      'Subnet declaration with range definition and pool management',
      'Conditional configuration based on client parameters',
      'Integration with DNS for dynamic DNS updates',
      'Lease database maintenance and failover support',
      'Event script execution for lease events',
      'Class-based configuration for different client types'
    ],
    additionalContent: "The framework supports both simple and complex network configurations, from basic home networks to enterprise environments with multiple subnets and sophisticated address allocation policies."
  },

  assetDiscovery: {
    title: 'Asset Discovery',
    icon: <Radar className="w-12 h-12 text-yellow-400" />,
    shortDescription: "Gifted with the Three-Eyed Raven's all-seeing vision, our discovery system reveals every device in your realm, ensuring no asset remains hidden from your watch.",
    roadmapStage: '2026,2027',
    description: "Night's Watch Crow's Asset Discovery, a Roadmap 2026/2027 feature, provides active and/or passive asset discovery techniques to maintain real-time awareness of devices connecting to and departing from the protected network. The system can be configured to operate in active-only, passive-only, or combined modes.",
    bulletPoints: [
      'Active Discovery (2026): Low-impact NMAP scanning with customizable scan intervals',
      'Active Discovery (2026): OS fingerprinting and service identification',
      'Active Discovery (2026): Port state monitoring for common services',
      'Passive Discovery (2027): Real-time network traffic analysis',
      'Passive Discovery (2027): Protocol-aware device fingerprinting',
      'Passive Discovery (2027): Connection pattern analysis',
      'Passive Discovery (2027): Service usage detection',
      'Passive Discovery (2027): MAC address tracking'
    ],
    additionalContent: "The configurable nature of these approaches enables tailored asset tracking with either systematic scanning, real-time detection, or both. While no single discovery method provides perfect coverage, the available monitoring options deliver high-confidence device detection and departure notification. The system maintains a dynamic inventory of network assets that can be leveraged for security policy enforcement and network management decisions. Passive discovery may require enhanced hardware due to continuous monitoring overhead."
  },

  vulnerabilityAssessment: {
    title: 'Vulnerability Assessment',
    icon: <ScanFace className="w-12 h-12 text-yellow-400" />,
    shortDescription: "Sharp as a Maester's trained eye inspecting castle defenses, our assessment system identifies weak points in your armor, empowering you to fortify before attacks strike.",
    roadmapStage: '2026',
    description: "Night's Watch Crow's Vulnerability Assessment, a Roadmap 2026 feature, provides automated security posture evaluation for devices that lack host-based security controls or are not enrolled in CLS's BoM inventory management program. This supplementary security feature:",
    bulletPoints: [
      'Performs non-intrusive vulnerability scanning of network-accessible services',
      'Identifies outdated software versions and potentially vulnerable configurations',
      'Maps discovered services against known vulnerability databases',
      'Supports customizable scan policies and frequencies',
      'Enables targeted assessment of specific network segments or devices',
      'Provides vulnerability severity scoring and prioritization',
      'Integrates with network asset discovery for comprehensive coverage',
      'Complements existing BoM-based firmware vulnerability tracking',
      'Offers scheduling controls to minimize operational impact',
      'Supports scan blackout windows for sensitive operational periods'
    ],
    additionalContent: "This capability bridges security visibility gaps for devices that cannot participate in standard host-based security controls or BoM tracking, providing stakeholders with critical vulnerability insights for their complete device inventory. The assessment framework is designed to maintain operational stability while delivering necessary security insights for unmanaged or legacy devices."
  },

  intrusionDetection: {
    title: 'Intrusion Detection',
    icon: <ScanLine className="w-12 h-12 text-yellow-400" />,
    shortDescription: "Vigilant as sentries atop the Wall, our intrusion detection system spots approaching threats, raising the alarm before your defenses can be breached.",
    roadmapStage: '2026',
    description: "Night's Watch Crow's Intrusion Detection System (IDS), a Roadmap 2026 feature, provides real-time network security monitoring through deep packet inspection and traffic analysis. Due to the intensive nature of continuous packet inspection, this service requires enhanced hardware resources to maintain performance. The system offers comprehensive threat detection through:",
    bulletPoints: [
      'Multi-layered packet inspection and protocol analysis',
      'Signature-based threat detection using regularly updated rulesets',
      'Protocol anomaly detection and behavioral analysis',
      'Pattern matching across packet streams',
      'Application layer protocol inspection',
      'Network flow analysis for detecting anomalous patterns',
      'Custom rule creation for environment-specific threats',
      'Alert correlation and aggregation',
      'Configurable alerting thresholds and severity levels',
      'Support for encrypted traffic analysis capabilities',
      'Real-time alert generation with detailed context',
      'Traffic logging for forensic analysis',
      'Performance optimization through selective inspection rules',
      'Hardware resource requirements scale with traffic volume and inspection depth'
    ],
    additionalContent: "The system analyzes network traffic in real-time, providing threat detection capabilities while maintaining throughput performance. Alert generation includes detailed metadata about detected threats, enabling rapid incident response and investigation. The modular architecture supports rule customization and tuning to minimize false positives while maintaining comprehensive security coverage."
  },

  deepPacketInspection: {
    title: 'Deep Packet Inspection',
    icon: <Search className="w-12 h-12 text-yellow-400" />,
    shortDescription: "Thorough as a Maester studying ancient scrolls, our deep packet inspection examines every detail of network traffic, revealing hidden threats within seemingly innocent messages.",
    roadmapStage: '2026',
    description: "Night's Watch Crow Deep Packet Inspection (DPI), a Roadmap 2026 feature, provides granular network traffic analysis and application-layer visibility. This resource-intensive service requires substantial hardware capacity that scales with traffic volume and analysis depth. The system delivers detailed traffic insights through:",
    bulletPoints: [
      'Application protocol identification and classification',
      'Content-based traffic categorization',
      'User behavior and application usage patterns',
      'File type identification in network streams',
      'Protocol compliance monitoring',
      'Traffic metadata extraction and analysis',
      'Application-specific security policy enforcement',
      'Bandwidth usage analysis per application',
      'Data exfiltration detection capabilities',
      'SSL/TLS certificate and cipher analysis',
      'Application command monitoring',
      'Resource access pattern analysis',
      'Session reconstruction capabilities',
      'Performance profiling of application protocols',
      'Hardware requirements scale with inspection depth and traffic volume'
    ],
    additionalContent: "DPI analysis provides essential visibility into network applications and user behaviors, complementing IDS capabilities with detailed protocol and application-layer insights. The service can be tuned to balance inspection depth with performance requirements, allowing focused analysis of critical traffic patterns while managing hardware resource utilization."
  },

  latencyControl: {
    title: 'Latency Control',
    icon: <Zap className="w-12 h-12 text-red-400" />,
    shortDescription: "Swift as a blade of Valyrian steel, our optimized hardware slices through network congestion, delivering the speed your critical operations demand.",
    roadmapStage: '2027',
    description: "Night's Watch Crow Latency Control Service, a Roadmap 2027 feature, provides specialized traffic handling for latency-sensitive applications through dedicated hardware resources and optimized packet processing. This performance-focused feature offers:",
    bulletPoints: [
      'Dedicated processing paths for latency-sensitive traffic',
      'Configurable traffic identification for priority handling',
      'Real-time latency monitoring and reporting',
      'Hardware-accelerated packet processing',
      'Minimized processing overhead',
      'Latency threshold alerts and reporting',
      'Performance metrics tracking',
      'Buffer management optimization',
      'CPU scheduling prioritization',
      'Hardware resource allocation controls',
      'Separate from traditional public side network QoS mechanisms',
      'Requires enhanced hardware platform'
    ],
    additionalContent: "The service maintains optimal performance for critical applications where minimal latency is essential, operating independently from standard QoS mechanisms. Implementation requires higher-capability hardware platforms to ensure dedicated resources are available for latency-sensitive traffic processing while maintaining overall system performance."
  },

  qosPrioritization: {
    title: 'Quality of Service Prioritization',
    icon: <ArrowUpCircle className="w-12 h-12 text-red-400" />,
    shortDescription: "Decisive as the Lord Commander directing the Wall's defense, our QoS system ensures critical traffic receives priority passage, maintaining the rhythm of your production line.",
    roadmapStage: '2027',
    description: "Night's Watch Crow Quality of Service (QoS), a Roadmap 2027 feature, provides traffic flow control functionality through its packet classification and queueing disciplines. The QoS implementation enables:",
    bulletPoints: [
      'Traffic classification based on multiple criteria (ports, protocols, addresses)',
      'Bandwidth allocation and rate limiting',
      'Priority-based packet scheduling',
      'Hierarchical traffic class management',
      'Queue discipline configuration',
      'Packet marking for downstream handling',
      'Burst allowance configuration',
      'Traffic policing and shaping',
      'Configurable drop policies',
      'Per-flow rate control',
      'DSCP/TOS field manipulation',
      'Integration with connection tracking',
      'Real-time queue statistics',
      'Atomic rule updates for configuration changes'
    ],
    additionalContent: "The framework leverages nftables' packet classification capabilities to provide granular traffic control while maintaining the benefits of atomic ruleset updates. QoS policies can be dynamically adjusted without disrupting existing traffic flows, enabling flexible bandwidth management and traffic prioritization based on network requirements."
  },

  protocolEnforcement: {
    title: 'Protocol Enforcement',
    icon: <FileCode className="w-12 h-12 text-red-400" />,
    shortDescription: "Strict as the ancient laws of the Night's Watch, our protocol enforcement system maintains order in your industrial communications, protecting against commands that could bring chaos.",
    roadmapStage: '2027',
    description: "Night's Watch Crow Protocol Enforcement, a Roadmap 2027 feature, provides Layer 7 application-aware control specifically designed for industrial control system (ICS) protocols. This deep protocol inspection and enforcement mechanism enables:",
    bulletPoints: [
      'Industrial protocol command validation and filtering',
      'Function code restriction and validation',
      'Protocol state machine enforcement',
      'Read/write operation control',
      'Protocol sequence validation',
      'Address range restrictions',
      'Value range enforcement',
      'Command rate limiting',
      'Protocol fragmentation control',
      'Malformed packet detection',
      'Protocol compliance monitoring',
      'Custom rule creation for proprietary protocols',
      'Detailed command logging capabilities',
      'Protocol-specific security policy enforcement',
      'Hardware requirements scale with protocol complexity'
    ],
    additionalContent: "The service provides granular control over industrial protocol behaviors, ensuring operations remain within defined parameters and security policies. Supporting common industrial protocols (such as Modbus, S7, DNP3), the enforcement mechanism helps maintain operational integrity while protecting against protocol abuse or misuse. This capability requires enhanced hardware resources due to the deep packet inspection and stateful protocol tracking requirements."
  }
};

// Add URL paths to all features
Object.keys(featuresData).forEach(key => {
  featuresData[key].urlPath = featuresData[key].title.toLowerCase().replace(/\s+/g, '-');
});

/**
 * Helper functions to get features by roadmap stage
 */
export const getMVPFeatures = () => 
  Object.values(featuresData).filter(feature => 
    feature.roadmapStage.includes('MVP'));

export const get2026Features = () => 
  Object.values(featuresData).filter(feature => 
    feature.roadmapStage.includes('2026'));

export const get2027Features = () => 
  Object.values(featuresData).filter(feature => 
    feature.roadmapStage.includes('2027'));

/**
 * Get all features as an array
 */
export const getAllFeatures = () => Object.values(featuresData);

/**
 * Get a feature by its key
 */
export const getFeatureByKey = (key: string) => featuresData[key];

/**
 * Get a feature by its URL path
 */
export const getFeatureByUrlPath = (path: string) => 
  Object.values(featuresData).find(feature => feature.urlPath === path);