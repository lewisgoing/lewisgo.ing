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

// Define the structure of Lanyard's response
interface LanyardResponseData {
  listening_to_spotify?: boolean;
  spotify?: SpotifyData;
  kv?: {
    spotify_last_played?: string;
  };
  discord_user?: any;
  discord_status?: string;
  activities?: any[];
  [key: string]: any;
}

interface LanyardResponse {
  success: boolean;
  data: LanyardResponseData;
}

// The actual type provided by useLanyard
interface LanyardSWRSingle {
  data?: LanyardResponse;
  error?: Error;
  isValidating: boolean;
  mutate: () => void;
}

interface SpotifyBoxProps {
  lanyard: LanyardSWRSingle;
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
    forceUpdate: false,
    error: null as string | null
  });
  
  // References to track timeouts and requests
  const timeoutsRef = useRef<{
    kvUpdate: NodeJS.Timeout | null;
    retry: NodeJS.Timeout | null;
    periodicUpdate: NodeJS.Timeout | null;
  }>({
    kvUpdate: null,
    retry: null,
    periodicUpdate: null
  });
  
  const dataRef = useRef<{
    lastTrackId: string | null;
    attempts: number;
    lanyard?: {
      isListening: boolean;
      trackId: string | null;
    }
  }>({
    lastTrackId: null,
    attempts: 0,
    lanyard: undefined
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
  const updateKVStore = useCallback(async (trackData: SpotifyData, force: boolean = false): Promise<boolean> => {
    // Don't update if the track ID hasn't changed and we're not forcing
    if (!force && trackData.track_id === dataRef.current.lastTrackId) {
      console.log("[SpotifyBox] Skipping KV update, track unchanged:", trackData.song);
      return false;
    }
    
    console.log(`[SpotifyBox] Updating KV store with track: ${trackData.song} (ID: ${trackData.track_id})`);
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Add timestamp to track version
      const dataToSend = {
        ...trackData,
        _updated_at: Date.now()
      };
      
      const timestamp = new Date().toISOString();
      const cacheParam = `nocache=${Date.now()}${Math.random()}`;
      
      const response = await fetch(`/api/spotify/data?${cacheParam}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp
        },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      console.log("[SpotifyBox] KV update response:", result);
      
      if (result.success) {
        // Update refs and state
        dataRef.current.lastTrackId = trackData.track_id;
        dataRef.current.attempts = 0;
        
        setState(prev => ({
          ...prev,
          lastUpdateTime: Date.now(),
          isLoading: false,
          error: null
        }));
        
        return true;
      } else {
        console.error("[SpotifyBox] KV update failed:", result.error, result.debug);
        
        // Increment attempt counter
        dataRef.current.attempts++;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Failed to update KV store: ${result.error}`
        }));
        
        return false;
      }
    } catch (error) {
      console.error("[SpotifyBox] KV update error:", error);
      
      // Increment attempt counter
      dataRef.current.attempts++;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      return false;
    }
  }, []);

  // Fetch Spotify data from API
  const fetchSpotifyData = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Add cache busting parameter
      const cacheParam = `nocache=${Date.now()}${Math.random()}`;
      const timestamp = new Date().toISOString();
      
      console.log("[SpotifyBox] Fetching Spotify data from API");
      
      const response = await fetch(`/api/spotify/data?${cacheParam}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp
        }
      });
      
      const data = await response.json();
      
      console.log("[SpotifyBox] API response:", data);
      
      // Check if we got valid data
      if (data) {
        // If currently listening to Spotify
        if (data.listeningToSpotify && data.spotify) {
          console.log("[SpotifyBox] User is currently listening to Spotify:", data.spotify.song);
          
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
          
          // Force a KV update if we're currently listening
          if (data.spotify.track_id !== dataRef.current.lastTrackId) {
            console.log("[SpotifyBox] Track changed, updating KV store from listening data");
            updateKVStore(data.spotify, true);
          }
          
          return true;
        }
        
        // Otherwise, use last played from KV
        if (data.lastPlayedFromKV) {
          console.log("[SpotifyBox] User last played:", data.lastPlayedFromKV.song);
          
          setState(prev => ({
            ...prev,
            spotifyData: data.lastPlayedFromKV,
            isCurrentlyPlaying: false,
            isLoading: false,
            error: null
          }));
          
          // Track last known value
          dataRef.current.lastTrackId = data.lastPlayedFromKV.track_id;
          
          // Call onLoad if provided
          if (onLoad) {
            onLoad();
          }
          
          return true;
        }
      }
      
      // If we get here, we didn't find any valid data
      console.warn("[SpotifyBox] No Spotify data available from API");
      
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
    }
  }, [onLoad, updateKVStore]);

  // Process Lanyard data directly
  const processLanyardData = useCallback(() => {
    const lanyardData = lanyard.data?.data;
    
    if (lanyardData) {
      const isListening = !!lanyardData.listening_to_spotify;
      const trackId = lanyardData.spotify?.track_id || null;
      
      // Store current Lanyard state for comparison
      dataRef.current.lanyard = {
        isListening,
        trackId
      };
      
      // If currently listening to Spotify
      if (isListening && lanyardData.spotify) {
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
        
        console.log(`[SpotifyBox] Lanyard reports user listening to: ${spotifyData.song}`);
        
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
        
        // Check if the track changed
        if (spotifyData.track_id !== dataRef.current.lastTrackId) {
          console.log("[SpotifyBox] Track changed, updating KV store");
          
          // Update KV store in the background to avoid blocking UI
          setTimeout(() => {
            updateKVStore(spotifyData).catch(err => {
              console.error("[SpotifyBox] Background KV update error:", err);
            });
          }, 1000);
        }
        
        return true;
      }
      
      // Try to get data from KV store if not currently listening
      if (lanyardData.kv?.spotify_last_played) {
        try {
          // Parse KV data
          const kvRaw = lanyardData.kv.spotify_last_played;
          const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
          
          if (kvData && typeof kvData === 'object' && 
              kvData.song && kvData.artist && kvData.album && 
              kvData.album_art_url && kvData.track_id) {
            
            console.log(`[SpotifyBox] Lanyard KV reports last played: ${kvData.song}`);
            
            // Update state
            setState(prev => ({
              ...prev,
              spotifyData: kvData,
              isCurrentlyPlaying: false,
              isLoading: false,
              error: null
            }));
            
            // Update last track ID
            dataRef.current.lastTrackId = kvData.track_id;
            
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
    
    // If we get here, we didn't find any valid data in Lanyard
    console.log("[SpotifyBox] No Spotify data found in Lanyard");
    return false;
  }, [lanyard.data, onLoad, updateKVStore]);

  // Set up periodic update check
  useEffect(() => {
    // Function to check for updates
    const checkForUpdates = () => {
      const currentData = state.spotifyData;
      
      // If we have current data and it's been more than 5 minutes since last update
      if (currentData && Date.now() - state.lastUpdateTime > 300000) {
        console.log("[SpotifyBox] Periodic update check - forcing KV update");
        
        // Force an update
        updateKVStore(currentData, true).catch(console.error);
      }
    };
    
    // Set up periodic checks every 5 minutes
    timeoutsRef.current.periodicUpdate = setInterval(checkForUpdates, 300000);
    
    return () => {
      if (timeoutsRef.current.periodicUpdate) {
        clearInterval(timeoutsRef.current.periodicUpdate);
      }
    };
  }, [state.spotifyData, state.lastUpdateTime, updateKVStore]);

  // Main effect to load data
  useEffect(() => {
    // Only trigger effect when lanyard data changes or we need a force update
    if (!lanyard.data && !state.forceUpdate) return;
    
    const loadData = async () => {
      console.log("[SpotifyBox] Loading data, force update:", state.forceUpdate);
      
      // 1. Try to get data directly from Lanyard
      const lanyardSuccess = processLanyardData();
      
      // 2. If Lanyard data processing failed or we're forcing an update, try the API
      if (!lanyardSuccess || state.forceUpdate) {
        const apiSuccess = await fetchSpotifyData();
        
        // 3. If API fails too, set up retry logic
        if (!apiSuccess && dataRef.current.attempts < 3) {
          console.log(`[SpotifyBox] API fetch failed, scheduling retry #${dataRef.current.attempts + 1}`);
          
          // Schedule a retry with exponential backoff
          if (timeoutsRef.current.retry) {
            clearTimeout(timeoutsRef.current.retry);
          }
          
          const backoffTime = Math.min(10000, 1000 * Math.pow(2, dataRef.current.attempts));
          
          timeoutsRef.current.retry = setTimeout(() => {
            setState(prev => ({ ...prev, forceUpdate: true }));
          }, backoffTime);
        }
      }
      
      // Reset force update flag
      if (state.forceUpdate) {
        setState(prev => ({ ...prev, forceUpdate: false }));
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
  }, [lanyard.data, state.forceUpdate, processLanyardData, fetchSpotifyData]);

  // Additional effect to trigger updates when Spotify status changes
  useEffect(() => {
    const lanyardData = lanyard.data?.data;
    if (!lanyardData) return;
    
    // Check if Spotify status changed
    const isListening = !!lanyardData.listening_to_spotify;
    const trackId = lanyardData.spotify?.track_id || null;
    
    if (!dataRef.current.lanyard) {
      // Initialize if this is the first run
      dataRef.current.lanyard = { isListening, trackId };
      return;
    }
    
    // Check if listening status or track ID changed
    if (isListening !== dataRef.current.lanyard.isListening ||
        trackId !== dataRef.current.lanyard.trackId) {
      
      console.log(`[SpotifyBox] Spotify status changed - Was listening: ${dataRef.current.lanyard.isListening}, Now listening: ${isListening}`);
      console.log(`[SpotifyBox] Track changed - Old: ${dataRef.current.lanyard.trackId}, New: ${trackId}`);
      
      // If user was listening but isn't anymore, force a KV update for "last played"
      if (dataRef.current.lanyard.isListening && !isListening && 
          dataRef.current.lanyard.trackId) {
        
        console.log("[SpotifyBox] User stopped listening - forcing KV update");
        
        // Give a slight delay to ensure Lanyard has proper data
        setTimeout(() => {
          fetchSpotifyData().catch(console.error);
        }, 2000);
      }
      
      // Update reference
      dataRef.current.lanyard = { isListening, trackId };
    }
  }, [lanyard.data, fetchSpotifyData]);
  
  // Also run the process when isValidating changes to false (indicating a refresh)
  useEffect(() => {
    if (!lanyard.isValidating && lanyard.data) {
      console.log("[SpotifyBox] Lanyard refresh completed");
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