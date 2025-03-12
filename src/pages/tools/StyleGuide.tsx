import React from 'react';

interface StyleGuideProps {
}

const StyleGuide: React.FC<StyleGuideProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-16 px-4 fixed inset-0 z-40 overflow-auto">
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
      </div>
    </div>
  );
};

export default StyleGuide;