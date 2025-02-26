// components/boxes/spotify-data.ts
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

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

// Interface for API response
interface ApiResponse {
  spotify: SpotifyData | null;
  listeningToSpotify: boolean;
  lastPlayedFromKV: SpotifyData | null;
  error?: string;
}

/**
 * Fetches Spotify data from the API with server-side caching
 */
export async function getSpotifyData(): Promise<ApiResponse | null> {
  'use cache';
  
  // Apply caching profile and tag
  cacheLife('spotify');
  cacheTag('spotify-data');
  
  try {
    // Get userId from environment
    const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
    
    // Fetch directly from Lanyard API
    const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
      next: { tags: ['spotify-data'] }
    });
    
    if (!lanyardResponse.ok) {
      throw new Error(`Lanyard API error: ${lanyardResponse.status}`);
    }
    
    const lanyardData = await lanyardResponse.json();
    
    // Extract relevant data
    const data: ApiResponse = {
      spotify: lanyardData?.data?.spotify || null,
      listeningToSpotify: lanyardData?.data?.listening_to_spotify || false,
      lastPlayedFromKV: null
    };
    
    // Try to parse last played data from KV store
    if (lanyardData?.data?.kv?.spotify_last_played) {
      try {
        data.lastPlayedFromKV = JSON.parse(lanyardData.data.kv.spotify_last_played);
      } catch (err) {
        console.error('Error parsing KV data:', err);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return null;
  }
}

/**
 * Updates the Spotify data in the KV store
 */
export async function updateSpotifyData(spotifyData: SpotifyData): Promise<boolean> {
  try {
    const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
    const apiKey = process.env.LANYARD_KV_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    
    // Update the KV store using Lanyard's API
    const updateResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`, {
      method: 'PUT',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spotifyData)
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Failed to update KV store: ${updateResponse.status}`);
    }
    
    // Revalidate the cache by calling our revalidation API
    await fetch('/api/revalidate?tag=spotify-data');
    
    return true;
  } catch (error) {
    console.error('Error updating Spotify data:', error);
    return false;
  }
}