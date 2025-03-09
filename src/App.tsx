import React from 'react';
import { Routes, Route } from 'react-router-dom';
//Tools - Require Auth
import RequiredAuth from "./components/RequiredAuth";
import SignInPage from './components/SignInPage';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Provision from './components/tools/Provision';
import Receive from './components/tools/Receive';
import Deploy from './components/tools/Deploy';
import Replace from './components/tools/Replace';
import Transfer from './components/tools/Transfer';
import SuspendReactivate from './components/tools/SuspendReactivate';
import Retire from './components/tools/Retire';
//Features - Everyone
import ServiceDashboard from './components/ServiceDashboard';
import AddressTranslation from './components/features/AddressTranslation';
import AssetDiscovery from './components/features/AssetDiscovery';
import DeepPacketInspection from './components/features/DeepPacketInspection';
import DHCPServices from './components/features/DHCPServices';
import FQDNFiltering from './components/features/FQDNFiltering';
import HighAvailability from './components/features/HighAvailability';
import IntrusionDetection from './components/features/IntrusionDetection';
import LatencyControl from './components/features/LatencyControl';
import ProtocolEnforcement from './components/features/ProtocolEnforcement';
import QOSPrioritization from './components/features/QOSPrioritization';
import ServiceManagement from './components/features/ServiceManagement';
import StateTracking from './components/features/StateTracking';
import TrafficFiltering from './components/features/TrafficFiltering';
import TrafficFlowMetrics from './components/features/TrafficFlowMetrics';
import VulnerabilityAssessment from './components/features/VulnerabilityAssessment';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }: React.PropsWithChildren<{}>) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <main>
      <Navigation />
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/provision" element={<RequiredAuth><Provision /></RequiredAuth>} />
          <Route path="/receive" element={<RequiredAuth><Receive /></RequiredAuth>} />
          <Route path="/deploy" element={<RequiredAuth><Deploy /></RequiredAuth>} />
          <Route path="/replace" element={<RequiredAuth><Replace /></RequiredAuth>} />
          <Route path="/transfer" element={<RequiredAuth><Transfer /></RequiredAuth>} />
          <Route path="/suspendreactive" element={<RequiredAuth><SuspendReactivate /></RequiredAuth>} />
          <Route path="/retire" element={<RequiredAuth><Retire /></RequiredAuth>} />
          <Route path="/address-translation" element={<AddressTranslation />} />
          <Route path="/asset-discovery" element={<AssetDiscovery />} />
          <Route path="/deep-packet-inspection" element={<DeepPacketInspection />} />
          <Route path="/dhcp-services" element={<DHCPServices />} />
          <Route path="/fqdn-filtering" element={<FQDNFiltering />} />
          <Route path="/high-availability" element={<HighAvailability />} />
          <Route path="/intrusion-detection" element={<IntrusionDetection />} />
          <Route path="/latency-control" element={<LatencyControl />} />
          <Route path="/protocol-enforcement" element={<ProtocolEnforcement />} />
          <Route path="/qos-prioritization" element={<QOSPrioritization />} />
          <Route path="/service-management" element={<ServiceManagement />} />
          <Route path="/state-tracking" element={<StateTracking />} />
          <Route path="/traffic-filtering" element={<TrafficFiltering />} />
          <Route path="/traffic-flow-metrics" element={<TrafficFlowMetrics />} />
          <Route path="/vulnerability-assessment" element={<VulnerabilityAssessment />} />
          <Route path="/service-dashboard" element={<ServiceDashboard />} />

        </Routes>
      </ScrollToTop>
    </main>
  );
};

export default App;