import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, LogIn, LogOut } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import Crow from './Logo';
import { featureLinks, toolLinks, adminLinks } from '../../data/navigationLinks';

/**
 * Navigation component - Main application navigation with responsive mobile menu
 */
const Navigation: React.FC = () => {
  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  
  // Auth context
  const { isAuthenticated, signOut } = useContext(AuthContext);

  /**
   * Toggle main menu visibility
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Toggle tools dropdown
   */
  const toggleTools = (e: React.MouseEvent) => {
    e.preventDefault();
    setToolsExpanded(!toolsExpanded);
  };

  /**
   * Toggle features dropdown
   */
  const toggleFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeaturesExpanded(!featuresExpanded);
  };

  return (
    <nav className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-sm border-b border-cyan-900/30">
      {/* Top navigation bar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and app name */}
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
            {/* Authentication button */}
            {isAuthenticated ? (
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-cyan-100 hover:text-cyan-400 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/signin"
                className="flex items-center space-x-2 px-4 py-2 text-cyan-100 hover:text-cyan-400 transition-colors"
                aria-label="Sign in"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-cyan-100 hover:text-cyan-400 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
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
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col py-4">
          {/* Home link */}
          <Link
            to="/"
            onClick={toggleMenu}
            className="px-6 py-3 text-cyan-100 hover:bg-cyan-900/50 transition-colors"
          >
            Home
          </Link>

          {/* Features dropdown */}
          <DropdownSection
            title="Features"
            isExpanded={featuresExpanded}
            toggleExpanded={toggleFeatures}
            links={featureLinks}
            onLinkClick={toggleMenu}
          />

          {/* Tools dropdown - only shown when authenticated */}
          {isAuthenticated && (
            <DropdownSection
              title="Tools"
              isExpanded={toolsExpanded}
              toggleExpanded={toggleTools}
              links={toolLinks}
              onLinkClick={toggleMenu}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

/**
 * DropdownSection Component - Reusable dropdown section for the mobile menu
 */
interface DropdownSectionProps {
  title: string;
  isExpanded: boolean;
  toggleExpanded: (e: React.MouseEvent) => void;
  links: Array<{ path: string; label: string }>;
  onLinkClick: () => void;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({
  title,
  isExpanded,
  toggleExpanded,
  links,
  onLinkClick
}) => {
  return (
    <>
      <button
        onClick={toggleExpanded}
        className="px-6 py-3 text-cyan-100 hover:bg-cyan-900/50 transition-colors flex items-center justify-between"
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
      
      <div 
        className={`${isExpanded ? 'block' : 'hidden'} bg-slate-800/50`}
        aria-hidden={!isExpanded}
      >
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={onLinkClick}
            className="px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navigation;