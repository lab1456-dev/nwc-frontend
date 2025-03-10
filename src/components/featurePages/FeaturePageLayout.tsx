import React from 'react';

// Export the type so it can be imported by other files
export type RoadmapStage = 'MVP' | '2026' | '2027' | 'MVP,2026' | 'MVP,2027' | '2026,2027' | 'MVP,2026,2027';

interface FeaturePageLayoutProps {
  title: string;
  icon?: React.ReactNode;
  roadmapStage: RoadmapStage;
  description: string;
  bulletPoints?: string[];
  additionalContent?: string;
}

// Export the component itself
const FeaturePageLayout: React.FC<FeaturePageLayoutProps> = ({
  title,
  icon,
  roadmapStage,
  description,
  bulletPoints,
  additionalContent
}) => {
  // Helper to determine which stage badges to show
  const stages = roadmapStage.split(',');
  const hasMVP = stages.includes('MVP');
  const has2026 = stages.includes('2026');
  const has2027 = stages.includes('2027');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 text-gray-100 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          {/* Icon display */}
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}
        
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
            {title}
          </h1>
          <div className="text-xl md:text-2xl flex justify-center items-center space-x-2">
            <span className="text-cyan-200">Roadmap:</span>
            {hasMVP && <span className="text-emerald-400">MVP</span>}
            {has2026 && <span className="text-yellow-400">2026</span>}
            {has2027 && <span className="text-red-400">2027</span>}
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-8 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <p className="text-left">
            {description}
            
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-cyan-200/80 pl-8 my-4">
                {bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
            
            {additionalContent && (
              <>
                {additionalContent}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// Named export for the component as well
export { FeaturePageLayout };

// Default export
export default FeaturePageLayout;