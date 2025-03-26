// components/boxes/SpotifyBox.tsx
'use cache';

import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { Skeleton } from '../shadcn/skeleton';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import { getSvgUrl } from '../../src/utils/blob-utils';
import ExternalLink from '../assets/ExternalLink';

interface Track {
  name: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: { '#text': string }[];
  url: string;
  '@attr'?: { nowplaying: string };
}

const SpotifyBox = () => {
  const [displayData, setDisplayData] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageStyle = isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: 'color 0.3s ease',
    color: isHovered ? '#1db954' : '#e5d3b8',
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Get the now playing SVG from blob storage if available
  const nowPlayingIcon = getSvgUrl('bento-now-playing.svg');

  useEffect(() => {
    fetch('https://lastfm-last-played.biancarosa.com.br/trancepilled/latest-song')
      .then((response) => response.json())
      .then((data) => {
        setDisplayData(data.track);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching latest song:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="relative flex h-full w-full flex-col justify-between rounded-3xl p-6">
        <Skeleton className="mb-2 h-[55%] w-[55%] rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="absolute right-0 top-0 m-3 text-primary">
          <FaSpotify size={56} />
        </div>
        <Skeleton className="absolute bottom-0 right-0 m-3 h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!displayData) return <p>Something absolutely horrible has gone wrong</p>;

  const { name: song, artist, album, image, url } = displayData;

  return (
    <>
      <div
        className="relative flex h-full w-full flex-col justify-between p-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative mb-2 w-[55%] bento-md:w-32 bento-xl:w-48">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 rounded-xl" />
          )}
          <Image
            src={image[3]['#text']}
            alt="Album art"
            width={128}
            height={128}
            className={`rounded-xl border border-border grayscale mb-2 w-[55%] bento-sm:w-52 bento-md:w-32 bento-xl:w-48 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={imageStyle}
            onLoad={() => setImageLoaded(true)}
            unoptimized
          />
        </div>

        <div className="flex lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-end lg:overflow-hidden lg:pl-0 lg:pt-0 lg:relative lg:w-[97%] sm:min-w-0 sm:flex-1 sm:flex-col sm:justify-end sm:overflow-hidden sm:pl-0 sm:pt-0 sm:relative sm:w-[97%] md:absolute md:pl-36 bento-md:pt-8 bento-md:w-[86%]">
          <div className="flex flex-col">
            <span className="mb-2 flex gap-2">
              <Image 
                src={nowPlayingIcon}
                alt="Now playing" 
                width={16} 
                height={16} 
                unoptimized
              />
              <span className="text-sm text-primary">
                {displayData['@attr']?.nowplaying === 'true' ? 'Now playing...' : 'Last played...'}
              </span>
            </span>
            <span className="text-md pb-2 truncate font-bold leading-tight">{song}</span>
            <span className="w-[85%] truncate text-xs text-muted-foreground">
              <span className="font-semibold text-secondary-foreground">by</span> {artist['#text']}
            </span>
            <span className="w-[85%] truncate text-xs text-muted-foreground">
              <span className="font-semibold text-secondary-foreground">on</span> {album['#text']}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 m-3 text-primary">
  <FaSpotify size={56} style={iconStyle} />
</div>
<ExternalLink 
  href={url}
  iconSize={16}
  ariaLabel="View on last.fm"
  title="View on last.fm"
/>
    </>
  );
};

export default SpotifyBox;