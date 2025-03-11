import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { Skeleton } from 'components/shadcn/skeleton';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';

interface Track {
  name: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: { '#text': string }[];
  url: string;
  '@attr'?: { nowplaying: string };
}

const SpotifyPresence = () => {
  const [displayData, setDisplayData] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const imageStyle = isHovered
    ? { filter: 'grayscale(0)', transition: 'filter 0.3s ease' }
    : { filter: 'grayscale(1)', transition: 'filter 0.3s ease' };

  const iconStyle = {
    transition: 'color 0.3s ease',
    color: isHovered ? '#1db954' : '#e5d3b8',
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={image[3]['#text']}
          alt="Album art"
          width={128}
          height={128}
          className="mb-2 w-[55%] rounded-xl border border-border grayscale md:w-32"
          style={imageStyle}
        />
        <div
          className="flex 

lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-end lg:overflow-hidden lg:pl-0 lg:pt-0 lg:relative lg:w-[95%] 

sm:min-w-0 sm:flex-1 sm:flex-col sm:justify-end sm:overflow-hidden sm:pl-0 sm:pt-0 sm:relative sm:w-[95%] 

md:absolute md:pl-36 bento-md:pt-8 bento-md:w-[86%]
"
        >
          <div className="flex flex-col">
            <span className="mb-2 flex gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/svg/bento-now-playing.svg" alt="Now playing" width={16} height={16} />
              <span className="text-sm text-primary">
                {displayData['@attr']?.nowplaying === 'true' ? 'Now playing...' : 'Last played...'}
              </span>
            </span>
            <span className="text-md pb-2 truncate font-bold leading-none z-[1]">{song}</span>
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
      <a
        href={url}
        aria-label="View on last.fm"
        title="View on last.fm"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary"
      >
        <MoveUpRight size={16} />
      </a>
    </>
  );
};

export default SpotifyPresence;
