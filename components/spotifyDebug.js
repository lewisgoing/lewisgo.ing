// components/SpotifyDebug.js
import React, { useState } from 'react';

const SpotifyDebug = ({ lanyard }) => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleManualUpdate = async () => {
    setLoading(true);
    try {
      // Get data from KV or use a sample
      let testData;
      
      if (lanyard?.data?.kv?.spotify_last_played) {
        testData = JSON.parse(lanyard.data.kv.spotify_last_played);
      } else if (lanyard?.data?.spotify) {
        testData = lanyard.data.spotify;
      } else {
        // Fallback sample data
        testData = {
          song: "Test Song",
          artist: "Test Artist",
          album: "Test Album",
          album_art_url: "https://via.placeholder.com/300",
          track_id: "testid123",
          timestamps: {
            start: Date.now(),
            end: Date.now() + 180000 // 3 minutes later
          }
        };
      }
      
      const response = await fetch('/api/spotify/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const showLanyardData = () => {
    try {
      setResult(JSON.stringify({
        hasLanyard: Boolean(lanyard),
        hasData: Boolean(lanyard?.data),
        isListening: Boolean(lanyard?.data?.listening_to_spotify),
        hasSpotify: Boolean(lanyard?.data?.spotify),
        hasKV: Boolean(lanyard?.data?.kv),
        hasLastPlayed: Boolean(lanyard?.data?.kv?.spotify_last_played),
        kvContent: lanyard?.data?.kv?.spotify_last_played 
          ? JSON.parse(lanyard.data.kv.spotify_last_played) 
          : null
      }, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="p-4 border rounded-md mt-4">
      <h3 className="font-bold mb-2">Spotify Debug</h3>
      <div className="flex gap-2 mb-4">
        <button 
          onClick={handleManualUpdate}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Force Update KV Store'}
        </button>
        <button 
          onClick={showLanyardData}
          className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Show Lanyard Data
        </button>
      </div>
      
      {result && (
        <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-60">
          {result}
        </pre>
      )}
    </div>
  );
};

export default SpotifyDebug;