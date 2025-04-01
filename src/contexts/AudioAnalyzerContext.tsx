// src/context/AudioAnalyzerContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { audioContextManager } from './AudioContextManager';

type AudioAnalyzerContextType = {
  audioValue: number;
  connectAudioElement: (element: HTMLMediaElement) => void;
};

export const AudioAnalyzerContext = createContext<AudioAnalyzerContextType>({
  audioValue: 0,
  connectAudioElement: () => {},
});

export const AudioAnalyzerProvider = ({ children }: { children: ReactNode }) => {
  const [audioValue, setAudioValue] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  // Initialize AudioContext and AnalyserNode
  useEffect(() => {
    try {
      const audioContext = audioContextManager.getAudioContext();
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256; // Smaller FFT size for smoother updates
      setAnalyser(analyserNode);
      const bufferLength = analyserNode.frequencyBinCount;
      setDataArray(new Uint8Array(bufferLength));
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }, []);

  // Function to connect an audio element to the analyser
  const connectAudioElement = (element: HTMLMediaElement) => {
    if (!analyser) return;
    try {
      const sourceNode = audioContextManager.getSourceNodeForElement(element);
      sourceNode.connect(analyser);
      analyser.connect(audioContextManager.getAudioContext().destination);
    } catch (error) {
      console.error('Failed to connect audio element:', error);
    }
  };

  // Animation loop to update audio data
  useEffect(() => {
    if (!analyser || !dataArray) return;

    let animationFrameId: number;
    let lastUpdate = 0;
    const updateInterval = 1000 / 60; // Cap at 60 FPS

    const updateAudioData = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        setAudioValue(average / 255); // Normalize to 0-1
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateAudioData);
    };

    animationFrameId = requestAnimationFrame(updateAudioData);

    return () => cancelAnimationFrame(animationFrameId);
  }, [analyser, dataArray]);

  return (
    <AudioAnalyzerContext.Provider value={{ audioValue, connectAudioElement }}>
      {children}
    </AudioAnalyzerContext.Provider>
  );
};