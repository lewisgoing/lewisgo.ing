import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';

import ExternalLink from '../assets/ExternalLink';

const SpotifyBox = ({ lanyard }) => {
  // State to hold the last played or currently playing Spotify track
  const [spotifyData, setSpotifyData] = useState(null);

  useEffect(() => {
    // Attempt to set last played track on component mount using stored value
    const storedSpotifyData = localStorage.getItem('spotify_last_played');
    if (storedSpotifyData) {
      setSpotifyData(JSON.parse(storedSpotifyData));
    }

    // Update with real-time data if available
    if (lanyard.data.listening_to_spotify) {
      setSpotifyData(lanyard.data.spotify);
      localStorage.setItem('spotify_last_played', JSON.stringify(lanyard.data.spotify));
    }
  }, [lanyard.data.listening_to_spotify, lanyard.data.spotify]);

  useEffect(() => {
    if (spotifyData) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_LANYARD_KV_KEY;
        const userId = process.env.NEXT_PUBLIC_LANYARD_USER_ID;

        if (!apiKey || !userId) {
          throw new Error('Missing environment variables');
        }

        // Example async operation: Storing the last played track using your backend or other services
        (async () => {
          await set({
            apiKey,
            userId,
            key: 'spotify_last_played',
            value: JSON.stringify(spotifyData),
          });
          console.log('Spotify data stored:', spotifyData);
        })();
      } catch (error) {
        console.error('Error storing Spotify data:', error);
      }
    }
  }, [spotifyData]);

  if (!spotifyData) return <p>Spotify data is not available</p>;

  const { song, artist, album, album_art_url, track_id } = spotifyData;


    return (
        <>
            <div className="flex bento-md:hidden z-[1] bento-lg:flex h-full w-full flex-col justify-between p-6">
                <Image
                    src={album_art_url}
                    alt="Album art"
                    width={0}
                    height={0}
                    className="mb-2 w-[55%] rounded-xl border border-border grayscale"
                    unoptimized
                />
                <div className="flex flex-col">
                    <span className="mb-2 flex gap-2">
                        <Image
                            src="./svg/now-playing.svg"
                            alt="Now playing"
                            width={16}
                            height={16}
                        />
                        {lanyard.data.listening_to_spotify ? (
                            <span className="text-sm text-primary">Now playing...</span>
                        ) : (
                            <span className="text-sm text-primary">Last played...</span>
                        )}
                    </span>
                    <span className="text-md mb-2 line-clamp-2 font-bold leading-none">{song}</span>
                    <span className="line-clamp-1 w-[85%] text-xs text-muted-foreground">
                        <span className="text-secondary-foreground font-semibold">by</span> {artist}
                    </span>
                    <span className="line-clamp-1 w-[85%] text-xs text-muted-foreground">
                        <span className="text-secondary-foreground font-semibold">on</span> {album}
                    </span>
                </div>
            </div>
            <div className="hidden bento-md:flex z-[1] bento-lg:hidden h-full w-full px-4 items-center gap-4">
                <Image
                    src={album_art_url}
                    alt="Album art"
                    width={0}
                    height={0}
                    className="w-32 rounded-xl border border-border grayscale"
                    unoptimized
                />
                <div className="flex flex-col w-[42%]">
                    <span className="mb-2 flex gap-2">
                        <Image
                            src="/static/images/bento/bento-now-playing.svg"
                            alt="Now playing"
                            width={16}
                            height={16}
                        />
                        {lanyard.data.listening_to_spotify ? (
                            <span className="text-sm text-primary">Now playing...</span>
                        ) : (
                            <span className="text-sm text-primary">Last played...</span>
                        )}
                    </span>
                    <span className="text-md mb-2 line-clamp-3 font-bold leading-none">{song}</span>
                    <span className="line-clamp-2 w-[85%] text-xs text-muted-foreground">
                        <span className="text-secondary-foreground font-semibold">by</span> {artist}
                    </span>
                    <span className="line-clamp-2 w-[85%] text-xs text-muted-foreground">
                        <span className="text-secondary-foreground font-semibold">on</span> {album}
                    </span>
                </div>
            </div>
            <div className="absolute right-0 top-0 z-[1] m-3 text-primary">
                <FaSpotify size={56} />
            </div>
            <ExternalLink
                href={`https://open.spotify.com/track/${track_id}`}
                className="z-[1] block"
            />
        </>
    )
}

export default SpotifyBox
