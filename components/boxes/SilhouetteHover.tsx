// components/boxes/SilhouetteHover.tsx
import Image from '../assets/ImageBox';
import { getSvgUrl } from '../../src/utils/blob-utils';

interface SilhouetteHoverProps {
  silhouetteSrc: string;
  silhouetteAlt: string;
  mainSrc: string;
  mainAlt: string;
  objectCover?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const SilhouetteHover = ({
  silhouetteSrc,
  silhouetteAlt,
  mainSrc,
  mainAlt,
  objectCover = true,
  children,
  className,
}: SilhouetteHoverProps) => {
  // Get the Blob URLs for the SVG files
  const silhouetteBlobUrl = silhouetteSrc.endsWith('.svg') 
    ? getSvgUrl(silhouetteSrc) 
    : silhouetteSrc;
    
  const mainBlobUrl = mainSrc.endsWith('.svg') 
    ? getSvgUrl(mainSrc) 
    : mainSrc;

  return (
    <div className={`group ${className}`}>
      <Image
        src={silhouetteBlobUrl}
        alt={silhouetteAlt}
        fill
        noRelative
        className={`rounded-3xl ${
          objectCover ? 'object-cover' : 'object-contain'
        } transition-opacity delay-75 duration-300 group-hover:opacity-0`}
        skeletonClassName="rounded-3xl z-[1]"
        unoptimized
      />
      <Image
        src={mainBlobUrl}
        alt={mainAlt}
        fill
        noRelative
        className={`rounded-3xl ${
          objectCover ? 'object-cover' : 'object-contain'
        } opacity-0 transition-opacity delay-75 duration-300 group-hover:opacity-100`}
        skeletonClassName="rounded-3xl z-[1]"
        unoptimized
      />
      {children}
    </div>
  );
};

export default SilhouetteHover;