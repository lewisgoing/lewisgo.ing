// src/pages/api/spotify/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Cache settings
const CACHE_DURATION = 30 * 1000; // 30 seconds in milliseconds
let cachedData: any = null;
let lastFetchTime = 0;

// Keep track of KV update operations
let lastKvUpdateTime = 0;
let pendingKvUpdate = false;

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  try {
    // GET request to fetch data
    if (req.method === 'GET') {
      // Check if we have cached data that's still fresh
      const now = Date.now();
      if (cachedData && now - lastFetchTime < CACHE_DURATION) {
        console.log('[Spotify API] Returning cached Spotify data');
        return res.status(200).json(cachedData);
      }
      
      console.log('[Spotify API] Fetching fresh Spotify data from Lanyard');
      
      // Fetch fresh data from Lanyard
      const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      
      if (!lanyardResponse.ok) {
        throw new Error(`Lanyard API error: ${lanyardResponse.status}`);
      }
      
      const lanyardData = await lanyardResponse.json();
      
      // Extract relevant data
      const data = {
        spotify: lanyardData?.data?.spotify || null,
        listeningToSpotify: lanyardData?.data?.listening_to_spotify || false,
        lastPlayedFromKV: null
      };
      
      // Try to parse last played data from KV store
      if (lanyardData?.data?.kv?.spotify_last_played) {
        try {
          data.lastPlayedFromKV = JSON.parse(lanyardData.data.kv.spotify_last_played);
          console.log('[Spotify API] Found last played track in KV store:', data.lastPlayedFromKV.song);
        } catch (err) {
          console.error('[Spotify API] Error parsing KV data:', err);
        }
      }
      
      // Update cache
      cachedData = data;
      lastFetchTime = now;
      
      return res.status(200).json(data);
    }
    
    // POST request to update data
    if (req.method === 'POST') {
      if (!apiKey) {
        console.error('[Spotify API] API key not configured');
        return res.status(500).json({ error: 'API key not configured' });
      }
      
      const spotifyData: SpotifyData = req.body;
      
      if (!spotifyData || !spotifyData.track_id) {
        return res.status(400).json({ error: 'Invalid Spotify data' });
      }
      
      // Rate limit KV updates to prevent spam
      const now = Date.now();
      if (pendingKvUpdate || (now - lastKvUpdateTime < 5000)) {
        console.log('[Spotify API] Skipping KV update, too frequent or pending update in progress');
        return res.status(200).json({ 
          success: true, 
          message: 'Skipped update due to rate limiting' 
        });
      }
      
      console.log(`[Spotify API] Updating KV store with track: ${spotifyData.song}`);
      pendingKvUpdate = true;
      
      try {
        // Update the KV store
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
          console.error('[Spotify API] KV update failed:', errorText);
          pendingKvUpdate = false;
          return res.status(500).json({ 
            error: `Failed to update KV store: ${updateResponse.status}`,
            details: errorText
          });
        }
        
        console.log('[Spotify API] KV store updated successfully with song:', spotifyData.song);
        
        // Track the update time
        lastKvUpdateTime = now;
        pendingKvUpdate = false;
        
        // Invalidate cache after successful update
        cachedData = null;
        
        return res.status(200).json({ 
          success: true,
          message: 'KV store updated successfully'
        });
      } catch (error) {
        pendingKvUpdate = false;
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[Spotify API] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}