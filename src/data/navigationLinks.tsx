/**
 * Navigation link data
 * Centralizes all navigation links for easier maintenance
 */

// Feature links - available to all users
export const featureLinks = [
  {
    path: '/traffic-filtering',
    label: 'Traffic Filtering'
  },
  {
    path: '/address-translation',
    label: 'Address Translation'
  },
  {
    path: '/state-tracking',
    label: 'State Tracking'
  },
  {
    path: '/service-management',
    label: 'Service Management'
  },
  {
    path: '/traffic-flow-metrics',
    label: 'Traffic Flow Metrics'
  },
  {
    path: '/fqdn-filtering',
    label: 'FQDN Filtering'
  },
  {
    path: '/high-availability',
    label: 'High Availability'
  },
{
    path: '/dhcp-services',
    label: 'DHCP Services'
  },
  {
    path: '/asset-discovery',
    label: 'Asset Discovery'
  },
  {
    path: '/vulnerability-assessment',
    label: 'Vulnerability Assessment'
  },
  {
    path: '/intrusion-detection',
    label: 'Intrusion Detection'
  },
  {
    path: '/deep-packet-inspection',
    label: 'Deep Packet Inspection'
  },
  {
    path: '/latency-control',
    label: 'Latency Control'
  },
  {
    path: '/quality-of-service-prioritization',
    label: 'Quality of Service Prioritization'
  },
  {
    path: '/protocol-enforcement',
    label: 'Protocol Enforcement'
  }
  ];

// Tool links - only available to authenticated users
export const toolLinks = [
  {
    path: '/provision',
    label: 'Provision'
  },
  {
    path: '/receive',
    label: 'Receive'
  },
  {
    path: '/deploy',
    label: 'Deploy'
  },
  {
    path: '/replace',
    label: 'Replace'
  },
  {
    path: '/transfer',
    label: 'Transfer'
  },
  {
    path: '/suspendreactivate',
    label: 'Suspend / Reactivate'
  },
  {
    path: '/retire',
    label: 'Retire'
  }
];
