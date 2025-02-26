// components/boxes/ShaderGradientBox.tsx
import React, { memo } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

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
  type?: string;
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
  const {
    className,
    animate = "on",
    control = "props",
    positionX = 0,
    positionY = 0,
    positionZ = 0,
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
    color1,
    color2,
    color3,
    wireframe = false,
    shader = "defaults",
    type,
    uAmplitude,
    uDensity,
    uFrequency,
    uSpeed,
    uStrength,
    cDistance,
    cameraZoom,
    cAzimuthAngle,
    cPolarAngle,
    uTime,
    lightType,
    envPreset,
    reflection,
    brightness,
    grain = "off",
    toggleAxis = false,
    hoverState = "off"
  } = props;

  // Canvas styles - fixed and consistent
  const canvasStyle = {
    position: 'absolute' as const,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    pointerEvents: "none" as const,
  };
  
  return (
    <ShaderGradientCanvas
      importedFiber={{ ...fiber, ...drei, ...reactSpring }}
      className={className}
      style={canvasStyle}
    >
      <ShaderGradient
        animate={animate}
        control={control}
        positionX={positionX}
        positionY={positionY}
        positionZ={positionZ}
        rotationX={rotationX}
        rotationY={rotationY}
        rotationZ={rotationZ}
        color1={color1}
        color2={color2}
        color3={color3}
        wireframe={wireframe}
        shader={shader}
        type={type}
        uAmplitude={uAmplitude}
        uDensity={uDensity}
        uFrequency={uFrequency}
        uSpeed={uSpeed}
        uStrength={uStrength}
        cDistance={cDistance}
        cameraZoom={cameraZoom}
        cAzimuthAngle={cAzimuthAngle}
        cPolarAngle={cPolarAngle}
        uTime={uTime}
        lightType={lightType}
        envPreset={envPreset}
        reflection={reflection}
        brightness={brightness}
        grain={grain}
        toggleAxis={toggleAxis}
        hoverState={hoverState}
      />
    </ShaderGradientCanvas>
  );
};

// Use memo to prevent unnecessary re-renders when props don't change
export default memo(ShaderGradientBox);