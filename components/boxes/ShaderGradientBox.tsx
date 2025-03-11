'use client';

import React, { memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Use specific imports that are available in the exports field
const ShaderGradientCanvas = dynamic(
  () => import('shadergradient/canvas').then(mod => mod.ShaderGradientCanvas),
  { ssr: false }
);

const ShaderGradient = dynamic(
  () => import('shadergradient/gradient').then(mod => mod.ShaderGradient),
  { ssr: false }
);

// Also dynamically import Three.js libraries
const ReactSpringThree = dynamic(() => import('@react-spring/three'), { ssr: false });
const Drei = dynamic(() => import('@react-three/drei'), { ssr: false });
const Fiber = dynamic(() => import('@react-three/fiber'), { ssr: false });

// Define prop types for better type safety and documentation
interface ShaderGradientBoxProps {
  className?: string;
  animate?: string;
  control?: string;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  wireframe?: boolean;
  shader?: string;
  type?: 'sphere' | 'plane';
  uAmplitude?: number;
  uDensity?: number;
  uFrequency?: number;
  uSpeed?: number;
  uStrength?: number;
  cDistance?: number;
  cameraZoom?: number;
  cAzimuthAngle?: number;
  cPolarAngle?: number;
  uTime?: number;
  lightType?: string;
  envPreset?: string;
  reflection?: number;
  brightness?: number;
  grain?: string;
  toggleAxis?: boolean;
  hoverState?: string;
}

const ShaderGradientBox: React.FC<ShaderGradientBoxProps> = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [libraries, setLibraries] = useState<any>(null);

  // Load libraries
  useEffect(() => {
    Promise.all([
      ReactSpringThree,
      Drei,
      Fiber
    ]).then(([reactSpring, drei, fiber]) => {
      setLibraries({
        ...reactSpring,
        ...drei,
        ...fiber
      });
      setLoaded(true);
    }).catch(error => {
      console.error("Error loading Three.js libraries:", error);
      // Still set loaded to true to show fallback
      setLoaded(true);
    });
  }, []);

  // Canvas styles - fixed and consistent
  const canvasStyle = {
    position: 'absolute' as const,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    pointerEvents: 'none' as const,
  };

  if (!loaded || !libraries) {
    return (
      <div className={props.className || ''} style={{ 
        background: 'linear-gradient(45deg, #FF0006, #003FFF)',
        borderRadius: '12px',
        width: '100%',
        height: '100%'
      }}>
        {/* Gradient placeholder while loading */}
      </div>
    );
  }

  try {
    return (
      <ShaderGradientCanvas
        importedfiber={libraries}
        className={props.className}
        style={canvasStyle}
      >
        <ShaderGradient
          animate={props.animate || 'on'}
          control={props.control || 'props'}
          positionX={props.positionX}
          positionY={props.positionY}
          positionZ={props.positionZ}
          rotationX={props.rotationX}
          rotationY={props.rotationY}
          rotationZ={props.rotationZ}
          color1={props.color1}
          color2={props.color2}
          color3={props.color3}
          wireframe={props.wireframe}
          shader={props.shader}
          type={props.type}
          uAmplitude={props.uAmplitude}
          uDensity={props.uDensity}
          uFrequency={props.uFrequency}
          uSpeed={props.uSpeed}
          uStrength={props.uStrength}
          cDistance={props.cDistance}
          cameraZoom={props.cameraZoom}
          cAzimuthAngle={props.cAzimuthAngle}
          cPolarAngle={props.cPolarAngle}
          uTime={props.uTime}
          lightType={props.lightType || '3d'}
          envPreset={props.envPreset || 'dawn'}
          reflection={props.reflection}
          brightness={props.brightness}
          grain={props.grain || 'off'}
          toggleAxis={props.toggleAxis}
          hoverState={props.hoverState || 'off'}
        />
      </ShaderGradientCanvas>
    );
  } catch (error) {
    console.error("Error rendering ShaderGradient:", error);
    // Fallback in case of render error
    return (
      <div className={props.className || ''} style={{ 
        background: 'linear-gradient(45deg, #FF0006, #003FFF)',
        borderRadius: '12px',
        width: '100%',
        height: '100%'
      }}>
        {/* Error fallback */}
      </div>
    );
  }
};

// Use memo to prevent unnecessary re-renders when props don't change
export default memo(ShaderGradientBox);