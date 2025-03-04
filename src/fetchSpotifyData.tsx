// src/fetchSpotifyData.tsx
import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  'use cache'; // Add the 'use cache' directive at the function level

  const response = await fetch('/api/spotify/data');
  const { items } = await response.json();
  // const response = await fetch(TOKEN_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Basic ${basic}`,
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   body: querystring.stringify({
  //     grant_type: 'refresh_token',
  //     refresh_token,
  //   }),
  // });

  return items
};

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

export const getTopTracks = async () => {
  const { access_token } = await getAccessToken();

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};