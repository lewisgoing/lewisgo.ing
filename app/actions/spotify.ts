'use server';

import { revalidateTag } from 'next/cache';

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

/**
 * Server action to update Spotify data in the KV store
 */
export async function updateSpotifyAction(spotifyData: SpotifyData): Promise<{ success: boolean, error?: string }> {
  try {
    const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
    const apiKey = process.env.LANYARD_KV_KEY;
    
    if (!apiKey) {
      return { success: false, error: 'API key not configured' };
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
      const errorText = await updateResponse.text();
      console.error('KV update failed:', errorText);
      return { 
        success: false, 
        error: `Failed to update KV store: ${updateResponse.status}`
      };
    }
    
    // Revalidate the cache to ensure fresh data
    revalidateTag('spotify-data');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating Spotify data:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred'
    };
  }
}