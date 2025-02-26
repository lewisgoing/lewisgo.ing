'use client';

import React from 'react';

// Define prop types for better type safety and documentation
interface DummyShaderGradientProps {
  className?: string;
  // Add any other props you need for styling
}

/**
 * A placeholder component to use when ShaderGradient can't be loaded
 * This helps prevent errors during server-side rendering
 */
const DummyShaderGradient: React.FC<DummyShaderGradientProps> = ({ className }) => {
  return (
    <div 
      className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 animate-gradient`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '12px',
      }}
    />
  );
};

export default DummyShaderGradient;