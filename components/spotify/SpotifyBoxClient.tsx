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
    error: null as string | null
  });
  
  // Keep track of last state
  const lastStateRef = useRef({
    isListening: false,
    trackId: null as string | null
  });

  // Derived styles based on hover state
  const imageStyle = isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: "color 0.3s ease",
    color: isHovered ? "#1db954" : "#e5d3b8",
  };

  // Helper function to update KV store
  const updateKVStore = useCallback(async (spotifyData: SpotifyData) => {
    try {
      console.log(`[SpotifyBox] Updating KV store with track: ${spotifyData.song}`);
      
      const response = await fetch('/api/spotify/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotifyData)
      });
      
      const result = await response.json();
      
      console.log('[SpotifyBox] KV update result:', result);
      
      return result.success;
    } catch (error) {
      console.error('[SpotifyBox] Error updating KV store:', error);
      return false;
    }
  }, []);

  // Main effect for processing lanyard data
  useEffect(() => {
    if (!lanyard.data) return;
    
    const lanyardData = lanyard.data.data;
    
    // Check if user is listening to Spotify
    const isListening = !!lanyardData.listening_to_spotify;
    const currentTrackId = lanyardData.spotify?.track_id || null;
    
    // Detect if user stopped listening - this is critical for updating last played
    if (lastStateRef.current.isListening && !isListening) {
      console.log('[SpotifyBox] User stopped listening - updating last played');
      
      // Use current state data to update KV store
      if (spotifyState.spotifyData) {
        updateKVStore(spotifyState.spotifyData);
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
      setSpotifyState({
        spotifyData,
        isCurrentlyPlaying: true,
        isLoading: false,
        error: null
      });
      
      // Call onLoad callback if provided
      if (onLoad) onLoad();
      
      // If track has changed, update KV store
      if (currentTrackId !== lastStateRef.current.trackId) {
        updateKVStore(spotifyData);
      }
    } 
    else if (lanyardData.kv?.spotify_last_played) {
      // User is not listening, show last played
      try {
        const kvRaw = lanyardData.kv.spotify_last_played;
        const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
        
        if (kvData && kvData.song && kvData.artist && kvData.album && 
            kvData.album_art_url && kvData.track_id) {
          // Update component state with last played
          setSpotifyState({
            spotifyData: kvData,
            isCurrentlyPlaying: false,
            isLoading: false,
            error: null
          });
          
          // Call onLoad callback if provided
          if (onLoad) onLoad();
        }
      } catch (error) {
        console.error('[SpotifyBox] Error parsing KV data:', error);
        setSpotifyState(prev => ({
          ...prev,
          error: 'Error parsing KV data',
          isLoading: false
        }));
      }
    }
    else {
      // No data available
      setSpotifyState(prev => ({
        ...prev,
        isLoading: false,
        error: 'No Spotify data available'
      }));
    }
    
    // Update last state
    lastStateRef.current = {
      isListening,
      trackId: currentTrackId
    };
    
  }, [lanyard.data, updateKVStore, onLoad]);
  
  // Manually fetch Spotify data if needed
  const fetchSpotifyData = useCallback(async () => {
    try {
      setSpotifyState(prev => ({...prev, isLoading: true}));
      
      const response = await fetch('/api/spotify/data');
      const data = await response.json();
      
      if (data.listeningToSpotify && data.spotify) {
        setSpotifyState({
          spotifyData: data.spotify,
          isCurrentlyPlaying: true,
          isLoading: false,
          error: null
        });
        
        if (onLoad) onLoad();
        return;
      }
      
      if (data.lastPlayedFromKV) {
        setSpotifyState({
          spotifyData: data.lastPlayedFromKV,
          isCurrentlyPlaying: false,
          isLoading: false,
          error: null
        });
        
        if (onLoad) onLoad();
        return;
      }
      
      setSpotifyState(prev => ({
        ...prev,
        isLoading: false,
        error: 'No Spotify data available'
      }));
    } catch (error) {
      console.error('[SpotifyBox] Error fetching Spotify data:', error);
      setSpotifyState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error fetching Spotify data'
      }));
    }
  }, [onLoad]);
  
  // Effect to fetch data if lanyard fails
  useEffect(() => {
    if (!lanyard.data && !spotifyState.spotifyData && !spotifyState.isLoading) {
      fetchSpotifyData();
    }
  }, [lanyard.data, spotifyState.spotifyData, spotifyState.isLoading, fetchSpotifyData]);

  // Mouse event handlers - simplified to fix hover animations
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

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
        // Add click handler to force KV update
        onClick={() => {
          if (spotifyState.spotifyData) {
            console.log('[SpotifyBox] User clicked - forcing KV update');
            updateKVStore(spotifyState.spotifyData);
          }
        }}
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
    </>
  );
};

export default SpotifyBox;