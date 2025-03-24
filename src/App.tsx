import React from 'react';
import { Routes, Route } from 'react-router-dom';

//Common Components  
import RequiredAuth from "./components/common/RequiredAuth";
import SignInPage from './components/common/SignInPage';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import Unauthorized from './components/common/Unauthorized';

//Pages
import LandingPage from './pages/LandingPage';
import Provision from './pages/tools/Provision';
import StyleGuide from './pages/tools/StyleGuide';
import Profile from './pages/tools/Profile';

//Features - Everyone
import AddressTranslation from './pages/features/AddressTranslation';
import AssetDiscovery from './pages/features/AssetDiscovery';
import DeepPacketInspection from './pages/features/DeepPacketInspection';
import DHCPServices from './pages/features/DHCPServices';
import FQDNFiltering from './pages/features/FQDNFiltering';
import HighAvailability from './pages/features/HighAvailability';
import IntrusionDetection from './pages/features/IntrusionDetection';
import LatencyControl from './pages/features/LatencyControl';
import ProtocolEnforcement from './pages/features/ProtocolEnforcement';
import QOSPrioritization from './pages/features/QOSPrioritization';
import ServiceManagement from './pages/features/ServiceManagement';
import StateTracking from './pages/features/StateTracking';
import TrafficFiltering from './pages/features/TrafficFiltering';
import TrafficFlowMetrics from './pages/features/TrafficFlowMetrics';
import VulnerabilityAssessment from './pages/features/VulnerabilityAssessment';

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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/styleguide" element={<RequiredAuth><StyleGuide /></RequiredAuth>} />
          <Route path="/provision" element={<RequiredAuth><Provision /></RequiredAuth>} />
          <Route path="/address-translation" element={<AddressTranslation />} />
          <Route path="/asset-discovery" element={<AssetDiscovery />} />
          <Route path="/deep-packet-inspection" element={<DeepPacketInspection />} />
          <Route path="/dhcp-services" element={<DHCPServices />} />
          <Route path="/fqdn-filtering" element={<FQDNFiltering />} />
          <Route path="/high-availability" element={<HighAvailability />} />
          <Route path="/intrusion-detection" element={<IntrusionDetection />} />
          <Route path="/latency-control" element={<LatencyControl />} />
          <Route path="/protocol-enforcement" element={<ProtocolEnforcement />} />
          <Route path="/quality-of-service-prioritization" element={<QOSPrioritization />} />
          <Route path="/service-management" element={<ServiceManagement />} />
          <Route path="/state-tracking" element={<StateTracking />} />
          <Route path="/traffic-filtering" element={<TrafficFiltering />} />
          <Route path="/traffic-flow-metrics" element={<TrafficFlowMetrics />} />
          <Route path="/vulnerability-assessment" element={<VulnerabilityAssessment />} />
        </Routes>
      </ScrollToTop>
      <Footer />
    </main>
  );
};

export default App;