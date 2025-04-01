// components/boxes/ReactiveGradientBox.tsx
import { useContext } from 'react';
import { AudioAnalyzerContext } from '@/contexts/AudioAnalyzerContext';
import ShaderGradientBox, { GradientT } from '@/components/features/bento/boxes/ShaderGradientBox';

const ReactiveGradientBox = (props: GradientT) => {
  const { audioValue } = useContext(AudioAnalyzerContext);

  // Dynamic prop adjustments based on audio
  const dynamicStrength = props.uStrength
    ? props.uStrength + audioValue * 2 // Base strength + audio-driven boost
    : 1 + audioValue * 2; // Default if not provided

  const dynamicFrequency = props.uFrequency
    ? props.uFrequency + audioValue * 1.5
    : 1 + audioValue * 1.5;

  return (
    <ShaderGradientBox
      {...props}
      uStrength={dynamicStrength}
      uFrequency={dynamicFrequency}
      // Add more dynamic props as needed, e.g., uAmplitude, color adjustments
    />
  );
};

export default ReactiveGradientBox;