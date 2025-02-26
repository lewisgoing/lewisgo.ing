'use client';

import { useEffect, useRef } from 'react';

// Interface for Spotify data
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

interface SpotifyUpdateHandlerProps {
  lanyard: LanyardData;
}

/**
 * This is an invisible component that watches for Spotify updates
 * and triggers the server action to update the KV store when needed.
 */
export default function SpotifyUpdateHandler({ lanyard }: SpotifyUpdateHandlerProps) {
  const lastTrackIdRef = useRef<string | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // If the user is currently listening to Spotify
    if (lanyard?.data?.listening_to_spotify && lanyard?.data?.spotify) {
      const currentTrackId = lanyard.data.spotify.track_id;
      
      // Only update if it's a new track
      if (currentTrackId && currentTrackId !== lastTrackIdRef.current) {
        // Update the ref to the current track
        lastTrackIdRef.current = currentTrackId;
        
        // Clear any previous timeout
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
        
        // Set a debounced timeout to update the KV store
        updateTimeoutRef.current = setTimeout(async () => {
          try {
            // Call the update API endpoint
            const response = await fetch('/api/spotify/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(lanyard.data.spotify)
            });
            
            if (!response.ok) {
              throw new Error(`Failed to update: ${response.status}`);
            }
            
            console.log('Updated KV store with new track:', lanyard.data.spotify!.song);
            
            // Revalidate the tag
            await fetch('/api/revalidate?tag=spotify-data');
          } catch (error) {
            console.error('Failed to update Spotify data:', error);
          }
        }, 1000); // 1 second debounce time
      }
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [lanyard?.data?.listening_to_spotify, lanyard?.data?.spotify]);
  
  // This component doesn't render anything
  return null;
}