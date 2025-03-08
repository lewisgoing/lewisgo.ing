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
  data?: {
    listening_to_spotify?: boolean;
    spotify?: SpotifyData | null;
    kv?: {
      spotify_last_played?: string;
    };
  };
  error?: Error;
  isValidating: boolean;
  mutate: () => void;
}

interface SpotifyBoxProps {
  lanyard: LanyardData;
  onLoad?: () => void;
}

const SpotifyBox: React.FC<SpotifyBoxProps> = ({ lanyard, onLoad }) => {
  // State
  const [state, setState] = useState({
    isHovered: false,
    spotifyData: null as SpotifyData | null,
    isLoading: true,
    isCurrentlyPlaying: false,
    lastUpdateTime: 0,
    error: null as string | null
  });
  
  // References to track timeouts and requests
  const timeoutsRef = useRef<{
    kvUpdate: NodeJS.Timeout | null;
    retry: NodeJS.Timeout | null;
  }>({
    kvUpdate: null,
    retry: null
  });
  
  const requestsRef = useRef<{
    kvUpdate: boolean;
    apiFetch: boolean;
  }>({
    kvUpdate: false,
    apiFetch: false
  });

  // Derived styles based on hover state
  const imageStyle = state.isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: "color 0.3s ease",
    color: state.isHovered ? "#1db954" : "#e5d3b8",
  };

  // Update KV store with track data
  const updateKVStore = useCallback(async (trackData: SpotifyData): Promise<boolean> => {
    // Prevent concurrent requests
    if (requestsRef.current.kvUpdate) {
      return false;
    }
    
    try {
      requestsRef.current.kvUpdate = true;
      
      // Add timestamp to track version
      const dataToSend = {
        ...trackData,
        _updated_at: Date.now()
      };
      
      const response = await fetch('/api/spotify/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
        // Set a timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          lastUpdateTime: Date.now(),
          error: null
        }));
        
        return true;
      } else {
        console.error("[SpotifyBox] KV update failed:", result.error);
        
        setState(prev => ({
          ...prev,
          error: `Failed to update KV store: ${result.error}`
        }));
        
        return false;
      }
    } catch (error) {
      console.error("[SpotifyBox] KV update error:", error);
      
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      return false;
    } finally {
      requestsRef.current.kvUpdate = false;
    }
  }, []);

  // Fetch Spotify data from API
  const fetchSpotifyData = useCallback(async (): Promise<boolean> => {
    // Prevent concurrent requests
    if (requestsRef.current.apiFetch) {
      return false;
    }
    
    try {
      requestsRef.current.apiFetch = true;
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/spotify/data', {
        // Set a timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
        // Add cache busting parameter
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      const data = await response.json();
      
      // Check if we got valid data
      if (data) {
        // If currently listening to Spotify
        if (data.listeningToSpotify && data.spotify) {
          setState(prev => ({
            ...prev,
            spotifyData: data.spotify,
            isCurrentlyPlaying: true,
            isLoading: false,
            error: null
          }));
          
          // Call onLoad if provided
          if (onLoad) {
            onLoad();
          }
          
          return true;
        }
        
        // Otherwise, use last played from KV
        if (data.lastPlayedFromKV) {
          setState(prev => ({
            ...prev,
            spotifyData: data.lastPlayedFromKV,
            isCurrentlyPlaying: false,
            isLoading: false,
            error: null
          }));
          
          // Call onLoad if provided
          if (onLoad) {
            onLoad();
          }
          
          return true;
        }
      }
      
      // If we get here, we didn't find any valid data
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'No Spotify data available'
      }));
      
      return false;
    } catch (error) {
      console.error("[SpotifyBox] API fetch error:", error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      return false;
    } finally {
      requestsRef.current.apiFetch = false;
    }
  }, [onLoad]);

  // Process Lanyard data directly
  const processLanyardData = useCallback(() => {
    const lanyardData = lanyard.data?.data;
    
    if (lanyardData) {
      // If currently listening to Spotify
      if (lanyardData.listening_to_spotify && lanyardData.spotify) {
        // Create a clean SpotifyData object
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
        
        // Update state
        setState(prev => ({
          ...prev,
          spotifyData,
          isCurrentlyPlaying: true,
          isLoading: false,
          error: null
        }));
        
        // Call onLoad if provided
        if (onLoad) {
          onLoad();
        }
        
        // Background update KV store
        // Use a debounce to avoid hammering the API with updates
        if (timeoutsRef.current.kvUpdate) {
          clearTimeout(timeoutsRef.current.kvUpdate);
        }
        
        timeoutsRef.current.kvUpdate = setTimeout(() => {
          updateKVStore(spotifyData).catch(err => {
            console.error("[SpotifyBox] Background KV update error:", err);
          });
        }, 2000);
        
        return true;
      }
      
      // Try to get data from KV store
      if (lanyardData.kv?.spotify_last_played) {
        try {
          // Parse KV data
          const kvRaw = lanyardData.kv.spotify_last_played;
          const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
          
          if (kvData && typeof kvData === 'object' && 
              kvData.song && kvData.artist && kvData.album && 
              kvData.album_art_url && kvData.track_id) {
            // Update state
            setState(prev => ({
              ...prev,
              spotifyData: kvData,
              isCurrentlyPlaying: false,
              isLoading: false,
              error: null
            }));
            
            // Call onLoad if provided
            if (onLoad) {
              onLoad();
            }
            
            return true;
          }
        } catch (error) {
          console.error("[SpotifyBox] Error parsing KV data:", error);
        }
      }
    }
    
    return false;
  }, [lanyard.data, onLoad, updateKVStore]);

  // Main effect to load data
  useEffect(() => {
    const loadData = async () => {
      // 1. Try to get data directly from Lanyard
      const lanyardSuccess = processLanyardData();
      
      // 2. If Lanyard data processing failed, try the API
      if (!lanyardSuccess) {
        const apiSuccess = await fetchSpotifyData();
        
        // 3. If API fails too, set up retry logic
        if (!apiSuccess) {
          // Schedule a retry after 10 seconds
          if (timeoutsRef.current.retry) {
            clearTimeout(timeoutsRef.current.retry);
          }
          
          timeoutsRef.current.retry = setTimeout(() => {
            fetchSpotifyData().catch(console.error);
          }, 10000);
        }
      }
    };
    
    loadData().catch(console.error);
    
    // Cleanup timeouts on unmount
    return () => {
      if (timeoutsRef.current.kvUpdate) {
        clearTimeout(timeoutsRef.current.kvUpdate);
      }
      
      if (timeoutsRef.current.retry) {
        clearTimeout(timeoutsRef.current.retry);
      }
    };
  }, [lanyard.data, processLanyardData, fetchSpotifyData]);

  // Also run the process when isValidating changes to false (indicating a refresh)
  useEffect(() => {
    if (!lanyard.isValidating && lanyard.data) {
      processLanyardData();
    }
  }, [lanyard.isValidating, processLanyardData]);

  // Mouse event handlers
  const handleMouseEnter = () => setState(prev => ({ ...prev, isHovered: true }));
  const handleMouseLeave = () => setState(prev => ({ ...prev, isHovered: false }));

  // Error placeholder
  if (state.error && !state.spotifyData) {
    return <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground p-4">Unable to load Spotify data</div>;
  }

  // Loading placeholder
  if (state.isLoading && !state.spotifyData) {
    return <Skeleton className="w-full h-full rounded-3xl" />;
  }
  
  // Empty placeholder
  if (!state.spotifyData) {
    return <div className="h-full w-full opacity-0"></div>;
  }

  // Extract track data
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