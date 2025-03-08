// components/boxes/SpotifyBox.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa";
import ExternalLink from "../assets/ExternalLink";
import { Skeleton } from "../shadcn/skeleton";

// Define TypeScript interfaces with proper typing
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
  _updated_at?: number;
}

interface LanyardData {
  listening_to_spotify?: boolean;
  spotify?: SpotifyData | null;
  kv?: {
    spotify_last_played?: string;
  };
  [key: string]: any;
}

interface LanyardSWRResponse {
  data?: {
    success: boolean;
    data: LanyardData;
  };
  error?: Error;
  isValidating: boolean;
  mutate: () => void;
}

interface SpotifyBoxProps {
  lanyard: LanyardSWRResponse;
  onLoad?: () => void;
}

interface SpotifyBoxState {
  isHovered: boolean;
  spotifyData: SpotifyData | null;
  isLoading: boolean;
  isCurrentlyPlaying: boolean;
  lastUpdate: number;
}

const SpotifyBox: React.FC<SpotifyBoxProps> = ({ lanyard, onLoad }) => {
  // Use a more comprehensive state
  const [state, setState] = useState<SpotifyBoxState>({
    isHovered: false,
    spotifyData: null,
    isLoading: true,
    isCurrentlyPlaying: false,
    lastUpdate: 0
  });
  
  // References for timeouts
  const timeouts = useRef<{
    kvUpdate: NodeJS.Timeout | null;
    loading: NodeJS.Timeout | null;
    retry: NodeJS.Timeout | null;
  }>({
    kvUpdate: null,
    loading: null,
    retry: null
  });
  
  // Keep track of API requests to prevent race conditions
  const pendingRequests = useRef<{
    kvUpdate: boolean;
    dataFetch: boolean;
  }>({
    kvUpdate: false,
    dataFetch: false
  });

  // Derived styles based on hover state
  const imageStyle = state.isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: "color 0.3s ease",
    color: state.isHovered ? "#1db954" : "#e5d3b8",
  };

  // Update the component state with Spotify data
  const setSpotifyData = useCallback((data: SpotifyData | null, isPlaying: boolean = false): void => {
    setState(prev => {
      // If we already have newer data, don't update
      if (data && prev.spotifyData && 
          data._updated_at && prev.spotifyData._updated_at && 
          data._updated_at < prev.spotifyData._updated_at) {
        return prev;
      }
      
      return {
        ...prev,
        spotifyData: data,
        isCurrentlyPlaying: isPlaying,
        isLoading: false,
        lastUpdate: Date.now()
      };
    });
    
    // Trigger onLoad if we have data
    if (data && onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Update KV store with robust error handling
  const updateKVStore = useCallback(async (trackData: SpotifyData): Promise<boolean> => {
    if (pendingRequests.current.kvUpdate) {
      return false; // Don't allow concurrent updates
    }
    
    // Add timestamp for versioning
    const dataToSend = { 
      ...trackData,
      _updated_at: Date.now()
    };
    
    try {
      pendingRequests.current.kvUpdate = true;
      
      const response = await fetch('/api/spotify/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error("[SpotifyBox] KV update error:", error);
      return false;
    } finally {
      pendingRequests.current.kvUpdate = false;
    }
  }, []);

  // Fetch data from API with proper error handling
  const fetchSpotifyData = useCallback(async (): Promise<boolean> => {
    if (pendingRequests.current.dataFetch) {
      return false; // Don't allow concurrent fetches
    }
    
    try {
      pendingRequests.current.dataFetch = true;
      
      const response = await fetch('/api/spotify/data');
      const data = await response.json();
      
      // Process data with checks for current listening
      if (data && data.listeningToSpotify && data.spotify) {
        setSpotifyData(data.spotify, true);
        return true;
      }
      
      // Or fall back to last played
      if (data && data.lastPlayedFromKV) {
        setSpotifyData(data.lastPlayedFromKV, false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("[SpotifyBox] API fetch error:", error);
      return false;
    } finally {
      pendingRequests.current.dataFetch = false;
    }
  }, [setSpotifyData]);

  // Main data loading effect with retry logic
  useEffect(() => {
    const loadData = async () => {
      // 1. First try to get data directly from lanyard
      const lanyardData = lanyard.data?.data;
      
      if (lanyardData) {
        // If currently listening to Spotify
        if (lanyardData.listening_to_spotify && lanyardData.spotify) {
          // Make sure we have a proper object
          const spotifyData: SpotifyData = {
            song: lanyardData.spotify.song,
            artist: lanyardData.spotify.artist,
            album: lanyardData.spotify.album,
            album_art_url: lanyardData.spotify.album_art_url,
            track_id: lanyardData.spotify.track_id,
            _updated_at: Date.now()
          };
          
          // Copy timestamps if they exist
          if (lanyardData.spotify.timestamps) {
            spotifyData.timestamps = {
              start: lanyardData.spotify.timestamps.start,
              end: lanyardData.spotify.timestamps.end || 0
            };
          }
          
          // Update state and KV store
          setSpotifyData(spotifyData, true);
          
          // Debounce KV store updates to prevent hammering the API
          if (timeouts.current.kvUpdate) {
            clearTimeout(timeouts.current.kvUpdate);
          }
          
          timeouts.current.kvUpdate = setTimeout(() => {
            updateKVStore(spotifyData);
          }, 2000);
          
          return;
        }
        
        // Try to get data from KV store in lanyard
        if (lanyardData.kv?.spotify_last_played) {
          try {
            const kvDataRaw = lanyardData.kv.spotify_last_played;
            const kvData = typeof kvDataRaw === 'string' ? JSON.parse(kvDataRaw) : kvDataRaw;
            
            if (kvData && typeof kvData === 'object' && kvData.song) {
              setSpotifyData(kvData, false);
              return;
            }
          } catch (error) {
            console.error("[SpotifyBox] Error parsing KV data:", error);
          }
        }
      }
      
      // 2. Fall back to our API endpoint
      const success = await fetchSpotifyData();
      
      if (!success) {
        // If all else fails, set loading to false
        setState(prev => ({ ...prev, isLoading: false }));
        
        // Schedule a retry after 10 seconds
        if (timeouts.current.retry) {
          clearTimeout(timeouts.current.retry);
        }
        
        timeouts.current.retry = setTimeout(() => {
          fetchSpotifyData();
        }, 10000);
      }
    };
    
    loadData();
    
    // Cleanup timeouts on unmount
    return () => {
      if (timeouts.current.kvUpdate) clearTimeout(timeouts.current.kvUpdate);
      if (timeouts.current.loading) clearTimeout(timeouts.current.loading);
      if (timeouts.current.retry) clearTimeout(timeouts.current.retry);
    };
  }, [lanyard.data, setSpotifyData, updateKVStore, fetchSpotifyData]);

  // Mouse event handlers
  const handleMouseEnter = () => setState(prev => ({ ...prev, isHovered: true }));
  const handleMouseLeave = () => setState(prev => ({ ...prev, isHovered: false }));

  // Render loading state
  if (state.isLoading) {
    return <Skeleton className="w-full h-full rounded-3xl" />;
  }
  
  // Render empty state if no data
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