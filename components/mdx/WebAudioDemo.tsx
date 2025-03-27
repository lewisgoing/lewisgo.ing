import React, { useState, useEffect, useRef } from 'react';

interface WebAudioDemoProps {
  title?: string;
  description?: string;
}

const WebAudioDemo: React.FC<WebAudioDemoProps> = ({
  title = 'Web Audio Demo',
  description,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  const [volume, setVolume] = useState(0.5);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  useEffect(() => {
    // Initialize AudioContext on component mount
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      return () => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      };
    }
  }, []);
  
  const startOscillator = () => {
    if (!audioContextRef.current) return;
    
    // Create an oscillator
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = waveform;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };
  
  const stopOscillator = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
      setIsPlaying(false);
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      stopOscillator();
    } else {
      startOscillator();
    }
  };
  
  useEffect(() => {
    if (isPlaying) {
      // Update frequency if already playing
      if (oscillatorRef.current) {
        oscillatorRef.current.frequency.value = frequency;
      }
    }
  }, [frequency, isPlaying]);
  
  useEffect(() => {
    if (isPlaying) {
      // For waveform change, restart the oscillator
      stopOscillator();
      startOscillator();
    }
  }, [waveform, isPlaying]);
  
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{description}</p>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="waveform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Waveform
          </label>
          <div className="flex gap-2">
            {(['sine', 'square', 'sawtooth', 'triangle'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setWaveform(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  waveform === type 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequency: {frequency} Hz
          </label>
          <input
            type="range"
            id="frequency"
            min="20"
            max="2000"
            step="1"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
    </div>
  );
};


export default WebAudioDemo;