// src/services/spotify-service.ts

/**
 * A service for interacting with the Spotify API and Lanyard KV store.
 * This is designed to work with both Pages Router and App Router.
 */

// Types
export interface SpotifyData {
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
  
  export interface SpotifyResponse {
    spotify: SpotifyData | null;
    listeningToSpotify: boolean;
    lastPlayedFromKV: SpotifyData | null;
  }
  
  /**
   * Fetches Spotify data from the API
   * @returns Promise with Spotify data
   */
  export async function fetchSpotifyData(): Promise<SpotifyResponse> {
    try {
      const response = await fetch('/api/spotify/data');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      return {
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null
      };
    }
  }
  
  /**
   * Updates the KV store with track data
   * @param trackData The Spotify track data to store
   * @returns Promise<boolean> Success status
   */
  export async function updateKVStore(trackData: SpotifyData): Promise<boolean> {
    try {
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
      
      return true;
    } catch (error) {
      console.error(`Error updating KV store:`, error);
      return false;
    }
  }
  
  /**
   * Gets the Lanyard user ID from environment or falls back to default
   * @returns The Lanyard user ID
   */
  export function getLanyardUserId(): string {
    return process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  }
  
  // Helper function to format track data from Lanyard
  export function formatSpotifyData(rawData: any): SpotifyData | null {
    if (!rawData) return null;
    
    return {
      song: rawData.song || '',
      artist: rawData.artist || '',
      album: rawData.album || '',
      album_art_url: rawData.album_art_url || '',
      track_id: rawData.track_id || '',
      timestamps: rawData.timestamps || undefined
    };
  }