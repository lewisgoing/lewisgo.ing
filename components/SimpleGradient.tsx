'use client';

import React from 'react';

// Props interface for the shader gradient replacement
interface SimpleGradientProps {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  type?: "sphere" | "plane";
  animate?: string;
}

/**
 * A simple CSS gradient component that replaces the ShaderGradient component
 * to avoid React Three Fiber errors in the App Router
 */
export default function SimpleGradient({ 
  className = '',
  color1 = '#FF0006',
  color2 = '#003FFF', 
  color3 = '#4AA6FF',
  type = 'sphere',
  animate = 'on'
}: SimpleGradientProps) {
  // Generate a random animation duration between 15-25s for variety
  const animDuration = React.useMemo(() => 
    Math.floor(15 + Math.random() * 10), []);
    
  // Use different gradients based on the type prop
  const gradientStyle = type === 'sphere' 
    ? {
        background: `radial-gradient(circle, ${color1}, ${color2}, ${color3})`,
        animation: animate === 'on' ? `pulse ${animDuration}s infinite alternate` : 'none',
      }
    : {
        background: `linear-gradient(45deg, ${color1}, ${color2}, ${color3})`,
        backgroundSize: '200% 200%',
        animation: animate === 'on' ? `gradient ${animDuration}s ease infinite` : 'none',
      };
      
  return (
    <div 
      className={`${className} rounded-3xl overflow-hidden`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...gradientStyle
      }}
    >
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}