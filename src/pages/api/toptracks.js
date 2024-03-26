import { getTopTracks } from '../../fetchSpotifyData';

// Assign the async function to a variable
const topTracksHandler = async (req, res) => {
  const response = await getTopTracks();
  const { items } = await response.json();

  const tracks = items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(', '),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  return res.status(200).json({ tracks });
};

// Export the variable as default
export default topTracksHandler;
