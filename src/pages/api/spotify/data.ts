// src/pages/api/spotify/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

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
  // Add a timestamp to help with versioning
  _updated_at?: number;
}

interface ApiResponseData {
  spotify: SpotifyData | null;
  listeningToSpotify: boolean;
  lastPlayedFromKV: SpotifyData | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Always return 200 status in production to prevent client-side errors
  // Use the response body to indicate errors instead
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  // GET request to fetch data
  if (req.method === 'GET') {
    try {
      // Fetch from Lanyard with timeout
      const lanyardData = await fetchLanyardData(userId);
      
      // Build response with safeguards
      const response: ApiResponseData = {
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null
      };
      
      // Check if currently listening
      if (lanyardData?.data?.listening_to_spotify && lanyardData.data.spotify) {
        const spotifyData = lanyardData.data.spotify;
        
        if (isValidSpotifyData(spotifyData)) {
          response.spotify = sanitizeSpotifyData(spotifyData);
          response.listeningToSpotify = true;
        }
      }
      
      // Get last played from KV
      if (lanyardData?.data?.kv?.spotify_last_played) {
        try {
          const kvRaw = lanyardData.data.kv.spotify_last_played;
          const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
          
          if (isValidSpotifyData(kvData)) {
            response.lastPlayedFromKV = sanitizeSpotifyData(kvData);
          }
        } catch (error) {
          console.error('[Spotify API] Error parsing KV data:', error);
        }
      }
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('[Spotify API] GET error:', error);
      
      // Return empty data on error
      return res.status(200).json({
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null
      });
    }
  }
  
  // POST request to update KV store
  if (req.method === 'POST') {
    try {
      if (!apiKey) {
        return res.status(200).json({ 
          success: false, 
          error: 'API key not configured'
        });
      }
      
      // Validate and sanitize input data
      const data = req.body;
      
      if (!isValidSpotifyData(data)) {
        return res.status(200).json({ 
          success: false, 
          error: 'Invalid Spotify data'
        });
      }
      
      // Add timestamp for versioning
      const spotifyData = sanitizeSpotifyData(data);
      spotifyData._updated_at = Date.now();
      
      // Update KV store with proper error handling
      const success = await updateKVStore(userId, apiKey, spotifyData);
      
      return res.status(200).json({ success });
    } catch (error) {
      console.error('[Spotify API] POST error:', error);
      return res.status(200).json({ 
        success: false, 
        error: 'Internal server error'
      });
    }
  }
  
  // Method not allowed
  return res.status(200).json({ 
    success: false, 
    error: 'Method not allowed' 
  });
}

// Helper function to fetch Lanyard data with timeout
async function fetchLanyardData(userId: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Lanyard API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Spotify API] Error fetching Lanyard data:', error);
    return null;
  }
}

// Helper function to update KV store with proper error handling
async function updateKVStore(userId: string, apiKey: string, data: SpotifyData): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`, {
      method: 'PUT',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    return response.ok;
  } catch (error) {
    console.error('[Spotify API] Error updating KV store:', error);
    return false;
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

// Helper function to create a clean SpotifyData object
function sanitizeSpotifyData(data: any): SpotifyData {
  const sanitized: SpotifyData = {
    song: String(data.song),
    artist: String(data.artist),
    album: String(data.album),
    album_art_url: String(data.album_art_url),
    track_id: String(data.track_id)
  };
  
  // Copy timestamps if they exist
  if (data.timestamps && 
      typeof data.timestamps === 'object' &&
      typeof data.timestamps.start === 'number') {
    sanitized.timestamps = {
      start: data.timestamps.start,
      end: data.timestamps.end || 0
    };
  }
  
  // Copy _updated_at if it exists
  if (data._updated_at && typeof data._updated_at === 'number') {
    sanitized._updated_at = data._updated_at;
  }
  
  return sanitized;
}