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
  debug?: any;
  error?: string;
}

// Store last known track for comparison to prevent duplicate updates
let lastKnownTrackId: string | null = null;
let lastUpdateTime: number = 0;

/**
 * API handler for Spotify data
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // IMPORTANT: Disable caching for this endpoint
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  // Debug information to include in response
  const debugInfo: any = {
    timestamp: Date.now(),
    method: req.method,
    lastKnownTrackId,
    lastUpdateTime,
    apiKeyPresent: !!apiKey,
    requestHeaders: req.headers
  };
  
  // GET request to fetch data
  if (req.method === 'GET') {
    try {
      console.log(`[Spotify API] GET request at ${new Date().toISOString()}`);
      
      // Fetch Lanyard data with timeout and cache busting
      const lanyardData = await fetchLanyardData(userId);
      debugInfo.lanyardSuccess = !!lanyardData;
      
      if (!lanyardData) {
        throw new Error('Failed to fetch Lanyard data');
      }
      
      // Prepare response
      const response: ApiResponseData = {
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null,
        debug: debugInfo
      };
      
      // Process Lanyard data
      if (lanyardData.data) {
        debugInfo.lanyardDataPresent = true;
        
        // Check if currently listening
        if (lanyardData.data.listening_to_spotify && lanyardData.data.spotify) {
          debugInfo.currentlyListening = true;
          const spotifyData = lanyardData.data.spotify;
          
          if (isValidSpotifyData(spotifyData)) {
            response.spotify = sanitizeSpotifyData(spotifyData);
            response.listeningToSpotify = true;
            
            // Check if this is a different track than last known
            const currentTrackId = spotifyData.track_id;
            debugInfo.currentTrackId = currentTrackId;
            
            if (currentTrackId !== lastKnownTrackId) {
              debugInfo.trackChanged = true;
              
              // Update last known track
              lastKnownTrackId = currentTrackId;
              lastUpdateTime = Date.now();
              
              // Background KV update for currently playing track
              if (apiKey) {
                try {
                  console.log(`[Spotify API] Background KV update for currently playing track: ${spotifyData.song}`);
                  
                  // Force immediate KV update for currently playing
                  const updateResult = await updateKVStore(userId, apiKey, response.spotify);
                  debugInfo.forceKvUpdateResult = updateResult;
                  
                  console.log(`[Spotify API] KV update result: ${updateResult ? 'success' : 'failure'}`);
                } catch (err) {
                  console.error('[Spotify API] Background KV update error:', err);
                  debugInfo.kvUpdateError = err instanceof Error ? err.message : String(err);
                }
              }
            }
          } else {
            debugInfo.invalidSpotifyData = true;
          }
        } else {
          debugInfo.currentlyListening = false;
        }
        
        // Get last played from KV
        if (lanyardData.data.kv?.spotify_last_played) {
          try {
            const kvRaw = lanyardData.data.kv.spotify_last_played;
            const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
            debugInfo.kvDataPresent = true;
            
            if (isValidSpotifyData(kvData)) {
              response.lastPlayedFromKV = sanitizeSpotifyData(kvData);
              debugInfo.lastPlayedTrackId = kvData.track_id;
              
              // If we don't have a current track, update last known track from KV
              if (!lastKnownTrackId && kvData.track_id) {
                lastKnownTrackId = kvData.track_id;
                debugInfo.lastKnownTrackIdUpdatedFromKV = true;
              }
            } else {
              debugInfo.invalidKvData = true;
            }
          } catch (error) {
            console.error('[Spotify API] Error parsing KV data:', error);
            debugInfo.kvParseError = error instanceof Error ? error.message : String(error);
          }
        } else {
          debugInfo.kvDataPresent = false;
        }
      } else {
        debugInfo.lanyardDataPresent = false;
      }
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('[Spotify API] GET handler error:', error);
      
      return res.status(200).json({
        spotify: null,
        listeningToSpotify: false,
        lastPlayedFromKV: null,
        debug: {
          ...debugInfo,
          error: error instanceof Error ? error.message : String(error)
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // POST request to update KV store
  if (req.method === 'POST') {
    try {
      console.log(`[Spotify API] POST request at ${new Date().toISOString()}`);
      
      if (!apiKey) {
        return res.status(200).json({ 
          success: false, 
          error: 'API key not configured',
          debug: debugInfo
        });
      }
      
      // Validate and sanitize input data
      const data = req.body;
      debugInfo.receivedData = {
        track_id: data?.track_id,
        song: data?.song
      };
      
      if (!isValidSpotifyData(data)) {
        return res.status(200).json({ 
          success: false, 
          error: 'Invalid Spotify data',
          debug: debugInfo
        });
      }
      
      // Prepare sanitized data with timestamp
      const spotifyData = sanitizeSpotifyData(data);
      spotifyData._updated_at = Date.now();
      
      debugInfo.sanitizedData = {
        track_id: spotifyData.track_id,
        song: spotifyData.song,
        _updated_at: spotifyData._updated_at
      };
      
      // Check if this is a different track than last known
      if (spotifyData.track_id !== lastKnownTrackId || 
         (Date.now() - lastUpdateTime > 300000)) { // Force update every 5 minutes
        debugInfo.trackChanged = spotifyData.track_id !== lastKnownTrackId;
        debugInfo.timeThresholdExceeded = Date.now() - lastUpdateTime > 300000;
        
        console.log(`[Spotify API] Updating KV store with track: ${spotifyData.song} (ID: ${spotifyData.track_id})`);
        
        // Update KV store with retry logic
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!success && attempts < maxAttempts) {
          attempts++;
          debugInfo.updateAttempt = attempts;
          
          try {
            console.log(`[Spotify API] KV update attempt ${attempts}/${maxAttempts}`);
            success = await updateKVStore(userId, apiKey, spotifyData);
            
            if (success) {
              // Update last known track
              lastKnownTrackId = spotifyData.track_id;
              lastUpdateTime = Date.now();
              debugInfo.kvUpdateSuccess = true;
              
              console.log(`[Spotify API] KV update successful for track: ${spotifyData.song}`);
              break;
            } else {
              console.error(`[Spotify API] KV update failed, attempt ${attempts}/${maxAttempts}`);
              
              // Wait before retry (exponential backoff)
              if (attempts < maxAttempts) {
                const delay = Math.pow(2, attempts) * 500;
                console.log(`[Spotify API] Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }
          } catch (error) {
            console.error(`[Spotify API] KV update error on attempt ${attempts}:`, error);
            debugInfo[`kvUpdateError_${attempts}`] = error instanceof Error ? error.message : String(error);
            
            // Wait before retry
            if (attempts < maxAttempts) {
              const delay = Math.pow(2, attempts) * 500;
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
        
        debugInfo.finalAttempt = attempts;
        debugInfo.finalSuccess = success;
        
        return res.status(200).json({ 
          success, 
          debug: debugInfo
        });
      } else {
        // No update needed
        debugInfo.noUpdateNeeded = true;
        console.log(`[Spotify API] No KV update needed, track unchanged: ${spotifyData.song}`);
        
        return res.status(200).json({ 
          success: true, 
          skipped: true,
          debug: debugInfo
        });
      }
    } catch (error) {
      console.error('[Spotify API] POST handler error:', error);
      
      return res.status(200).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          ...debugInfo,
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed',
    debug: debugInfo
  });
}

/**
 * Helper function to fetch Lanyard data with timeout
 */
async function fetchLanyardData(userId: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Lanyard API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Spotify API] Error fetching Lanyard data:', error);
    throw error;
  }
}

/**
 * Helper function to update KV store with detailed logging
 */
async function updateKVStore(
  userId: string,
  apiKey: string,
  data: SpotifyData
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Longer timeout
    
    console.log(`[Spotify API] Sending KV update for track: ${data.song} (${data.track_id})`);
    
    const requestBody = JSON.stringify(data);
    console.log(`[Spotify API] KV update request body length: ${requestBody.length} bytes`);
    
    const start = Date.now();
    
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`,
      {
        method: 'PUT',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: requestBody,
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    const duration = Date.now() - start;
    console.log(`[Spotify API] KV update response received in ${duration}ms: ${response.status}`);
    
    if (!response.ok) {
      let responseText;
      try {
        responseText = await response.text();
      } catch (e) {
        responseText = 'Could not read response text';
      }
      
      console.error(`[Spotify API] KV update failed with status ${response.status}: ${responseText}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Spotify API] KV update error:', error);
    return false;
  }
}

/**
 * Helper function to validate SpotifyData
 */
function isValidSpotifyData(data: any): data is SpotifyData {
  const valid = data &&
    typeof data === 'object' &&
    typeof data.song === 'string' &&
    typeof data.artist === 'string' &&
    typeof data.album === 'string' &&
    typeof data.album_art_url === 'string' &&
    typeof data.track_id === 'string';
  
  if (!valid) {
    console.log('[Spotify API] Invalid Spotify data:', data);
  }
  
  return valid;
}

/**
 * Helper function to create a clean SpotifyData object
 */
function sanitizeSpotifyData(data: any): SpotifyData {
  const sanitized: SpotifyData = {
    song: String(data.song || ''),
    artist: String(data.artist || ''),
    album: String(data.album || ''),
    album_art_url: String(data.album_art_url || ''),
    track_id: String(data.track_id || '')
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