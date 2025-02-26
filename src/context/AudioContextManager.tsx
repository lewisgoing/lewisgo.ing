// src/context/AudioPlayerContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Define types for song data
interface Song {
  title: string;
  artist: string;
  albumCoverUrl: string;
  audioSrc: string;
  audioLink?: string;
  preload?: "none" | "metadata" | "auto";
}

// Define the context shape
interface AudioContextType {
  // State
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  volume: number;
  
  // Methods
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  playTrack: (songIndex: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

// Create the context with default values
const AudioPlayerContext = createContext<AudioContextType | undefined>(undefined);

// Define songs data
const songsData: Song[] = [
  {
    title: "Closer",
    artist: "lewisgoing & Avi8",
    albumCoverUrl: "/albumart/closer.jpg",
    audioSrc: "./audio/closer.mp3",
    audioLink: "https://soundcloud.com/lewisgoing/closer",
    preload: "auto",
  },
  {
    title: "Winter '22 Samples",
    artist: "lewisgoing",
    albumCoverUrl: "/albumart/winter22.jpeg",
    audioSrc: "./audio/winter22.mp3",
    audioLink: "https://soundcloud.com/lewisgoing/winter22",
    preload: "metadata", 
  },
  // Add the rest of your songs here
];

// Create a provider component
export const AudioPlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedSongsRef = useRef<Set<number>>(new Set([0]));
  
  // Get current song
  const currentSong = songsData[currentTrackIndex];
  
  // Initialize audio
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = currentSong.preload || "metadata";
      audioRef.current = audio;
      audio.volume = volume;
      
      // Only set the source once the component is mounted
      audio.src = currentSong.audioSrc;
      audio.load();
    }
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Preload next track
  const preloadNextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % songsData.length;
    if (!loadedSongsRef.current.has(nextIndex)) {
      const preloadAudio = new Audio();
      preloadAudio.src = songsData[nextIndex].audioSrc;
      preloadAudio.preload = "metadata";
      preloadAudio.load();
      
      // Mark as loaded
      loadedSongsRef.current.add(nextIndex);
      
      // Remove the audio element reference once loaded
      preloadAudio.onloadedmetadata = () => {
        preloadAudio.onloadedmetadata = null;
      };
    }
  }, [currentTrackIndex]);
  
  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Event handlers
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      nextTrack();
    };
    
    const handleWaiting = () => {
      setIsLoading(true);
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    
    // Add event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    
    // Load new source if track changes
    if (audio.src !== new URL(songsData[currentTrackIndex].audioSrc, window.location.href).href) {
      setIsLoading(true);
      audio.src = songsData[currentTrackIndex].audioSrc;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
      
      // Preload the next track
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => preloadNextTrack());
        } else {
          setTimeout(preloadNextTrack, 1000);
        }
      }
    }
    
    // Cleanup
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentTrackIndex, isPlaying, preloadNextTrack]);
  
  // Play/pause controls
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, []);
  
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);
  
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);
  
  // Volume control
  const setVolumeLevel = useCallback((value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, value));
      setVolume(value);
    }
  }, []);
  
  // Seek control
  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && isFinite(time)) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
    }
  }, []);
  
  // Track navigation
  const playTrack = useCallback((index: number) => {
    if (index >= 0 && index < songsData.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  }, []);
  
  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % songsData.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);
  
  const previousTrack = useCallback(() => {
    const prevIndex = currentTrackIndex - 1 < 0 ? songsData.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);
  
  // Create context value
  const contextValue: AudioContextType = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    volume,
    play,
    pause,
    togglePlay,
    setVolume: setVolumeLevel,
    seekTo,
    playTrack,
    nextTrack,
    previousTrack
  };
  
  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

// Create a hook to use the context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};