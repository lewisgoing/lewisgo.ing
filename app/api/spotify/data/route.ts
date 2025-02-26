import { NextRequest, NextResponse } from 'next/server';

// Interface for Spotify data
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

/**
 * API endpoint to update Spotify data in the KV store
 */
export async function POST(request: NextRequest) {
  try {
    // Get API key from environment variables
    const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236';
    const apiKey = process.env.LANYARD_KV_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    // Parse the request body
    const spotifyData: SpotifyData = await request.json();
    
    if (!spotifyData || !spotifyData.track_id) {
      return NextResponse.json(
        { error: 'Invalid Spotify data' },
        { status: 400 }
      );
    }
    
    // Update the KV store using Lanyard's API
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
      return NextResponse.json(
        { error: `Failed to update KV store: ${updateResponse.status}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, timestamp: Date.now() }
    );
  } catch (error: any) {
    console.error('Error updating Spotify data:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}