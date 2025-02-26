// components/boxes/SpotifyBox.tsx
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import ExternalLink from "../assets/ExternalLink";

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

interface LanyardData {
  data?: {
    listening_to_spotify?: boolean;
    spotify?: SpotifyData | null;
    kv?: {
      spotify_last_played?: string;
    };
  };
}

interface SpotifyBoxProps {
  lanyard: LanyardData;
  onLoad?: () => void;
}

// Combined state interface to reduce useState calls
interface SpotifyBoxState {
  isHovered: boolean;
  spotifyData: SpotifyData | null;
  loading: {
    isLoading: boolean;
    showMessage: boolean;
  };
  isCurrentlyPlaying: boolean;
  debugInfo: string[];
}

const SpotifyBox: React.FC<SpotifyBoxProps> = ({ lanyard, onLoad }) => {
  // Combined state for better management
  const [state, setState] = useState<SpotifyBoxState>({
    isHovered: false,
    spotifyData: null,
    loading: {
      isLoading: false,
      showMessage: false
    },
    isCurrentlyPlaying: false,
    debugInfo: []
  });
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived styles based on hover state
  const iconStyle = {
    transition: "color 0.3s ease",
    color: state.isHovered ? "#1db954" : "#e5d3b8",
  };

  const imageStyle = state.isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  // Helper functions for state updates
  const addDebug = (message: string): void => {
    // console.log(`[SpotifyBox] ${message}`);
    setState(prev => ({
      ...prev,
      debugInfo: [...prev.debugInfo, message]
    }));
  };

  const setSpotifyData = (data: SpotifyData | null, isPlaying: boolean = false): void => {
    setState(prev => ({
      ...prev,
      spotifyData: data,
      isCurrentlyPlaying: isPlaying
    }));
  };

  const startLoading = (): void => {
    setState(prev => ({
      ...prev,
      loading: { isLoading: true, showMessage: false }
    }));
    // No need for timeout anymore since we're not showing text
  };

  const stopLoading = (): void => {
    setState(prev => ({
      ...prev,
      loading: { isLoading: false, showMessage: false }
    }));
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
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

  // Main initialization effect
  useEffect(() => {
    const initSpotify = async (): Promise<void> => {
      startLoading();
      addDebug('Initializing SpotifyBox component');
      
      // Check lanyard prop first for immediate data
      if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
        addDebug('Using immediate lanyard data');
        setSpotifyData(lanyard.data.spotify, true);
        
        // Update KV store in the background
        updateKVStore(lanyard.data.spotify).then(() => {
          stopLoading();
          onLoad?.();
        });
        
        stopLoading();
        return;
      }
      
      try {
        // Try API endpoint next
        const success = await fetchSpotifyData();
        
        if (!success) {
          // Final fallback to direct Lanyard data
          addDebug('Falling back to direct Lanyard data');
          
          if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
            addDebug('User is listening to Spotify (from Lanyard prop)');
            setSpotifyData(lanyard.data.spotify, true);
            await updateKVStore(lanyard.data.spotify);
          } else if (lanyard?.data?.kv?.spotify_last_played) {
            addDebug('Found last played in Lanyard KV prop');
            try {
              const kvData = JSON.parse(lanyard.data.kv.spotify_last_played);
              setSpotifyData(kvData, false);
            } catch (parseErr: any) {
              addDebug(`Error parsing KV data: ${parseErr.message}`);
            }
          } else {
            addDebug('No Spotify data available');
          }
        }
      } catch (err: any) {
        addDebug(`Initialization error: ${err.message}`);
      } finally {
        stopLoading();
      }
    };
    
    initSpotify();
    
    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [lanyard]);
  
  // Handle changes in Lanyard Spotify status
  useEffect(() => {
    if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
      addDebug('Spotify status changed - now playing');
      setSpotifyData(lanyard.data.spotify, true);
      
      // Update KV store with current track
      updateKVStore(lanyard.data.spotify);
    }
  }, [lanyard?.data?.listening_to_spotify, lanyard?.data?.spotify]);
  
  // Call onLoad callback when data is available
  useEffect(() => {
    if (state.spotifyData && onLoad) {
      addDebug('Calling onLoad callback');
      onLoad();
    }
  }, [state.spotifyData, onLoad]);

  // Event handlers
  const handleMouseEnter = (): void => setState(prev => ({ ...prev, isHovered: true }));
  const handleMouseLeave = (): void => setState(prev => ({ ...prev, isHovered: false }));

  // Empty, invisible placeholder during loading
  if (state.loading.isLoading && !state.spotifyData) {
    return <div className="h-full w-full"></div>;
  }
  
  // Minimal "no data" state without loading text
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

  // Extract Spotify data with default empty values
  const { song, artist, album, album_art_url, track_id } = state.spotifyData || {
    song: "",
    artist: "",
    album: "",
    album_art_url: "",
    track_id: ""
  };

  return (
    <>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`transition-all duration-500 ease-in-out ${state.loading.isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
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
                src="svg/bento-now-playing.svg"
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
                src="svg/bento-now-playing.svg"
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
        <div className="absolute right-0 top-0 z-[1] m-3 text-primary">
          <FaSpotify size={56} style={iconStyle} />
        </div>
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