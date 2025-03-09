import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Shield, PenTool, Map, Route, Search, ScanLine, Activity, Network, ScanFace, Radar, BarChart, Zap, FileCode, History, ArrowUpCircle, Info, ChevronDown} from 'lucide-react';
import Crow from './Logo';


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {

  const urlPath = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link to={`/${urlPath}`} className="block">  
      <div className="feature-card">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h3 className="flex justify-center text-l md:text-2xl text-cyan-200 mb-2">
          {title}
        </h3>
        <p className="flex justify-center to-light-blue-500">
          {description}
        </p>
      </div>
    </Link> 
  ); 
};

const LandingPage: React.FC = () => {
  
  const [showStyleGuide, setShowStyleGuide] = useState(false);

  const toggleStyleGuide = () => {
    setShowStyleGuide(!showStyleGuide);
  };

  const features: FeatureCardProps[] = [
    {
      icon: <Shield className="w-12 h-12 text-emerald-400" />,
      title: "Traffic Filtering",
      description: "Standing firm as the ancient Wall between wildlings and the realm, our segmentation firewall filters every packet, ensuring only authorized traffic reaches your protected network."
    },
    {
      icon: <PenTool className="w-12 h-12 text-emerald-400" />,
      title: "Address Translation",
      description: "Masters of disguise like the Faceless Men, our NAT system transforms and shields your network identities, keeping your true addresses hidden from prying eyes."
    },
    {
      icon: <History className="w-12 h-12 text-emerald-400" />,
      title: "State Tracking",
      description: "Attentive as a Maester tracking the seasons' change, our state monitoring system observes every industrial connection, preserving the proper sequence of operations."
    },
    {
      icon: <Route className="w-12 h-12 text-emerald-400" />,
      title: "Service Management",
      description: "Disciplined as the Night's Watch manning their posts, our service mapping system directs vital traffic through trusted channels, maintaining order in your network realm."
    },
    {
      icon: <BarChart className="w-12 h-12 text-emerald-400" />,
      title: "Traffic Flow Metrics",
      description: "Meticulous as the Citadel's ancient records, our flow analysis system captures every network interaction, transforming raw data into actionable intelligence."
    },
    {
      icon: <Map className="w-12 h-12 text-emerald-400" />,
      title: "FQDN Filtering",
      description: "Armed with the precision of a Grand Maester's maps, our domain resolution service charts the true path to every destination, ensuring messages find their intended targets."
    },
    {
      icon: <Activity className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-red-600 text-emerald-400" />,
      title: "High Availability",
      description: "Blessed with R'hllor's power of resurrection, our system springs back to life in moments of darkness, ensuring your network's watch never falters."
    },
    {
      icon: <Network className="w-12 h-12 text-yellow-400" />,
      title: "DHCP Services",
      description: "Organized as the Lord Commander assigning quarters at Castle Black, our DHCP service grants each device its rightful place, maintaining perfect order in your network's ranks."
    },
    {
      icon: <Radar className="w-12 h-12 text-yellow-400" />,
      title: "Asset Discovery",
      description: "Gifted with the Three-Eyed Raven's all-seeing vision, our discovery system reveals every device in your realm, ensuring no asset remains hidden from your watch."
    },
    {
      icon: <ScanFace className="w-12 h-12 text-yellow-400" />,
      title: "Vulnerability Assessment",
      description: "Sharp as a Maester's trained eye inspecting castle defenses, our assessment system identifies weak points in your armor, empowering you to fortify before attacks strike."
    },
    {
      icon: <ScanLine className="w-12 h-12 text-yellow-400" />,
      title: "Intrusion Detection",
      description: "Vigilant as sentries atop the Wall, our intrusion detection system spots approaching threats, raising the alarm before your defenses can be breached."
    },
    {
      icon: <Search className="w-12 h-12 text-yellow-400" />,
      title: "Deep Packet Inspection",
      description: "Thorough as a Maester studying ancient scrolls, our deep packet inspection examines every detail of network traffic, revealing hidden threats within seemingly innocent messages."
    },
    {
      icon: <Zap className="w-12 h-12 text-red-400" />,
      title: "Latency Control",
      description: "Swift as a blade of Valyrian steel, our optimized hardware slices through network congestion, delivering the speed your critical operations demand."
    },
    {
      icon: <ArrowUpCircle className="w-12 h-12 text-red-400" />,
      title: "QoS Prioritization",
      description: "Decisive as the Lord Commander directing the Wall's defense, our QoS system ensures critical traffic receives priority passage, maintaining the rhythm of your production line."
    },
    {
      icon: <FileCode className="w-12 h-12 text-red-400" />,
      title: "Protocol Enforcement",
      description: "Strict as the ancient laws of the Night's Watch, our protocol enforcement system maintains order in your industrial communications, protecting against commands that could bring chaos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-center mb-6 text-cyan-100">
            The Shield that Guards the Realms of Your Network
          </p>
        </div>
        
        <div className="flex justify-center">
          <Crow          
          width="w-36" 
          height="h-36" 
          className="mx-auto"
          shadow={true}
          hover={true}
           />
        </div>
      </header>

      {/* Main Features */}
      <section className="bg-gradient-to-b from-cyan-950/50 to-slate-900/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl text-center mb-6 text-cyan-100">
            Our Oath to Your Security
          </h2>
          
          {/* Fix: Replace nested <p><h2>...</h2></p> with proper div structure */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl text-cyan-200 mb-2">Roadmap:</h2>
            <div className="flex justify-center space-x-4">
              <h2 className="text-xl md:text-2xl text-emerald-400">MVP</h2>
              <h2 className="text-xl md:text-2xl text-yellow-400">2026</h2>
              <h2 className="text-xl md:text-2xl text-red-400">2027</h2>
            </div>
          </div>
  
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-cyan-100">
          Take the Black
        </h2>
        <p className="text-xl text-cyan-200/70 mb-8">
          Join the ranks of those who protect their networks with unwavering dedication.
        </p>
        <button 
          className="cta-button"
        >
          Start Your Watch
        </button>
      </section> 
      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-cyan-100">
          Summon the Maesters
        </h2>
        <p className="text-xl text-cyan-200/70 mb-8">
          We are here to serve you and your network, summon us when you need us.
        </p>
        <button 
          className="cta-button"
        >
          Summon the Maesters
        </button>
      </section>


      {/* Footer */}
      <footer className="bg-gradient-to-b from-cyan-950/30 to-slate-900 py-8">
        <div className="container mx-auto px-4 text-center text-cyan-200/70">
          <p>"I am the shield that guards the realms of networks"</p>
        </div>
      </footer>

      {/* Windi CSS Reference - Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleStyleGuide} 
          className="bg-slate-800 hover:bg-slate-700 text-cyan-200 p-4 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Toggle Style Guide"
        >
          {showStyleGuide ? <ChevronDown className="w-6 h-6" /> : <Info className="w-6 h-6" />}
        </button>
      </div>

      {/* Windi CSS Reference Guide */}
      {showStyleGuide && (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-cyan-100">Windi CSS Reference Guide</h2>
            <p className="text-xl text-center mb-12 text-cyan-200">Visual examples of Windi CSS utilities for your project</p>
            
            {/* Color Utilities */}
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-cyan-100 border-b border-cyan-900/50 pb-2">Color Utilities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Text Colors</h4>
                  <p className="text-cyan-100 mb-2">text-cyan-100: Light cyan text</p>
                  <p className="text-cyan-200 mb-2">text-cyan-200: Medium cyan text</p>
                  <p className="text-cyan-400 mb-2">text-cyan-400: Brighter cyan text</p>
                  <p className="text-cyan-600 mb-2">text-cyan-600: Deep cyan text</p>
                  <p className="text-emerald-400 mb-2">text-emerald-400: Emerald text (for icons)</p>
                  <p className="text-slate-100 mb-2">text-slate-100: Light slate text</p>
                  <p className="text-slate-800 mb-2">text-slate-800: Dark slate text</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Background Colors</h4>
                  <div className="mb-2 p-3 bg-slate-900 rounded">bg-slate-900: Slate 900 background</div>
                  <div className="mb-2 p-3 bg-cyan-950 rounded">bg-cyan-950: Cyan 950 background</div>
                  <div className="mb-2 p-3 bg-slate-800/80 rounded">bg-slate-800/80: Slate with 80% opacity</div>
                  <div className="mb-2 p-3 border bg-transparent border-cyan-900/30 rounded">bg-cyan-900/30: Cyan with 30% opacity (border)</div>
                </div>
              </div>
            </section>
            
            {/* Layout Utilities */}
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-cyan-100 border-b border-cyan-900/50 pb-2">Layout Utilities</h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4 text-cyan-200">Container & Grid</h4>
                <div className="container mx-auto bg-slate-800/50 p-4 mb-4 rounded">
                  <p className="text-center">container mx-auto: Centered container with auto margins</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/50 p-4 rounded">Column 1</div>
                  <div className="bg-slate-800/50 p-4 rounded">Column 2</div>
                  <div className="bg-slate-800/50 p-4 rounded">Column 3</div>
                </div>
                <p className="text-cyan-200/70 mb-6">grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4: Responsive grid</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4 text-cyan-200">Flexbox</h4>
                <div className="flex justify-center items-center bg-slate-800/50 h-24 mb-4 rounded">
                  <p>Centered content</p>
                </div>
                <p className="text-cyan-200/70 mb-6">flex justify-center items-center: Centered flex container</p>
                
                <div className="flex space-x-4 mb-4">
                  <div className="bg-slate-800/50 p-4 rounded">Item 1</div>
                  <div className="bg-slate-800/50 p-4 rounded">Item 2</div>
                  <div className="bg-slate-800/50 p-4 rounded">Item 3</div>
                </div>
                <p className="text-cyan-200/70">flex space-x-4: Flex with horizontal spacing</p>
              </div>
            </section>
            
            {/* Typography & Spacing */}
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-cyan-100 border-b border-cyan-900/50 pb-2">Typography & Spacing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Typography</h4>
                  <h2 className="text-xl md:text-2xl lg:text-3xl mb-2">text-xl md:text-2xl lg:text-3xl</h2>
                  <p className="font-bold mb-2">font-bold: Bold text</p>
                  <p className="text-center mb-2">text-center: Centered text</p>
                  <p className="uppercase mb-2">uppercase: Uppercase text</p>
                  <p className="tracking-wider mb-2">tracking-wider: Wide letter spacing</p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Spacing</h4>
                  <div className="bg-slate-800/50 p-4 mb-4 rounded">p-4: Padding on all sides</div>
                  <div className="bg-slate-800/50 px-4 py-8 mb-4 rounded">px-4 py-8: Horizontal and vertical padding</div>
                  <div className="bg-slate-800/50 pt-4 pr-6 pb-8 pl-2 mb-4 rounded">pt-4 pr-6 pb-8 pl-2: Individual side padding</div>
                  <div className="bg-slate-800/50 mx-auto p-4 mb-4 rounded w-3/4">mx-auto: Horizontally centered</div>
                </div>
              </div>
            </section>
            
            {/* Effects & Gradients */}
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-cyan-100 border-b border-cyan-900/50 pb-2">Effects & Gradients</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Effects</h4>
                  <div className="backdrop-blur-sm bg-slate-800/30 p-4 mb-4 rounded">
                    backdrop-blur-sm: Slight backdrop blur
                  </div>
                  <div className="drop-shadow-xl bg-slate-800 p-4 mb-4 rounded">
                    drop-shadow-xl: Extra large drop shadow
                  </div>
                  <div className="border border-cyan-900/30 p-4 mb-4 rounded">
                    border border-cyan-900/30: Border with opacity
                  </div>
                  <div className="rounded-full bg-slate-800 p-4 mb-4 w-32 h-32 flex items-center justify-center mx-auto">
                    rounded-full
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Gradients</h4>
                  <div className="bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 p-6 mb-4 rounded min-h-32 flex items-center justify-center">
                    bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900
                  </div>
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 mb-4 rounded min-h-16 flex items-center justify-center">
                    bg-gradient-to-r from-cyan-600 to-blue-600
                  </div>
                  <div className="bg-gradient-to-b from-cyan-950/50 to-slate-900/50 backdrop-blur-sm p-6 rounded min-h-16 flex items-center justify-center">
                    bg-gradient-to-b from-cyan-950/50 to-slate-900/50
                  </div>
                </div>
              </div>
            </section>
            
            {/* Windi Shortcuts & Combinations */}
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-cyan-100 border-b border-cyan-900/50 pb-2">Windi Shortcuts & Combinations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Custom Shortcuts</h4>
                  <div className="feature-card mb-4">
                    <div className="text-center mb-2">feature-card</div>
                  </div>
                  <div className="feature-card mb-4">
                    <h3 className="feature-title">feature-title</h3>
                    <p className="feature-description">feature-description: This is an example of the description text styling used in feature cards.</p>
                  </div>
                  <button className="cta-button block w-full mb-4">cta-button</button>
                  <div className="nav-link mb-2">nav-link</div>
                  <div className="nav-dropdown-link ml-4">nav-dropdown-link</div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold mb-4 text-cyan-200">Common Combinations</h4>
                  <div className="bg-slate-900/90 backdrop-blur-sm border-b border-cyan-900/30 p-4 mb-4 rounded">
                    Navigation bar background: bg-slate-900/90 backdrop-blur-sm border-b border-cyan-900/30
                  </div>
                  <div className="transform hover:scale-110 transition-transform p-4 bg-slate-800 mb-4 rounded text-center">
                    Hover over me! transform hover:scale-110 transition-transform
                  </div>
                  <div className="flex space-x-2 mb-4">
                    <div className="transition-colors hover:text-cyan-400 p-2 bg-slate-800 rounded">Hover</div>
                    <div className="transition-colors hover:text-cyan-400 p-2 bg-slate-800 rounded">For</div>
                    <div className="transition-colors hover:text-cyan-400 p-2 bg-slate-800 rounded">Color</div>
                    <div className="transition-colors hover:text-cyan-400 p-2 bg-slate-800 rounded">Change</div>
                  </div>
                  <div className="transition-all bg-slate-800 hover:bg-cyan-800 p-4 rounded text-center">
                    transition-all hover:bg-cyan-800
                  </div>
                </div>
              </div>
            </section>
            
            <div className="text-center">
              <button 
                onClick={toggleStyleGuide} 
                className="cta-button"
              >
                Close Style Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;