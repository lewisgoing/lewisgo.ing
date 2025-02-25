// Updated API endpoint: /pages/api/spotify/data.ts
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
        } catch (err) {
          console.error('Error parsing KV data:', err);
        }
      }
      
      return res.status(200).json(data);
    }
    
    // POST request to update data
    if (req.method === 'POST') {
      if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
      }
      
      const spotifyData: SpotifyData = req.body;
      
      if (!spotifyData || !spotifyData.track_id) {
        return res.status(400).json({ error: 'Invalid Spotify data' });
      }
      
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
        console.error('KV update failed:', errorText);
        return res.status(500).json({ 
          error: `Failed to update KV store: ${updateResponse.status}`,
          details: errorText
        });
      }
      
      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message });
  }
}