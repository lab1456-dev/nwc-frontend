import React from 'react';
import { Link } from 'react-router-dom';
/**
 * Footer component - Main application footer with tag line
 */
export const Footer: React.FC = () => {
  return (
    <footer className="w-full z-50 bg-slate-900">
      <div className="container mx-auto px-4 text-center text-cyan-200/70">
        <p>"I am the shield that guards the realms of networks"</p>
        <p><Link to="https://w.amazon.com/bin/view/CLS/"> Customer Logistics Security</Link></p>
      </div>
    </footer>
  );
};

export default Footer;