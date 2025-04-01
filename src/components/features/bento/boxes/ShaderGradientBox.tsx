// components/boxes/ShaderGradientBox.tsx
import React, { memo } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

// Define prop types based on documentation
type MeshT = {
  type?: 'plane' | 'sphere' | 'waterPlane'
  animate?: 'on' | 'off'
  uTime?: number
  uSpeed?: number
  uStrength?: number
  uDensity?: number
  uFrequency?: number
  // renamed to Sprial on Framer & shadergradient.co
  uAmplitude?: number
  positionX?: number
  positionY?: number
  positionZ?: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  color1?: string
  color2?: string
  color3?: string
  reflection?: number
  wireframe?: boolean
  shader?: string
  rotSpringOption?: any
  posSpringOption?: any
}

export type GradientT = MeshT & {
  control?: 'query' | 'props'
  isFigmaPlugin?: boolean
  dampingFactor?: number

  // View (camera) props
  cAzimuthAngle?: number
  cPolarAngle?: number
  // for both plane and waterPlane type
  cDistance?: number
  // only for sphere type
  cameraZoom?: number

  // Effect props
  lightType?: '3d' | 'env'
  brightness?: number
  envPreset?: 'city' | 'dawn' | 'lobby'
  grain?: 'on' | 'off'
  grainBlending?: number

  // Tool props
  zoomOut?: boolean
  toggleAxis?: boolean
  hoverState?: string

  enableTransition?: boolean
}

// Our component props extend GradientT with className
interface ShaderGradientBoxProps extends GradientT {
  className?: string;
}

const ShaderGradientBox: React.FC<ShaderGradientBoxProps> = (props) => {
  const {
    className,
    animate = 'on',
    control = 'props',
    positionX,
    positionY,
    positionZ,
    rotationX,
    rotationY,
    rotationZ,
    color1,
    color2,
    color3,
    wireframe,
    shader,
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
    lightType = '3d',
    envPreset = 'dawn',
    reflection,
    brightness,
    grain = 'off',
    toggleAxis,
    hoverState,
    // Additional props from documentation
    dampingFactor,
    grainBlending,
    zoomOut,
    enableTransition,
    isFigmaPlugin,
    rotSpringOption,
    posSpringOption
  } = props;

  // Canvas styles - fixed and consistent
  const canvasStyle = {
    position: 'absolute' as const,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    pointerEvents: 'none' as const,
  };

  return (
    <ShaderGradientCanvas
      // importedfiber={{ ...fiber, ...drei, ...reactSpring }}
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
        // dampingFactor={dampingFactor}
        grainBlending={grainBlending}
        zoomOut={zoomOut}
        enableTransition={enableTransition}
        isFigmaPlugin={isFigmaPlugin}
        rotSpringOption={rotSpringOption}
        posSpringOption={posSpringOption}
      />
    </ShaderGradientCanvas>
  );
};

// Use memo to prevent unnecessary re-renders when props don't change
export default memo(ShaderGradientBox);