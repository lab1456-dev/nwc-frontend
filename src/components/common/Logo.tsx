import { useState } from 'react';

const Crow = ({ 
  className = '',
  width = 'w-64',  // default width
  height = 'h-48',  // default height
  rounded = true,
  shadow = true,
  hover = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Combine all the classes based on props
  const imageClasses = `
    ${width} 
    ${height} 
    object-cover
    ${rounded ? 'rounded-lg' : ''} 
    ${shadow ? 'shadow-lg' : ''} 
    ${hover ? 'hover:scale-200 transition-transform duration-300' : ''}
    ${className}
  `.trim();

  return (
    <div className={`relative ${width} ${height}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <span className="text-gray-500">Failed to load image</span>
        </div>
      ) : (
        <img
          src="crow.png"
          alt="Night's Watch Crow Logo"
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default Crow;