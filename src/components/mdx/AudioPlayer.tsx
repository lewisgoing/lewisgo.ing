import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface AudioPlayerProps {
  src: string;
  title: string;
  showWaveform?: boolean;
  accentColor?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  showWaveform = true,
  accentColor = '#4f46e5' // indigo-600
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4">
      <audio ref={audioRef} src={src} />
      
      <div className="flex items-center mb-2">
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white mr-3 focus:outline-none"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{ backgroundColor: accentColor }}
        >
          {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-1" />}
        </button>
        
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</div>
        </div>
      </div>
      
      <div 
        ref={progressRef}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full rounded-full transition-all duration-100"
          style={{ 
            width: `${(currentTime / duration) * 100 || 0}%`,
            backgroundColor: accentColor
          }} 
        />
      </div>
      
      {showWaveform && (
        <div className="mt-2 h-12 w-full flex items-center justify-between">
          {/* This is a simplified representation of a waveform */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="h-full w-1 mx-0.5 bg-gray-300 dark:bg-gray-600"
              style={{ 
                height: `${Math.random() * 100}%`,
                opacity: i / 40 <= currentTime / duration ? 1 : 0.5,
                backgroundColor: i / 40 <= currentTime / duration ? accentColor : undefined
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;