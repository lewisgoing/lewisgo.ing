'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import DummyShaderGradient from './boxes/DummyShaderGradient';

// Dynamically import ShaderGradientBox with no SSR 
const ShaderGradientBox = dynamic(() => import('./boxes/ShaderGradientBox'), { 
  ssr: false,
  loading: () => <DummyShaderGradient />
});

// Props interface for the shader gradient
interface ShaderGradientProps {
  className: string;
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
  type?: "sphere" | "plane";
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

export default function ShaderGradientClientWrapper(props: ShaderGradientProps) {
  // Only render the 3D component after client-side hydration is complete
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DummyShaderGradient className={props.className} />;
  }

  return <ShaderGradientBox {...props} />;
}