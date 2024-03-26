import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

const ShaderGradientBox = ({ className, animate, control, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, color1, color2, color3, wireframe, shader, type, uAmplitude, uDensity, uFrequency, uSpeed, uStrength, cDistance, cameraZoom, cAzimuthAngle, cPolarAngle, uTime, lightType, envPreset, reflection, brightness, grain, toggleAxis, hoverState }) => {
  return (
    <ShaderGradientCanvas
      importedFiber={{ ...fiber, ...drei, ...reactSpring }}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        borderRadius: '12px', // Adjust as needed
        pointerEvents: "none",
      }}
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

export default ShaderGradientBox;
