'use client';

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaSpotify } from "react-icons/fa";
import ExternalLink from "@/components/assets/ExternalLink";

// Define TypeScript interfaces
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

// Client component to render the UI
export default function SpotifyBoxClient({ 
  spotifyData, 
  isCurrentlyPlaying,
  onLoad 
}: { 
  spotifyData: SpotifyData, 
  isCurrentlyPlaying: boolean,
  onLoad?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract Spotify data with safeguards for undefined values
  const { 
    song = "", 
    artist = "", 
    album = "", 
    album_art_url = "https://via.placeholder.com/300", 
    track_id = "" 
  } = spotifyData || {};

  // Hover styles
  const iconStyle = {
    transition: "color 0.3s ease",
    color: isHovered ? "#1db954" : "#e5d3b8",
  };

  const imageStyle = {
    filter: isHovered ? 'grayscale(0)' : 'grayscale(1)',
    transition: 'filter 0.3s ease',
  };

  // Call onLoad when component mounts
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [onLoad, isLoaded]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="transition-all duration-500 ease-in-out opacity-100"
    >
      <div className="flex bento-md:hidden z-[1] bento-lg:flex h-full w-full flex-col justify-between p-6">
        <Image
          src={album_art_url}
          alt="Album art"
          width={0}
          height={0}
          className="mb-2 w-[55%] rounded-xl border border-border"
          unoptimized
          style={imageStyle}
        />
        <div className="flex flex-col">
          <span className="mb-2 flex gap-2">
            <Image
              src="/svg/bento-now-playing.svg"
              alt="Now playing"
              width={16}
              height={16}
              style={iconStyle}
            />
            {isCurrentlyPlaying ? (
              <span className="text-sm">Now playing...</span>
            ) : (
              <span className="text-sm">Last played...</span>
            )}
          </span>
          <span className="text-md mb-2 line-clamp-2 font-bold leading-none">
            {song}
          </span>
          <span className="line-clamp-1 w-[85%] text-xs text-muted-foreground">
            <span className="text-secondary-foreground font-semibold">
              by
            </span>{" "}
            {artist}
          </span>
          <span className="line-clamp-1 w-[85%] text-xs text-muted-foreground">
            <span className="text-secondary-foreground font-semibold">
              on
            </span>{" "}
            {album}
          </span>
        </div>
      </div>
      <div className="hidden bento-md:flex z-[1] bento-lg:hidden h-full w-full px-4 items-center gap-4">
        <Image
          src={album_art_url}
          alt="Album art"
          width={0}
          height={0}
          className="w-32 rounded-xl border border-border"
          unoptimized
          style={imageStyle}
        />
        <div className="flex flex-col w-[42%]">
          <span className="mb-2 flex gap-2">
            <Image
              src="/svg/bento-now-playing.svg"
              alt="Now playing"
              width={16}
              height={16}
              style={iconStyle}
            />
            {isCurrentlyPlaying ? (
              <span className="text-sm text-primary">Now playing...</span>
            ) : (
              <span className="text-sm text-primary">Last played...</span>
            )}
          </span>
          <span className="text-md mb-2 line-clamp-3 font-bold leading-none">
            {song}
          </span>
          <span className="line-clamp-2 w-[85%] text-xs text-muted-foreground">
            <span className="text-secondary-foreground font-semibold">
              by
            </span>{" "}
            {artist}
          </span>
          <span className="line-clamp-2 w-[85%] text-xs text-muted-foreground">
            <span className="text-secondary-foreground font-semibold">
              on
            </span>{" "}
            {album}
          </span>
        </div>
      </div>
      <div className="absolute right-0 top-0 z-[1] m-3 text-primary">
        <FaSpotify size={56} style={iconStyle} />
      </div>
      {track_id && (
        <ExternalLink
          href={`https://open.spotify.com/track/${track_id}`}
          className="z-[1] block"
        />
      )}
    </div>
  );
}