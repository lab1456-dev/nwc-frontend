import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, LogIn, LogOut } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import Crow from './Logo';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  const { isAuthenticated, signOut } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Debug
    console.log("Menu toggled, isMenuOpen:", !isMenuOpen);
  };

  const toggleTools = (e: React.MouseEvent) => {
    e.preventDefault();
    setToolsExpanded(!toolsExpanded);
  };

  const toggleFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeaturesExpanded(!featuresExpanded);
  };

  return (
    <nav className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-sm border-b border-cyan-900/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
          <Crow          
          width="w-8" 
          height="h-8" 
          className="mx-auto"
          hover={false}
          shadow={false}
           />
            <span className="text-xl font-bold text-cyan-100">CLS Night's Watch Crow Management</span>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-cyan-100 hover:text-cyan-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/signin"
                className="flex items-center space-x-2 px-4 py-2 text-cyan-100 hover:text-cyan-400 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
            
            {/* Hamburger Menu Button - Always visible */}
            <button
              onClick={toggleMenu}
              className="text-cyan-100 hover:text-cyan-400 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed right-0 top-16 w-64 h-screen bg-slate-900/95 backdrop-blur-sm transform transition duration-200 ease-in-out border-l border-cyan-900/30 overflow-y-auto`}
      >
        <div className="flex flex-col py-4">
          {/* Home - Always visible */}
          <Link
            to="/"
            onClick={toggleMenu}
            className="px-6 py-3 text-cyan-100 hover:bg-cyan-900/50 transition-colors"
          >
            Home
          </Link>

          {/* Features - Always visible */}
          <button
            onClick={toggleFeatures}
            className="px-6 py-3 text-cyan-100 hover:bg-cyan-900/50 transition-colors flex items-center justify-between"
          >
            <span>Features</span>
            {featuresExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          <div className={`${featuresExpanded ? 'block' : 'hidden'} bg-slate-800/50`}>
            <Link
              to="/traffic-filtering"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Traffic Filtering
            </Link>
            <Link
              to="/address-translation"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Address Translation
            </Link>
            <Link
              to="/state-tracking"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              State Tracking
            </Link>
            <Link
              to="/traffic-flow-metrics"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Traffic Flow Metrics
            </Link>
            <Link
              to="/service-management"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Service Management
            </Link>
            <Link
              to="/fqdn-filtering"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              FQDN Filtering
            </Link>
            <Link
              to="/dhcp-services"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              DHCP Services
            </Link>
            <Link
              to="/asset-discovery"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Asset Discovery
            </Link>
            <Link
              to="/vulnerability-assessment"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Vulnerability Assessment
            </Link>
            <Link
              to="/intrusion-detection"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Intrusion Detection
            </Link>
            <Link
              to="/deep-packet-inspection"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              Deep Packet Inspection
            </Link>
            <Link
              to="/high-availability"
              onClick={toggleMenu}
              className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
            >
              High Availability
            </Link>
          </div>

          {/* Authenticated User Menu Items */}
          {isAuthenticated && (
            <>
              {/* Tools Section */}
              <button
                onClick={toggleTools}
                className="px-6 py-3 text-cyan-100 hover:bg-cyan-900/50 transition-colors flex items-center justify-between"
              >
                <span>Tools</span>
                {toolsExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              
              <div className={`${toolsExpanded ? 'block' : 'hidden'} bg-slate-800/50`}>
                <Link
                  to="/provision"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Provision
                </Link>
                <Link
                  to="/receive"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Receive
                </Link>
                <Link
                  to="/deploy"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Deploy
                </Link>
                <Link
                  to="/replace"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Replace
                </Link>
                <Link
                  to="/transfer"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Transfer
                </Link>
                <Link
                  to="/suspendreactivate"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Suspend / Reactivate
                </Link>
                <Link
                  to="/retire"
                  onClick={toggleMenu}
                  className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
                >
                  Retire
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;