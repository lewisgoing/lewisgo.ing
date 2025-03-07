// app/components/spotify/SpotifyBox.tsx
import { unstable_cacheTag as cacheTag } from 'next/cache';
import SpotifyBoxClient from './SpotifyBoxClient';

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
  spotifyData: SpotifyData;
  isCurrentlyPlaying: boolean;
  lanyard?: LanyardData;
  onLoad?: () => void;
}

// Server component that wraps the client component
export default async function SpotifyBox({ lanyard, onLoad }: SpotifyBoxProps) {
  'use cache';
  cacheTag('spotify-data');
  
  // Determine if user is currently playing Spotify
  const isCurrentlyPlaying = lanyard?.data?.listening_to_spotify || false;
  
  // Get the spotify data from lanyard
  let spotifyData: SpotifyData | null = null;
  
  if (isCurrentlyPlaying && lanyard?.data?.spotify) {
    // User is actively listening, use Lanyard data
    spotifyData = lanyard.data.spotify;
  } else if (lanyard?.data?.kv?.spotify_last_played) {
    // Try to use last played from KV
    try {
      spotifyData = JSON.parse(lanyard.data.kv.spotify_last_played);
    } catch (error) {
      console.error('Error parsing KV data:', error);
    }
  }
  
  // If we have spotifyData, render the client component
  if (spotifyData) {
    return (
      <SpotifyBoxClient 
        spotifyData={spotifyData} 
        isCurrentlyPlaying={isCurrentlyPlaying}
        onLoad={onLoad}
      />
    );
  }
  
  // If no data available, return empty div
  return <div className="h-full w-full opacity-0"></div>;
}