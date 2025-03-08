// components/boxes/SpotifyBox.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
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
      listening_to_spotify?: boolean;
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
}

const SpotifyBox: React.FC<SpotifyBoxProps> = ({ lanyard, onLoad }) => {
  // State for component
  const [state, setState] = useState<SpotifyBoxState>({
    isHovered: false,
    spotifyData: null,
    isLoading: true,
    isCurrentlyPlaying: false
  });
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const kvUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived styles based on hover state
  const imageStyle = state.isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: "color 0.3s ease",
    color: state.isHovered ? "#1db954" : "#e5d3b8",
  };

  const setSpotifyData = useCallback((data: SpotifyData | null, isPlaying: boolean = false): void => {
    setState(prev => ({
      ...prev,
      spotifyData: data,
      isCurrentlyPlaying: isPlaying,
      isLoading: false
    }));
  }, []);

  // Update the KV store with track data
  const updateKVStore = useCallback(async (trackData: SpotifyData): Promise<boolean> => {
    if (!trackData || !trackData.track_id) {
      return false;
    }
    
    try {
      const response = await fetch('/api/spotify/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackData)
      });
      
      return response.ok;
    } catch (error) {
      console.error("Error updating KV store:", error);
      return false;
    }
  }, []);

  // Fetch Spotify data from API - more resilient implementation
  const fetchSpotifyData = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/spotify/data');
      
      if (!response.ok) {
        console.error("API response not OK:", response.status);
        return false;
      }
      
      const data = await response.json();
      
      // Check if user is currently listening to Spotify
      if (data && data.listeningToSpotify && data.spotify) {
        // Validate the data structure
        if (!validateSpotifyData(data.spotify)) {
          console.error("Invalid Spotify data structure from API");
          return false;
        }
        
        setSpotifyData(data.spotify, true);
        return true;
      }
      
      // Otherwise, use last played from KV
      if (data && data.lastPlayedFromKV) {
        // Validate the data structure
        if (!validateSpotifyData(data.lastPlayedFromKV)) {
          console.error("Invalid lastPlayedFromKV data structure from API");
          return false;
        }
        
        setSpotifyData(data.lastPlayedFromKV, false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      return false;
    }
  }, [setSpotifyData]);

  // Helper function to validate SpotifyData structure
  const validateSpotifyData = (data: any): data is SpotifyData => {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.song === 'string' &&
      typeof data.artist === 'string' &&
      typeof data.album === 'string' &&
      typeof data.album_art_url === 'string' &&
      typeof data.track_id === 'string'
    );
  };

  // Primary data loading effect - triggers on lanyard changes
  useEffect(() => {
    const loadData = async () => {
      try {
        // First, try to get data from lanyard directly if it's available
        if (lanyard.data?.data?.listening_to_spotify && lanyard.data.data.spotify) {
          const spotifyData = lanyard.data.data.spotify;
          
          if (validateSpotifyData(spotifyData)) {
            setSpotifyData(spotifyData, true);
            await updateKVStore(spotifyData);
            if (onLoad) onLoad();
            return;
          }
        }
        
        // Next, try the API as a fallback
        const success = await fetchSpotifyData();
        
        if (success) {
          if (onLoad) onLoad();
          return;
        }
        
        // If API fails, try KV store from lanyard directly
        if (lanyard.data?.data?.kv?.spotify_last_played) {
          try {
            const kvDataRaw = lanyard.data.data.kv.spotify_last_played;
            const kvData = typeof kvDataRaw === 'string' ? JSON.parse(kvDataRaw) : kvDataRaw;
            
            if (validateSpotifyData(kvData)) {
              setSpotifyData(kvData, false);
              if (onLoad) onLoad();
              return;
            }
          } catch (parseErr) {
            console.error("Error parsing KV data:", parseErr);
          }
        }
        
        // If everything fails, set loading to false
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error("Error in loadData:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    loadData();
    
    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (kvUpdateTimeoutRef.current) clearTimeout(kvUpdateTimeoutRef.current);
    };
  }, [lanyard.data, onLoad, setSpotifyData, updateKVStore, fetchSpotifyData]);

  // Watch for changes in listening status to update KV store
  useEffect(() => {
    if (!lanyard.data?.data) return;
    
    // This ensure we don't try to access potentially undefined properties
    const listeningToSpotify = !!lanyard.data.data.listening_to_spotify;
    const spotifyData = lanyard.data.data.spotify;
    
    if (listeningToSpotify && spotifyData && validateSpotifyData(spotifyData)) {
      // Debounce updates with timeout
      if (kvUpdateTimeoutRef.current) {
        clearTimeout(kvUpdateTimeoutRef.current);
      }
      
      kvUpdateTimeoutRef.current = setTimeout(() => {
        updateKVStore(spotifyData);
        setSpotifyData(spotifyData, true);
      }, 1000);
    }
  }, [lanyard.data?.data, setSpotifyData, updateKVStore]);

  // Call onLoad callback when data is available
  useEffect(() => {
    if (state.spotifyData && onLoad) {
      onLoad();
    }
  }, [state.spotifyData, onLoad]);

  // Mouse event handlers
  const handleMouseEnter = () => setState(prev => ({ ...prev, isHovered: true }));
  const handleMouseLeave = () => setState(prev => ({ ...prev, isHovered: false }));

  // Loading state - show skeleton
  if (state.isLoading) {
    return <Skeleton className="w-full h-full rounded-3xl" />;
  }
  
  // If no data is available - empty state
  if (!state.spotifyData) {
    return <div className="h-full w-full opacity-0"></div>;
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
    </>
  );
};

export default SpotifyBox;