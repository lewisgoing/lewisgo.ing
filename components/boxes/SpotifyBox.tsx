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

const SpotifyBox: React.FC<SpotifyBoxProps> = ({ lanyard, onLoad }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start with false to avoid flash
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const iconStyle = {
    transition: "color 0.3s ease",
    color: isHovered ? "#1db954" : "#e5d3b8",
  };

  const imageStyle = isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  // Add debug message
  const addDebug = (message: string) => {
    console.log(`[SpotifyBox] ${message}`);
    setDebugInfo(prev => [...prev, message]);
  };

  // Update the KV store with track data
  const updateKVStore = async (trackData: SpotifyData) => {
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

  // Delayed loading message
  const startLoading = () => {
    setIsLoading(true);
    // Only show loading message if it takes more than 300ms
    loadingTimeoutRef.current = setTimeout(() => {
      setShowLoadingMessage(true);
    }, 300);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setShowLoadingMessage(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // Fetch Spotify data from our API
  const fetchSpotifyData = async () => {
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
        setSpotifyData(data.spotify);
        setIsCurrentlyPlaying(true);
        
        // Update KV store with current track
        updateKVStore(data.spotify);
        return true;
      }
      
      // Otherwise, use last played from KV
      if (data.lastPlayedFromKV) {
        addDebug('Using last played track from KV store');
        setSpotifyData(data.lastPlayedFromKV);
        setIsCurrentlyPlaying(false);
        return true;
      }
      
      addDebug('No Spotify data available from API');
      return false;
    } catch (error: any) {
      addDebug(`Error fetching data: ${error.message}`);
      return false;
    }
  };

  // Initialize component
  useEffect(() => {
    const initSpotify = async () => {
      // Start loading state
      startLoading();
      addDebug('Initializing SpotifyBox component');
      
      // Pre-check lanyard prop to avoid flash if data is already available
      if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
        addDebug('Using immediate lanyard data');
        setSpotifyData(lanyard.data.spotify);
        setIsCurrentlyPlaying(true);
        
        // Still update KV store in the background
        updateKVStore(lanyard.data.spotify).then(() => {
          stopLoading();
          if (onLoad) onLoad();
        });
        
        // Stop loading immediately since we have data
        stopLoading();
        return;
      }
      
      try {
        // Try to get data from our API endpoint
        const success = await fetchSpotifyData();
        
        if (!success) {
          // Fallback to direct Lanyard data if needed
          addDebug('Falling back to direct Lanyard data');
          
          if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
            addDebug('User is listening to Spotify (from Lanyard prop)');
            setSpotifyData(lanyard.data.spotify);
            setIsCurrentlyPlaying(true);
            
            // Update KV store with current track
            await updateKVStore(lanyard.data.spotify);
          } else if (lanyard?.data?.kv?.spotify_last_played) {
            addDebug('Found last played in Lanyard KV prop');
            try {
              const kvData = JSON.parse(lanyard.data.kv.spotify_last_played);
              setSpotifyData(kvData);
              setIsCurrentlyPlaying(false);
            } catch (parseErr) {
              addDebug(`Error parsing KV data: ${parseErr}`);
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
  }, []);
  
  // Handle changes in Lanyard Spotify status
  useEffect(() => {
    if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
      addDebug('Spotify status changed - now playing');
      setSpotifyData(lanyard.data.spotify);
      setIsCurrentlyPlaying(true);
      
      // Update KV store with current track
      updateKVStore(lanyard.data.spotify);
    }
  }, [lanyard?.data?.listening_to_spotify, lanyard?.data?.spotify]);
  
  // Call onLoad callback when data is available
  useEffect(() => {
    if (spotifyData && onLoad) {
      addDebug('Calling onLoad callback');
      onLoad();
    }
  }, [spotifyData, onLoad]);

  // Placeholder component while loading
  if (isLoading && showLoadingMessage) {
    return <div className="flex items-center justify-center h-full">
      <span className="text-sm text-gray-500">Loading Spotify data...</span>
    </div>;
  }
  
  // If we have no data after loading
  if (!isLoading && !spotifyData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-gray-500">No Spotify data available</p>
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs text-gray-500 mt-2">
            <summary>Debug info</summary>
            <pre className="whitespace-pre-wrap text-xs">
              {debugInfo.join('\n')}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // Empty placeholder if we're loading without data
  if (isLoading && !spotifyData) {
    return <div className="h-full"></div>;
  }

  // If we have data, show it (even while loading, to avoid flashes)
  const { song, artist, album, album_art_url, track_id } = spotifyData || {
    song: "",
    artist: "",
    album: "",
    album_art_url: "",
    track_id: ""
  };

  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}
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
              {isCurrentlyPlaying ? (
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
              {isCurrentlyPlaying ? (
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
        <div
          className="absolute right-0 top-0 z-[1] m-3 text-primary"
        >
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