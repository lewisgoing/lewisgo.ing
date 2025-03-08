// src/pages/api/spotify/debug.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * This is a diagnostic API that directly checks and updates the Lanyard KV store
 * Use it to understand exactly what's happening with the KV update process
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Disable all caching
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
  const apiKey = process.env.LANYARD_KV_KEY;
  
  // Debug info to collect
  const debug = {
    timestamp: new Date().toISOString(),
    userId,
    apiKeyPresent: !!apiKey,
    lanyard: null as any,
    kvContents: null as any,
    action: req.query.action || 'check',
    updateResult: null as any,
    testSong: req.query.song || 'Test Song',
    error: null as any
  };
  
  try {
    // Step 1: Get current Lanyard data
    console.log(`[Spotify Debug] Fetching Lanyard data for ${userId}`);
    const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!lanyardResponse.ok) {
      throw new Error(`Lanyard API error: ${lanyardResponse.status}`);
    }
    
    const lanyardData = await lanyardResponse.json();
    debug.lanyard = {
      success: lanyardData.success,
      listening: lanyardData.data?.listening_to_spotify,
      currentSong: lanyardData.data?.spotify?.song,
      hasKV: !!lanyardData.data?.kv?.spotify_last_played
    };
    
    // Parse KV data if available
    if (lanyardData.data?.kv?.spotify_last_played) {
      try {
        const kvRaw = lanyardData.data.kv.spotify_last_played;
        const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
        debug.kvContents = {
          song: kvData.song,
          artist: kvData.artist,
          track_id: kvData.track_id,
          _updated_at: kvData._updated_at
        };
      } catch (error) {
        debug.kvContents = { error: 'Failed to parse KV data' };
      }
    }
    
    // Step 2: If instructed to update, force an update to the KV store
    if (req.query.action === 'update' && apiKey) {
      console.log(`[Spotify Debug] Forcing KV update with test song: ${debug.testSong}`);
      
      // Use current Spotify data if available, otherwise create test data
      let updateData;
      
      if (lanyardData.data?.listening_to_spotify && lanyardData.data?.spotify) {
        // Use real current data
        updateData = {
          song: lanyardData.data.spotify.song,
          artist: lanyardData.data.spotify.artist,
          album: lanyardData.data.spotify.album,
          album_art_url: lanyardData.data.spotify.album_art_url,
          track_id: lanyardData.data.spotify.track_id,
          _updated_at: Date.now()
        };
      } else {
        // Create test data
        updateData = {
          song: `${debug.testSong} (${Date.now()})`,
          artist: "Debug Artist",
          album: "Debug Album",
          album_art_url: "https://i.scdn.co/image/ab67616d0000b2731c0bcf8b536295370b8346c8",
          track_id: "1234567890",
          _updated_at: Date.now()
        };
      }
      
      // Make direct request to update KV
      const updateResponse = await fetch(
        `https://api.lanyard.rest/v1/users/${userId}/kv/spotify_last_played`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      );
      
      debug.updateResult = {
        status: updateResponse.status,
        ok: updateResponse.ok
      };
      
      try {
        const updateResponseText = await updateResponse.text();
        debug.updateResult.response = updateResponseText;
      } catch (e) {
        debug.updateResult.response = 'Could not read response text';
      }
    }
    
    // Step 3: Fetch Lanyard data again to see if update worked
    if (req.query.action === 'update') {
      console.log('[Spotify Debug] Checking if KV update worked');
      
      // Add a small delay to allow for update to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const verifyResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        
        debug.verification = {
          success: verifyData.success,
          hasKV: !!verifyData.data?.kv?.spotify_last_played
        };
        
        // Parse KV data if available
        if (verifyData.data?.kv?.spotify_last_played) {
          try {
            const kvRaw = verifyData.data.kv.spotify_last_played;
            const kvData = typeof kvRaw === 'string' ? JSON.parse(kvRaw) : kvRaw;
            debug.verification.kvContents = {
              song: kvData.song,
              artist: kvData.artist,
              track_id: kvData.track_id,
              _updated_at: kvData._updated_at
            };
          } catch (error) {
            debug.verification.kvParseError = 'Failed to parse KV data after update';
          }
        }
      } else {
        debug.verification = { error: 'Failed to verify after update' };
      }
    }
    
    return res.status(200).json(debug);
  } catch (error) {
    console.error('[Spotify Debug] Error:', error);
    
    debug.error = error instanceof Error ? 
      { message: error.message, stack: error.stack } : 
      String(error);
    
    return res.status(500).json(debug);
  }
}