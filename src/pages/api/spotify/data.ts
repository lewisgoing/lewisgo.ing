// src/pages/api/spotify/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * TypeScript interfaces for Spotify data
 */
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
  _updated_at?: number;
}

interface ApiResponseData {
  spotify: SpotifyData | null;
  listeningToSpotify: boolean;
  lastPlayedFromKV: SpotifyData | null;
}

/**
 * API handler for Spotify data
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CRITICAL FIX: Ensure no caching happens for this endpoint
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Get environment variables with proper validation
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID;
  if (!userId) {
    console.error('[Spotify API] Missing NEXT_PUBLIC_LANYARD_USER_ID');
    return res.status(500).json({ 
      success: false, 
      error: 'Lanyard user ID not configured' 
    });
  }
  
  const apiKey = process.env.LANYARD_KV_KEY;
  
  // GET request to fetch data
  if (req.method === 'GET') {
    try {
      console.log(`[Spotify API] GET request for user ${userId}`);
      
      // Fetch Lanyard data
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Lanyard API error: ${response.status}`);
      }
      
      const lanyardData = await response.json();
      
      // Prepare response
      const result: ApiResponseData = {
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null
      };
      
      // Process Lanyard data
      if (lanyardData?.data) {
        // Check if currently listening
        if (lanyardData.data.listening_to_spotify && lanyardData.data.spotify) {
          console.log('[Spotify API] User is currently listening to Spotify');
          
          result.spotify = {
            song: lanyardData.data.spotify.song,
            artist: lanyardData.data.spotify.artist,
            album: lanyardData.data.spotify.album,
            album_art_url: lanyardData.data.spotify.album_art_url,
            track_id: lanyardData.data.spotify.track_id,
            _updated_at: Date.now()
          };
          
          if (lanyardData.data.spotify.timestamps) {
            result.spotify.timestamps = {
              start: lanyardData.data.spotify.timestamps.start,
              end: lanyardData.data.spotify.timestamps.end || 0
            };
          }
          
          result.listeningToSpotify = true;
        }
        
        // Get last played from KV
        if (lanyardData.data.kv?.spotify_last_played) {
          try {
            // CRITICAL FIX: Handle both string and object formats
            const kvData = typeof lanyardData.data.kv.spotify_last_played === 'string' 
              ? JSON.parse(lanyardData.data.kv.spotify_last_played) 
              : lanyardData.data.kv.spotify_last_played;
            
            console.log(`[Spotify API] Found last played in KV: ${kvData.song} (${kvData.track_id})`);
            
            result.lastPlayedFromKV = {
              song: kvData.song,
              artist: kvData.artist,
              album: kvData.album,
              album_art_url: kvData.album_art_url,
              track_id: kvData.track_id,
              _updated_at: kvData._updated_at || Date.now()
            };
            
            if (kvData.timestamps) {
              result.lastPlayedFromKV.timestamps = {
                start: kvData.timestamps.start,
                end: kvData.timestamps.end || 0
              };
            }
          } catch (error) {
            console.error('[Spotify API] Error parsing KV data:', error);
          }
        } else {
          console.log('[Spotify API] No last played data found in KV');
        }
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('[Spotify API] GET handler error:', error);
      
      return res.status(500).json({
        success: false,
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // POST request to update KV store
  if (req.method === 'POST') {
    try {
      console.log(`[Spotify API] POST request to update KV store`);
      
      if (!apiKey) {
        console.error('[Spotify API] Missing LANYARD_KV_KEY');
        return res.status(401).json({ 
          success: false, 
          error: 'API key not configured' 
        });
      }
      
      // Validate data
      const data = req.body;
      if (!data || !data.song || !data.artist || !data.album || !data.album_art_url || !data.track_id) {
        console.error('[Spotify API] Invalid data received:', data);
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid Spotify data' 
        });
      }
      
      // Prepare data for Lanyard API
      const spotifyData: SpotifyData = {
        song: data.song,
        artist: data.artist,
        album: data.album,
        album_art_url: data.album_art_url,
        track_id: data.track_id,
        _updated_at: data._updated_at || Date.now()
      };
      
      // Copy timestamps if present
      if (data.timestamps) {
        spotifyData.timestamps = data.timestamps;
      }
      
      // Log the data we're sending
      console.log('[Spotify API] Sending to Lanyard KV:', JSON.stringify({
        song: spotifyData.song,
        artist: spotifyData.artist,
        track_id: spotifyData.track_id,
        _updated_at: spotifyData._updated_at
      }));
      
      // Make direct request to Lanyard API with proper error handling
      const lanyardUrl = `https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`;
      
      console.log(`[Spotify API] Making PUT request to: ${lanyardUrl}`);
      
      // CRITICAL FIX: Better request handling and retry logic
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      let lastError = '';
      
      while (retries <= maxRetries && !success) {
        try {
          if (retries > 0) {
            console.log(`[Spotify API] Retry attempt ${retries}/${maxRetries}`);
            // Small delay between retries
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          const updateResponse = await fetch(lanyardUrl, {
            method: 'PUT',
            headers: {
              'Authorization': apiKey,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            body: JSON.stringify(spotifyData)
          });
          
          // Get response status and text
          const statusCode = updateResponse.status;
          const responseText = await updateResponse.text();
          
          console.log(`[Spotify API] Lanyard API response: ${statusCode}, ${responseText}`);
          
          if (updateResponse.ok) {
            success = true;
            return res.status(200).json({ 
              success: true,
              response: responseText || 'OK',
              track_id: spotifyData.track_id
            });
          } else {
            lastError = `Lanyard API error: ${statusCode} - ${responseText}`;
            retries++;
          }
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[Spotify API] Error during request attempt ${retries}:`, lastError);
          retries++;
        }
      }
      
      // If we got here, all retries failed
      console.error('[Spotify API] All retry attempts failed:', lastError);
      return res.status(500).json({ 
        success: false, 
        error: lastError || 'Failed after max retries',
        attempted_track_id: spotifyData.track_id 
      });
      
    } catch (error) {
      console.error('[Spotify API] POST handler error:', error);
      
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed'
  });
}