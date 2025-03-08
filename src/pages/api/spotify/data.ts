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
}

type ApiResponseData = {
  spotify: SpotifyData | null;
  listeningToSpotify: boolean;
  lastPlayedFromKV: SpotifyData | null;
};

type ApiErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | ApiErrorResponse | { success: boolean }>
) {
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  try {
    // GET request to fetch data
    if (req.method === 'GET') {
      // Fetch user data from Lanyard
      const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      
      if (!lanyardResponse.ok) {
        throw new Error(`Lanyard API error: ${lanyardResponse.status}`);
      }
      
      const lanyardData = await lanyardResponse.json();
      
      // Extract relevant data with strong typing
      const responseData: ApiResponseData = {
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null
      };
      
      // Safely assign properties with optional chaining
      if (lanyardData?.data) {
        responseData.spotify = lanyardData.data.spotify || null;
        responseData.listeningToSpotify = !!lanyardData.data.listening_to_spotify;
        
        // Parse KV data with extra safety checks
        const kvData = lanyardData.data.kv?.spotify_last_played;
        if (typeof kvData === 'string') {
          try {
            const parsed = JSON.parse(kvData);
            
            // Validate parsed data structure
            if (parsed && 
                typeof parsed === 'object' && 
                typeof parsed.song === 'string' &&
                typeof parsed.artist === 'string' &&
                typeof parsed.album === 'string' &&
                typeof parsed.album_art_url === 'string' &&
                typeof parsed.track_id === 'string') {
              
              // Construct a clean object with only the expected properties
              responseData.lastPlayedFromKV = {
                song: parsed.song,
                artist: parsed.artist,
                album: parsed.album,
                album_art_url: parsed.album_art_url,
                track_id: parsed.track_id
              };
              
              // Include timestamps if they exist
              if (parsed.timestamps) {
                responseData.lastPlayedFromKV.timestamps = parsed.timestamps;
              }
              
              // Use safe logging to avoid potential issues
              console.log('[Spotify API] Found last played track in KV store');
            } else {
              console.log('[Spotify API] KV data exists but has invalid format');
            }
          } catch (err) {
            console.error('[Spotify API] Error parsing KV data');
          }
        }
      }
      
      return res.status(200).json(responseData);
    }
    
    // POST request to update data
    if (req.method === 'POST') {
      if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
      }
      
      // Validate incoming data
      const spotifyData = req.body as unknown;
      
      // Type guard for SpotifyData
      if (!spotifyData || 
          typeof spotifyData !== 'object' || 
          !('track_id' in spotifyData) ||
          typeof spotifyData['track_id'] !== 'string' ||
          !('song' in spotifyData) ||
          typeof spotifyData['song'] !== 'string' ||
          !('artist' in spotifyData) ||
          typeof spotifyData['artist'] !== 'string' ||
          !('album' in spotifyData) ||
          typeof spotifyData['album'] !== 'string' ||
          !('album_art_url' in spotifyData) ||
          typeof spotifyData['album_art_url'] !== 'string') {
        return res.status(400).json({ error: 'Invalid Spotify data' });
      }
      
      // Safe casting after validation
      const validatedData = spotifyData as SpotifyData;
      
      // Update the KV store
      try {
        const updateResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`, {
          method: 'PUT',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(validatedData)
        });
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          return res.status(500).json({ 
            error: `Failed to update KV store: ${updateResponse.status}`,
            details: errorText
          });
        }
        
        return res.status(200).json({ success: true });
      } catch (error: any) {
        return res.status(500).json({ 
          error: 'Error updating KV store',
          details: error.message 
        });
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error?.message || 'Unknown error');
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}