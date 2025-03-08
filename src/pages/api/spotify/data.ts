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
  // Disable caching
  res.setHeader('Cache-Control', 'no-store');
  
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  // GET request to fetch data
  if (req.method === 'GET') {
    try {
      console.log(`[Spotify API] GET request`);
      
      // Fetch Lanyard data
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
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
          result.spotify = {
            song: lanyardData.data.spotify.song,
            artist: lanyardData.data.spotify.artist,
            album: lanyardData.data.spotify.album,
            album_art_url: lanyardData.data.spotify.album_art_url,
            track_id: lanyardData.data.spotify.track_id
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
            const kvData = typeof lanyardData.data.kv.spotify_last_played === 'string' 
              ? JSON.parse(lanyardData.data.kv.spotify_last_played) 
              : lanyardData.data.kv.spotify_last_played;
            
            result.lastPlayedFromKV = {
              song: kvData.song,
              artist: kvData.artist,
              album: kvData.album,
              album_art_url: kvData.album_art_url,
              track_id: kvData.track_id
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
        }
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('[Spotify API] GET handler error:', error);
      
      return res.status(500).json({
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
      console.log(`[Spotify API] POST request`);
      
      if (!apiKey) {
        return res.status(401).json({ 
          success: false, 
          error: 'API key not configured' 
        });
      }
      
      // Validate data
      const data = req.body;
      if (!data || !data.song || !data.artist || !data.album || !data.album_art_url || !data.track_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid Spotify data' 
        });
      }
      
      // Prepare data for Lanyard API
      const spotifyData = {
        song: data.song,
        artist: data.artist,
        album: data.album,
        album_art_url: data.album_art_url,
        track_id: data.track_id
      };
      
      // Copy timestamps if present
      if (data.timestamps) {
        spotifyData.timestamps = data.timestamps;
      }
      
      // Add a timestamp to the data
      spotifyData._updated_at = Date.now();
      
      // Log the data we're sending
      console.log('[Spotify API] Sending to Lanyard:', JSON.stringify(spotifyData));
      
      // Make direct request to Lanyard API
      const lanyardUrl = `https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`;
      
      console.log(`[Spotify API] Making PUT request to: ${lanyardUrl}`);
      
      const updateResponse = await fetch(lanyardUrl, {
        method: 'PUT',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotifyData)
      });
      
      // Get response status and text
      const statusCode = updateResponse.status;
      const responseText = await updateResponse.text();
      
      console.log(`[Spotify API] Lanyard API response: ${statusCode}, ${responseText}`);
      
      if (!updateResponse.ok) {
        return res.status(200).json({ 
          success: false, 
          error: `Lanyard API error: ${statusCode}`,
          response: responseText
        });
      }
      
      return res.status(200).json({ 
        success: true,
        response: responseText || 'OK'
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