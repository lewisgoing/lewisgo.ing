// src/pages/api/spotify/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Define interfaces with proper typing
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

interface ApiResponseData {
  spotify: SpotifyData | null;
  listeningToSpotify: boolean;
  lastPlayedFromKV: SpotifyData | null;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | ApiErrorResponse | { success: boolean }>
) {
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  try {
    // GET request to fetch data
    if (req.method === 'GET') {
      // Initialize response data with safe defaults
      const responseData: ApiResponseData = {
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null
      };
      
      try {
        // Fetch user data from Lanyard with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
        
        if (!lanyardResponse.ok) {
          console.error(`[Spotify API] Lanyard API error: ${lanyardResponse.status}`);
          return res.status(200).json(responseData); // Return empty data instead of error
        }
        
        const lanyardData = await lanyardResponse.json();
        
        // Safely extract data with thorough validation
        if (lanyardData?.data) {
          // Current Spotify data
          if (lanyardData.data.listening_to_spotify && lanyardData.data.spotify) {
            const spotifyData = lanyardData.data.spotify;
            
            if (isValidSpotifyData(spotifyData)) {
              responseData.spotify = {
                song: spotifyData.song,
                artist: spotifyData.artist,
                album: spotifyData.album,
                album_art_url: spotifyData.album_art_url,
                track_id: spotifyData.track_id
              };
              
              // Add timestamps if they exist
              if (spotifyData.timestamps) {
                responseData.spotify.timestamps = spotifyData.timestamps;
              }
              
              responseData.listeningToSpotify = true;
            }
          }
          
          // KV store data (last played)
          if (lanyardData.data.kv?.spotify_last_played) {
            try {
              const kvData = typeof lanyardData.data.kv.spotify_last_played === 'string' 
                ? JSON.parse(lanyardData.data.kv.spotify_last_played)
                : lanyardData.data.kv.spotify_last_played;
              
              if (isValidSpotifyData(kvData)) {
                responseData.lastPlayedFromKV = {
                  song: kvData.song,
                  artist: kvData.artist,
                  album: kvData.album,
                  album_art_url: kvData.album_art_url,
                  track_id: kvData.track_id
                };
                
                // Add timestamps if they exist
                if (kvData.timestamps) {
                  responseData.lastPlayedFromKV.timestamps = kvData.timestamps;
                }
              }
            } catch (err) {
              console.error('[Spotify API] Error parsing KV data');
              // Don't rethrow - continue with null lastPlayedFromKV
            }
          }
        }
      } catch (fetchError) {
        console.error('[Spotify API] Error fetching from Lanyard:', fetchError);
        // Return empty data instead of error
        return res.status(200).json(responseData);
      }
      
      return res.status(200).json(responseData);
    }
    
    // POST request to update data
    if (req.method === 'POST') {
      if (!apiKey) {
        console.warn('[Spotify API] API key not configured');
        return res.status(200).json({ success: false, error: 'API key not configured' });
      }
      
      // Validate incoming data
      const body = req.body;
      
      if (!isValidSpotifyData(body)) {
        console.warn('[Spotify API] Invalid Spotify data received');
        return res.status(200).json({ success: false, error: 'Invalid Spotify data' });
      }
      
      // Construct a clean object to save
      const spotifyData: SpotifyData = {
        song: body.song,
        artist: body.artist,
        album: body.album,
        album_art_url: body.album_art_url,
        track_id: body.track_id
      };
      
      // Add timestamps if they exist
      if (body.timestamps) {
        spotifyData.timestamps = body.timestamps;
      }
      
      try {
        // Update the KV store with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const updateResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`, {
          method: 'PUT',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spotifyData),
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
        
        if (!updateResponse.ok) {
          console.error('[Spotify API] KV update failed:', updateResponse.status);
          return res.status(200).json({ 
            success: false, 
            error: `Failed to update KV store: ${updateResponse.status}`
          });
        }
        
        return res.status(200).json({ success: true });
      } catch (error: any) {
        console.error('[Spotify API] Error updating KV store:', error?.message || 'Unknown error');
        return res.status(200).json({ 
          success: false, 
          error: 'Error updating KV store'
        });
      }
    }
    
    return res.status(200).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[Spotify API] Unexpected error:', error?.message || 'Unknown error');
    // Return empty data instead of error for production resilience
    return res.status(200).json({
      spotify: null,
      listeningToSpotify: false,
      lastPlayedFromKV: null
    });
  }
}

// Helper function to validate SpotifyData
function isValidSpotifyData(data: any): data is SpotifyData {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.song === 'string' &&
    typeof data.artist === 'string' &&
    typeof data.album === 'string' &&
    typeof data.album_art_url === 'string' &&
    typeof data.track_id === 'string'
  );
}