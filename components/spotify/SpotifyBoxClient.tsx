// components/spotify/SpotifyBoxClient.tsx
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
  // Split the state to avoid issues with hover animations
  const [isHovered, setIsHovered] = useState(false);
  const [spotifyState, setSpotifyState] = useState({
    spotifyData: null as SpotifyData | null,
    isLoading: true,
    isCurrentlyPlaying: false,
    error: null as string | null,
    lastUpdateAttempt: 0
  });
  
  // Debug state - only shown in development
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Keep track of last state
  const lastStateRef = useRef({
    isListening: false,
    trackId: null as string | null,
    lastSuccessfulKvUpdate: 0
  });

  // Add debug logs in development
  const addDebugLog = useCallback((message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SpotifyBox] ${message}`);
      setDebugLogs(prev => [...prev.slice(-19), message]);
    }
  }, []);

  // Derived styles based on hover state
  const imageStyle = isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: "color 0.3s ease",
    color: isHovered ? "#1db954" : "#e5d3b8",
  };

  // Improved helper function to update KV store with better error handling
  const updateKVStore = useCallback(async (spotifyData: SpotifyData): Promise<boolean> => {
    try {
      addDebugLog(`Updating KV store with track: ${spotifyData.song} (${spotifyData.track_id})`);
      
      // Add timestamp to prevent caching issues
      const updateTimestamp = Date.now();
      setSpotifyState(prev => ({...prev, lastUpdateAttempt: updateTimestamp}));
      
      const response = await fetch('/api/spotify/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache' 
        },
        body: JSON.stringify({
          ...spotifyData,
          _updated_at: updateTimestamp // Add timestamp to data for tracking
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        addDebugLog(`KV update failed: ${result.error || 'Unknown error'}`);
        return false;
      }
      
      addDebugLog(`KV update successful for ${spotifyData.track_id}`);
      lastStateRef.current.lastSuccessfulKvUpdate = updateTimestamp;
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugLog(`Error updating KV store: ${errorMessage}`);
      return false;
    }
  }, [addDebugLog]);

  // Fetch Spotify data from our API endpoint
  const fetchSpotifyData = useCallback(async () => {
    try {
      addDebugLog('Manually fetching Spotify data from API');
      
      const response = await fetch('/api/spotify/data', {
        headers: {
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.listeningToSpotify && data.spotify) {
        addDebugLog('API reports user is currently listening');
        setSpotifyState({
          spotifyData: data.spotify,
          isCurrentlyPlaying: true,
          isLoading: false,
          error: null,
          lastUpdateAttempt: Date.now()
        });
        
        if (onLoad) onLoad();
        return true;
      }
      
      if (data.lastPlayedFromKV) {
        addDebugLog('Using last played track from KV: ' + data.lastPlayedFromKV.track_id);
        setSpotifyState({
          spotifyData: data.lastPlayedFromKV,
          isCurrentlyPlaying: false,
          isLoading: false,
          error: null,
          lastUpdateAttempt: Date.now()
        });
        
        if (onLoad) onLoad();
        return true;
      }
      
      addDebugLog('No Spotify data available from API');
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugLog(`Error fetching data: ${errorMessage}`);
      return false;
    }
  }, [onLoad, addDebugLog]);

  // Enhanced effect for handling Lanyard data with better change detection
  useEffect(() => {
    if (!lanyard.data) {
      addDebugLog('No Lanyard data available');
      return;
    }
    
    const lanyardData = lanyard.data.data;
    
    // Check if user is listening to Spotify
    const isListening = !!lanyardData.listening_to_spotify;
    const currentTrackId = lanyardData.spotify?.track_id || null;
    
    addDebugLog(`Lanyard update - isListening: ${isListening}, trackId: ${currentTrackId || 'none'}`);
    
    // CRITICAL FIX: More robust detection for when user stops listening
    // This ensures we update the KV store when user stops listening
    if (lastStateRef.current.isListening && !isListening) {
      addDebugLog('Detected user STOPPED listening - updating last played');
      
      // Use current state data to update KV store
      if (spotifyState.spotifyData) {
        // Force update with a small delay to ensure we have the latest data
        setTimeout(() => {
          updateKVStore(spotifyState.spotifyData!);
        }, 500);
      }
    }
    
    // Update the component state based on Lanyard data
    if (isListening && lanyardData.spotify) {
      // User is actively listening
      const spotifyData: SpotifyData = {
        song: lanyardData.spotify.song,
        artist: lanyardData.spotify.artist,
        album: lanyardData.spotify.album,
        album_art_url: lanyardData.spotify.album_art_url,
        track_id: lanyardData.spotify.track_id
      };
      
      // Copy timestamps if they exist
      if (lanyardData.spotify.timestamps) {
        spotifyData.timestamps = {
          start: lanyardData.spotify.timestamps.start, 
          end: lanyardData.spotify.timestamps.end || 0
        };
      }
      
      // Update component state
      setSpotifyState(prev => ({
        ...prev,
        spotifyData,
        isCurrentlyPlaying: true,
        isLoading: false,
        error: null
      }));
      
      // Call onLoad callback if provided
      if (onLoad) onLoad();
      
      // CRITICAL FIX: Better track change detection
      // If track has changed, update KV store immediately
      if (currentTrackId !== lastStateRef.current.trackId && currentTrackId) {
        addDebugLog(`Track changed from ${lastStateRef.current.trackId || 'none'} to ${currentTrackId}`);
        updateKVStore(spotifyData);
      }
    } 
    else if (lanyardData.kv?.spotify_last_played) {
      // User is not listening, show last played
      try {
        const kvRaw = lanyardData.kv.spotify_last_played;
        let kvData: SpotifyData;
        
        if (typeof kvRaw === 'string') {
          kvData = JSON.parse(kvRaw);
          addDebugLog('Parsed KV data as string');
        } else {
          kvData = kvRaw as SpotifyData;
          addDebugLog('Used KV data as object');
        }
        
        if (kvData && kvData.song && kvData.artist && kvData.album && 
            kvData.album_art_url && kvData.track_id) {
          addDebugLog(`Found last played in KV: ${kvData.song} (${kvData.track_id})`);
          
          // Update component state with last played
          setSpotifyState(prev => ({
            ...prev,
            spotifyData: kvData,
            isCurrentlyPlaying: false,
            isLoading: false,
            error: null
          }));
          
          // Call onLoad callback if provided
          if (onLoad) onLoad();
        } else {
          addDebugLog('KV data was incomplete: ' + JSON.stringify(kvData));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addDebugLog(`Error parsing KV data: ${errorMessage}`);
        setSpotifyState(prev => ({
          ...prev,
          error: 'Error parsing KV data',
          isLoading: false
        }));
      }
    }
    else {
      // No data available - try our API endpoint as fallback
      addDebugLog('No Spotify data in Lanyard - trying API endpoint');
      fetchSpotifyData();
    }
    
    // Update last state
    lastStateRef.current = {
      ...lastStateRef.current,
      isListening,
      trackId: currentTrackId
    };
    
  }, [lanyard.data, updateKVStore, onLoad, addDebugLog, fetchSpotifyData, spotifyState.spotifyData]);
  
  // IMPORTANT FIX: Periodic check for last played track
  // This ensures we have the latest data even if Lanyard updates are slow
  useEffect(() => {
    // Only run this effect if we're not currently listening to anything
    if (spotifyState.isCurrentlyPlaying) return;
    
    // Check for last played every 30 seconds
    const intervalId = setInterval(() => {
      if (!spotifyState.isCurrentlyPlaying) {
        addDebugLog('Periodic check for last played track');
        fetchSpotifyData();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchSpotifyData, spotifyState.isCurrentlyPlaying, addDebugLog]);

  // Mouse event handlers - simplified to fix hover animations
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Force KV update on manual interaction
  const handleManualUpdate = useCallback(() => {
    if (spotifyState.spotifyData) {
      addDebugLog('Manual KV update triggered by user click');
      updateKVStore(spotifyState.spotifyData);
    }
  }, [spotifyState.spotifyData, updateKVStore, addDebugLog]);

  // Error placeholder
  if (spotifyState.error && !spotifyState.spotifyData) {
    return <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground p-4">Unable to load Spotify data</div>;
  }

  // Loading placeholder
  if (spotifyState.isLoading && !spotifyState.spotifyData) {
    return <Skeleton className="w-full h-full rounded-3xl" />;
  }
  
  // Empty placeholder
  if (!spotifyState.spotifyData) {
    return <div className="h-full w-full opacity-0"></div>;
  }

  // Extract track data
  const { song, artist, album, album_art_url, track_id } = spotifyState.spotifyData;

  return (
    <>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="transition-all duration-500 ease-in-out opacity-100"
        onClick={handleManualUpdate}
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
              {spotifyState.isCurrentlyPlaying ? (
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
              {spotifyState.isCurrentlyPlaying ? (
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
      
      {/* Debug info - only shown in development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="fixed bottom-2 right-2 text-xs text-gray-500 z-10">
          <summary>Debug info</summary>
          <pre className="whitespace-pre-wrap text-xs bg-black/70 p-2 rounded">
            Track ID: {track_id || 'none'}<br/>
            Is Playing: {spotifyState.isCurrentlyPlaying ? 'Yes' : 'No'}<br/>
            Last Update: {new Date(spotifyState.lastUpdateAttempt).toLocaleTimeString()}<br/>
            Last Success: {new Date(lastStateRef.current.lastSuccessfulKvUpdate).toLocaleTimeString()}<br/>
            Debug Log:
            {debugLogs.map((log, i) => (
              <div key={i} className="pl-2">{log}</div>
            ))}
          </pre>
        </details>
      )}
    </>
  );
};

export default SpotifyBox;