import Image from "next/image";
import React, { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

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

  // Fetch Spotify data from our API
  const fetchSpotifyData = async () => {
    try {
      addDebug('Fetching Spotify data from API');
      
      const response = await fetch('/api/spotify/data');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      addDebug(`API returned data: ${JSON.stringify(data)}`);
      
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
      setIsLoading(true);
      addDebug('Initializing SpotifyBox component');
      
      try {
        // First try to get data from our API endpoint
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
        setIsLoading(false);
      }
    };
    
    initSpotify();
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

  if (isLoading) {
    return <p>Loading Spotify data...</p>;
  }
  
  if (!spotifyData) {
    return (
      <div>
        <p>No Spotify data available</p>
        <details className="text-xs text-gray-500 mt-2">
          <summary>Debug info</summary>
          <pre className="whitespace-pre-wrap text-xs">
            {debugInfo.join('\n')}
          </pre>
        </details>
      </div>
    );
  }

  const { song, artist, album, album_art_url, track_id } = spotifyData;

  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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