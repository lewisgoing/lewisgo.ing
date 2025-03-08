// components/boxes/SpotifyBox.tsx
'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa";
import ExternalLink from "../assets/ExternalLink";
import { Skeleton } from "../shadcn/skeleton";

// Define TypeScript interfaces
interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id: string;
  timestamps?: {
    start: number;
    end: number;
  };
}

// This matches what useLanyard() returns
interface LanyardSWRResponse {
  data?: {
    success: boolean;
    data: {
      listening_to_spotify: boolean;
      spotify?: SpotifyData | null;
      kv?: {
        spotify_last_played?: string;
      };
      [key: string]: any;
    };
  };
  error?: Error;
  isValidating: boolean;
  mutate: () => void;
}

interface SpotifyBoxProps {
  lanyard: LanyardSWRResponse;
  onLoad?: () => void;
}

// Combined state interface
interface SpotifyBoxState {
  isHovered: boolean;
  spotifyData: SpotifyData | null;
  isLoading: boolean;
  isCurrentlyPlaying: boolean;
  debugInfo: string[];
}

const SpotifyBox: React.FC<SpotifyBoxProps> = ({ lanyard, onLoad }) => {
  // Combined state for better management
  const [state, setState] = useState<SpotifyBoxState>({
    isHovered: false,
    spotifyData: null,
    isLoading: true,
    isCurrentlyPlaying: false,
    debugInfo: []
  });
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived styles based on hover state
  const imageStyle = state.isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: "color 0.3s ease",
    color: state.isHovered ? "#1db954" : "#e5d3b8",
  };

  // Helper functions for state updates
  const addDebug = (message: string): void => {
    setState(prev => ({
      ...prev,
      debugInfo: [...prev.debugInfo, message]
    }));
  };

  const setSpotifyData = (data: SpotifyData | null, isPlaying: boolean = false): void => {
    setState(prev => ({
      ...prev,
      spotifyData: data,
      isCurrentlyPlaying: isPlaying,
      isLoading: false
    }));
  };

  // Update the KV store with track data
  const updateKVStore = async (trackData: SpotifyData): Promise<boolean> => {
    try {
      addDebug(`Updating KV store with track: ${trackData.song}`);
      
      const response = await fetch('/api/spotify/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update KV store');
      }
      
      addDebug('KV store updated successfully');
      return true;
    } catch (error: any) {
      addDebug(`Error updating KV store: ${error.message}`);
      return false;
    }
  };

  // Fetch Spotify data from API
  const fetchSpotifyData = async (): Promise<boolean> => {
    try {
      addDebug('Fetching Spotify data from API');
      
      const response = await fetch('/api/spotify/data');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if user is currently listening to Spotify
      if (data.listeningToSpotify && data.spotify) {
        addDebug('User is currently listening to Spotify');
        setSpotifyData(data.spotify, true);
        
        // Update KV store with current track
        updateKVStore(data.spotify);
        return true;
      }
      
      // Otherwise, use last played from KV
      if (data.lastPlayedFromKV) {
        addDebug('Using last played track from KV store');
        setSpotifyData(data.lastPlayedFromKV, false);
        return true;
      }
      
      addDebug('No Spotify data available from API');
      return false;
    } catch (error: any) {
      addDebug(`Error fetching data: ${error.message}`);
      return false;
    }
  };

  // Process Lanyard data only when it changes
  useEffect(() => {
    // Early return if no lanyard data is available
    if (!lanyard.data || !lanyard.data.data) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const lanyardData = lanyard.data.data;
    
    const processLanyardData = async () => {
      try {
        // Check if the user is currently listening to Spotify
        if (lanyardData.listening_to_spotify && lanyardData.spotify) {
          addDebug('User is currently listening to Spotify via Lanyard');
          setSpotifyData(lanyardData.spotify, true);
          
          // Update KV store with current track
          await updateKVStore(lanyardData.spotify);
          
          if (onLoad) onLoad();
          return;
        }

        // If not currently playing, try API endpoint
        const success = await fetchSpotifyData();
        
        if (!success) {
          // If API fails, try to get the last played track from KV store
          if (lanyardData.kv?.spotify_last_played) {
            addDebug('Found last played in Lanyard KV prop');
            try {
              const kvData = JSON.parse(lanyardData.kv.spotify_last_played);
              setSpotifyData(kvData, false);
              
              if (onLoad) onLoad();
            } catch (parseErr: any) {
              addDebug(`Error parsing KV data: ${parseErr.message}`);
              setState(prev => ({ ...prev, isLoading: false }));
            }
          } else {
            addDebug('No Spotify data available');
            setState(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error: any) {
        addDebug(`Error processing Lanyard data: ${error.message}`);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    processLanyardData();
    
    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [lanyard, onLoad]);

  // Mouse event handlers
  const handleMouseEnter = () => setState(prev => ({ ...prev, isHovered: true }));
  const handleMouseLeave = () => setState(prev => ({ ...prev, isHovered: false }));

  // Loading state - show skeleton
  if (state.isLoading) {
    return <Skeleton className="w-full h-full rounded-3xl" />;
  }
  
  // If no data is available - empty state
  if (!state.spotifyData) {
    return (
      <div className="h-full w-full opacity-0">
        {process.env.NODE_ENV === 'development' && (
          <details className="fixed bottom-2 right-2 text-xs text-gray-500 z-10">
            <summary>Debug info</summary>
            <pre className="whitespace-pre-wrap text-xs">
              {state.debugInfo.join('\n')}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // Extract track data for readability
  const { song, artist, album, album_art_url, track_id } = state.spotifyData;

  return (
    <>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="transition-all duration-500 ease-in-out opacity-100"
      >
        {/* Desktop Layout */}
        <div className="flex bento-md:hidden z-[1] bento-lg:flex h-full w-full flex-col justify-between p-6">
          <Image
            src={album_art_url}
            alt="Album art"
            width={0}
            height={0}
            className="mb-2 w-[55%] rounded-xl border border-border grayscale"
            unoptimized
            style={imageStyle}
          />
          <div className="flex flex-col">
            <span className="mb-2 flex gap-2">
              <Image
                src="/svg/bento-now-playing.svg"
                alt="Now playing"
                width={16}
                height={16}
                style={iconStyle}
              />
              {state.isCurrentlyPlaying ? (
                <span className="text-sm">Now playing...</span>
              ) : (
                <span className="text-sm">Last played...</span>
              )}
            </span>
            <span className="text-md mb-2 line-clamp-2 font-bold leading-none">
              {song}
            </span>
            <span className="line-clamp-1 w-[85%] text-xs text-muted-foreground">
              <span className="text-secondary-foreground font-semibold">
                by
              </span>{" "}
              {artist}
            </span>
            <span className="line-clamp-1 w-[85%] text-xs text-muted-foreground">
              <span className="text-secondary-foreground font-semibold">
                on
              </span>{" "}
              {album}
            </span>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden bento-md:flex z-[1] bento-lg:hidden h-full w-full px-4 items-center gap-4">
          <Image
            src={album_art_url}
            alt="Album art"
            width={0}
            height={0}
            className="w-32 rounded-xl border border-border grayscale"
            unoptimized
            style={imageStyle}
          />
          <div className="flex flex-col w-[42%]">
            <span className="mb-2 flex gap-2">
              <Image
                src="/svg/bento-now-playing.svg"
                alt="Now playing"
                width={16}
                height={16}
                style={iconStyle}
              />
              {state.isCurrentlyPlaying ? (
                <span className="text-sm text-primary">Now playing...</span>
              ) : (
                <span className="text-sm text-primary">Last played...</span>
              )}
            </span>
            <span className="text-md mb-2 line-clamp-3 font-bold leading-none">
              {song}
            </span>
            <span className="line-clamp-2 w-[85%] text-xs text-muted-foreground">
              <span className="text-secondary-foreground font-semibold">
                by
              </span>{" "}
              {artist}
            </span>
            <span className="line-clamp-2 w-[85%] text-xs text-muted-foreground">
              <span className="text-secondary-foreground font-semibold">
                on
              </span>{" "}
              {album}
            </span>
          </div>
        </div>

        {/* Spotify logo */}
        <div className="absolute right-0 top-0 z-[1] m-3 text-primary">
          <FaSpotify size={56} style={iconStyle} />
        </div>

        {/* External link to track */}
        {track_id && (
          <ExternalLink
            href={`https://open.spotify.com/track/${track_id}`}
            className="z-[1] block"
          />
        )}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="fixed bottom-2 right-2 text-xs text-gray-500 z-10">
          <summary>Debug info</summary>
          <pre className="whitespace-pre-wrap text-xs">
            {state.debugInfo.join('\n')}
          </pre>
        </details>
      )}
    </>
  );
};

export default SpotifyBox;