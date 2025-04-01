// components/boxes/AudioBox.tsx
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  useRef,
  Suspense,
} from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import NextImage from 'next/image';
import { HiForward, HiBackward } from 'react-icons/hi2';
import { FaCompactDisc, FaSoundcloud } from 'react-icons/fa';
import { MoveUpRight } from 'lucide-react';

// Import the robust Blob utilities
import { getAudioUrl } from '@/utils/blob-utils';
import ExternalLink from '@/components/assets/ExternalLink';

// Lazy load the Lottie component with explicit props type
const LottiePlayPauseWithNoSSR = dynamic(() => import('@/components/shared/LottiePlayPauseButton'), {
  ssr: false,
  loading: () => (
    <div className="w-10 h-10 flex items-center justify-center opacity-80">
      <div className="w-6 h-6 text-primary">▶</div>
    </div>
  ),
});

// Keeping the original style definitions intact
const progressBarContainerStyle: CSSProperties = {
  position: 'relative',
  height: '6px', // Fixed height container
  display: 'flex',
  alignItems: 'center',
};

const progressBarStyle: CSSProperties = {
  position: 'absolute',
  height: '3px',
  width: '100%',
  backgroundColor: '#8d9092',
  cursor: 'pointer',
  borderRadius: '2px',
  transition: 'height 0.2s ease-in-out',
};

const progressBarHoverStyle: CSSProperties = {
  ...progressBarStyle,
  height: '5px',
  backgroundColor: '#a0a0a0',
};

const progressIndicatorStyle = (percentage: number): CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: `${percentage}%`,
  backgroundColor: '#FFFFFF',
});

const dotIndicatorStyle = (percentage: number, isHovered: boolean): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  left: `${percentage}%`,
  transform: 'translate(-50%, -50%)',
  width: isHovered ? '8px' : '5px',
  height: isHovered ? '8px' : '5px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF',
  transition: 'width 0.2s ease, height 0.2s ease',
  boxShadow: isHovered ? '0 0 3px rgba(255, 255, 255, 0.7)' : 'none',
});

interface Song {
  title: string;
  artist: string;
  albumCoverUrl: string;
  audioSrc: string;
  audioLink?: string;
  preload?: 'none' | 'metadata' | 'auto'; // Add preload option
}

const AudioBox = () => {
  // Maintain all original state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [loadedSongs, setLoadedSongs] = useState<Set<number>>(new Set([0])); // Track which songs are loaded
  const [isLoading, setIsLoading] = useState(false);
  const [isProgressBarHovered, setIsProgressBarHovered] = useState(false);
  const [isPlayButtonHovered, setIsPlayButtonHovered] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const lottieRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Hover styles (kept the same)
  const imageStyle = {
    filter: isPlaying ? 'grayscale(0)' : isHovered ? 'grayscale(0.5)' : 'grayscale(1)',
    transition: 'filter 0.3s ease',
  };

  const iconStyle = {
    transition: 'color 0.3s ease',
    color: isHovered ? '#ff7700' : '#e5d3b8',
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Memoized song data with Blob URLs
  const songs: Song[] = useMemo(
    () => [
      {
        title: 'Closer',
        artist: 'lewisgoing & Avi8',
        albumCoverUrl: '/images/albumart/closer.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/closer-GAcJct7oCLeujFnRRqeTVxCNkal0gD.mp3',
        audioLink: 'https://soundcloud.com/lewisgoing/closer', 
        preload: 'auto', // First song loads immediately
      },
      {
        title: "Winter '22 Samples",
        artist: 'lewisgoing',
        albumCoverUrl: '/images/albumart/winter22.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/winter22-RPfrnXdD2nG4C5374nP4Dh86WdjjQf.mp3',
        audioLink:
          'https://soundcloud.com/lewisgoing/winter22?si=6464126a1a6d4fbdad72cda1978ba8b0&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        preload: 'metadata', // Just load metadata for next track
      },
      {
        title: '2023 Samples',
        artist: 'lewisgoing',
        albumCoverUrl: '/images/albumart/2023clips.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/2023samples-nBGcKjElRv3Vcyr5YjWfKeGtba9jfA.mp3',
        audioLink:
          'https://soundcloud.com/lewisgoing/whereimat?si=b18a4a36f49540789802800d35bc63c7&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        preload: 'none', // Don't preload until needed
      },
      {
        title: 'New Paths',
        artist: 'Pradaaslife produced by lewisgoing',
        albumCoverUrl: '/images/albumart/newpaths.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/newpaths-vOUSi3QMltsdig8cf0MIXyuS88X8oM.mp3',
        audioLink:
          'https://soundcloud.com/lewisgoing/newpaths?si=cd069d336dcf4059840ede43a5d69a47&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        preload: 'none',
      },
      {
        title: "Midsummer '22 Clips",
        artist: 'lewisgoing',
        albumCoverUrl: '/images/albumart/summer22.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/summer22-qk2PZrmrOGDgPDk1KxxUOhMBlAo4AF.mp3',
        audioLink:
          'https://soundcloud.com/lewisgoing/summer22?si=d4ea34a33f234e8b85472684a675be55&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        preload: 'none',
      },
      {
        title: "May '22 Clips",
        artist: 'lewisgoing',
        albumCoverUrl: '/images/albumart/may22.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/may22-2GFNOBcR7qWn2G5m49cdNrCZj3xrdL.mp3',
        audioLink:
          'https://soundcloud.com/lewisgoing/may?si=4880056ad4e94c3fa4b6285d08951427&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        preload: 'none',
      },
      {
        title: "February '22 Clips",
        artist: 'lewisgoing',
        albumCoverUrl: '/images/albumart/feb22.webp',
        audioSrc: 'https://bv9fzo8nrxr2pele.public.blob.vercel-storage.com/feb22-HQOUcucd8Ju3RpNzmcWq8aIIgePttm.mp3', // Could be converted to blob URL when ready
        audioLink:
          'https://soundcloud.com/lewisgoing/feb22?si=9a9c188a73a84cb78d6ac17fc76de175&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        preload: 'none',
      },
    ],
    [],
  );

  // Helper function to prevent dragging (kept the same)
  const preventDrag = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  }, []);

  // Optimized with useCallback for better performance
  const preloadNextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % songs.length;
    if (!loadedSongs.has(nextIndex)) {
      const preloadAudio = new Audio();
      preloadAudio.src = songs[nextIndex].audioSrc;
      preloadAudio.preload = 'metadata'; // Just load metadata
      preloadAudio.load();

      // Mark as loaded
      setLoadedSongs((prev) => new Set([...prev, nextIndex]));

      // Remove the audio element reference once loaded
      preloadAudio.onloadedmetadata = () => {
        preloadAudio.onloadedmetadata = null;
      };
    }
  }, [currentTrackIndex, songs, loadedSongs]);

  // Handle progress bar interaction (optimized but functionality unchanged)
  const handleProgressBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Use e.currentTarget instead of progressBarRef to ensure we're getting the correct element that was clicked
      const clickX = e.nativeEvent.offsetX;
      const totalWidth = e.currentTarget.offsetWidth;

      // Ensure we have valid dimensions and duration
      if (totalWidth <= 0 || !duration || duration <= 0) return;

      const clickPercentage = (clickX / totalWidth) * 100;
      const newTime = (clickPercentage / 100) * duration;

      // Add safety check but keep it minimal
      if (audioElementRef.current && isFinite(newTime)) {
        audioElementRef.current.currentTime = newTime;
      }
    },
    [duration],
  );

  // Initialize audio on mount (kept the same)
  useEffect(() => {
    if (typeof window === 'undefined' || audioElementRef.current) return;

    const audio = new Audio();
    audio.preload = songs[0].preload || 'metadata';
    audioElementRef.current = audio;

    // Mark the first track as loaded
    setLoadedSongs(new Set([0]));

    // Only set the source once the component is mounted
    audio.src = songs[0].audioSrc;
    audio.load();

    return () => {
      // Cleanup
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
    };
  }, [songs]);

  // Optimized audio event handling (functionality unchanged)
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    // Audio event handlers
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % songs.length;
      setCurrentTrackIndex(nextIndex);
      // Automatically start playing the next track
      setIsPlaying(true);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    // Load new source if track changes
    if (audio.src !== songs[currentTrackIndex].audioSrc) {
      setIsLoading(true);
      audio.src = songs[currentTrackIndex].audioSrc;
      audio.load();

      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
          setIsLoading(false);
        });
      }

      // Preload the next track using the optimized function
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => preloadNextTrack());
        } else {
          setTimeout(preloadNextTrack, 1000);
        }
      }
    }

    // Cleanup event listeners on unmount
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentTrackIndex, songs, isPlaying, preloadNextTrack]);

  // Handle play/pause state changes (kept the same)
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // useEffect(() => {
  //   console.log("Audio source URL:", songs[currentTrackIndex].audioSrc);
  // }, [currentTrackIndex, songs]);

  // Toggle play/pause with animation control (optimized but functionality unchanged)
  const togglePlay = useCallback(() => {
    // Direct audio control
    const audio = audioElementRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    }

    // Update playing state
    setIsPlaying((prev) => !prev);

    // If we have a reference to the Lottie component, ensure animation state matches
    if (lottieRef.current && typeof lottieRef.current.setPlaying === 'function') {
      lottieRef.current.setPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Optimize track navigation functions without changing functionality
  const skipToNextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % songs.length);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [songs.length, isPlaying]);

  const playLastTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 < 0 ? songs.length - 1 : prevIndex - 1));
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [songs.length, isPlaying]);

  // Format time to display (optimized)
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  const progressPercentage = (currentTime / duration) * 100;
  const currentSong = songs[currentTrackIndex];

  // CSS to prevent drag issues (kept the same)
  const noGrabStyles = `
    .no-drag {
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
  `;

  // The main return stays the same to preserve the layout
  return (
    <>
      <style jsx global>
        {noGrabStyles}
      </style>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`transition-all ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Desktop Layout */}
        <div className="flex bento-md:hidden z-[1] bento-lg:flex h-full w-full flex-col justify-between p-6 mt-2">
          <NextImage
            src={currentSong.albumCoverUrl}
            alt="Album art"
            width={0}
            height={0}
            className="mb-2 w-[55%] rounded-xl border border-border"
            unoptimized
            style={imageStyle}
          />
          <div className="flex flex-col">
            <span className="text-md mb-1 mt-1 line-clamp-2 font-bold leading-none">
              {currentSong.title}
            </span>
            <span className="line-clamp-1 text-xs text-muted-foreground mb-2">
              <span className="text-secondary-foreground font-semibold">by</span>{' '}
              {currentSong.artist}
            </span>

            {/* Progress Bar */}
            <div className="w-full mt-1">
              <div style={progressBarContainerStyle} className="no-drag drag-blocker">
                <div
                  style={isProgressBarHovered ? progressBarHoverStyle : progressBarStyle}
                  onClick={handleProgressBarClick}
                  onMouseDown={preventDrag}
                  onMouseEnter={() => setIsProgressBarHovered(true)}
                  onMouseLeave={() => setIsProgressBarHovered(false)}
                  className="w-full"
                >
                  <div style={progressIndicatorStyle(progressPercentage)}></div>
                  <div style={dotIndicatorStyle(progressPercentage, isProgressBarHovered)}></div>
                </div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-[12px] text-muted-foreground mt-.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Playback Controls */}
              <div className="flex justify-center items-center gap-4 w-full h-full lg:-translate-y-1 xl:-translate-y-1 sm:translate-y-0">
                <button
                  onClick={playLastTrack}
                  className="cursor-pointer no-drag drag-blocker transition-all duration-200 hover:brightness-125"
                >
                  <HiBackward size={42} className="text-primary" style={{ cursor: 'pointer' }} />
                </button>

                <button
                  className="cursor-pointer no-drag drag-blocker relative transition-transform duration-200 ease-in-out hover:brightness-125"
                  onClick={togglePlay}
                  onMouseDown={preventDrag}
                  onMouseEnter={() => setIsPlayButtonHovered(true)}
                  onMouseLeave={() => setIsPlayButtonHovered(false)}
                  style={{
                    transform: isPlayButtonHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {/* <Suspense
                    fallback={<div className="w-12 h-12 flex items-center justify-center">▶</div>}
                  > */}
                    <LottiePlayPauseWithNoSSR
                      ref={lottieRef}
                      togglePlay={togglePlay}
                      isPlaying={isPlaying}
                      isDark={isDark}
                    />
                  {/* </Suspense> */}
                </button>

                <button
                  onClick={skipToNextTrack}
                  className="cursor-pointer no-drag drag-blocker transition-all duration-200 hover:brightness-125"
                  onMouseDown={preventDrag}
                >
                  <HiForward size={42} className="text-primary" style={{ cursor: 'pointer' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden bento-md:flex z-[1] bento-lg:hidden h-full px-4 items-center gap-4">
          <NextImage
            src={currentSong.albumCoverUrl}
            alt="Album art"
            width={0}
            height={0}
            className="w-32 rounded-xl border border-border"
            unoptimized
            style={imageStyle}
          />

          {/* flex col for metadata */}
          <div className="flex flex-col w-[200px] h-full">
            <div className="h-12 flex flex-col justify-start overflow-hidden w-[162px]">
              <div className="text-md font-bold leading-none truncate mb-1">
                {currentSong.title}
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1 text-secondary-foreground font-semibold">by</span>
                <span className="truncate">{currentSong.artist}</span>
              </div>
            </div>

            <div className="w-full">
              <div style={progressBarContainerStyle} className="no-drag drag-blocker mb-1">
                <div
                  style={isProgressBarHovered ? progressBarHoverStyle : progressBarStyle}
                  onClick={handleProgressBarClick}
                  onMouseDown={preventDrag}
                  onMouseEnter={() => setIsProgressBarHovered(true)}
                  onMouseLeave={() => setIsProgressBarHovered(false)}
                  className="w-full"
                >
                  <div style={progressIndicatorStyle(progressPercentage)}></div>
                  <div style={dotIndicatorStyle(progressPercentage, isProgressBarHovered)}></div>
                </div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-[12px] text-muted-foreground mb-0">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Playback Controls */}
              <div
                className="flex space-x-2.5 justify-center mt-0"
                style={{ transform: 'scale(1.1)' }}
              >
                <button
                  className="cursor-pointer no-drag p-0 pr-0.5 drag-blocker transition-all duration-200 hover:brightness-125"
                  onClick={playLastTrack}
                  onMouseDown={preventDrag}
                >
                  <HiBackward size={32} className="text-primary" style={{ cursor: 'pointer' }} />
                </button>

                <button
                  className="no-drag p-0 drag-blocker transition-all duration-200 ease-in-out hover:brightness-125"
                  onClick={togglePlay}
                  onMouseDown={preventDrag}
                  onMouseEnter={() => setIsPlayButtonHovered(true)}
                  onMouseLeave={() => setIsPlayButtonHovered(false)}
                  style={{
                    transform: isPlayButtonHovered ? 'scale(.90)' : 'scale(.80)',
                  }}
                >
                  {/* <Suspense
                    fallback={
                      <div className="w-8 h-8 flex items-center justify-center text-primary">
                        ▶
                      </div>
                    }
                  > */}
                    <LottiePlayPauseWithNoSSR
                      ref={lottieRef}
                      togglePlay={togglePlay}
                      isPlaying={isPlaying}
                      isDark={isDark}
                    />
                  {/* </Suspense> */}
                </button>

                <button
                  className="cursor-pointer no-drag p-0 drag-blocker transition-all duration-200 hover:brightness-125"
                  onClick={skipToNextTrack}
                  onMouseDown={preventDrag}
                >
                  <HiForward size={32} className="text-primary" style={{ cursor: 'pointer' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Kept unchanged but optimized functions */}
        <div className="hidden bento-md:hidden relative w-full h-full flex-col">
          <div className="m-2 flex flex-col items-center w-full">
            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="absolute">
                <NextImage
                  src={currentSong.albumCoverUrl}
                  alt={currentSong.title}
                  width={80}
                  height={80}
                  className={`rounded-xl object-cover ${isLoading ? 'opacity-70' : 'opacity-100'} transition-opacity`}
                  priority={currentTrackIndex === 0}
                  style={imageStyle}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="text-center mt-2">
                <div className="font-bold text-md">{currentSong.title}</div>
                <div className="text-xs text-muted-foreground">{currentSong.artist}</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full my-3">
                <div className="no-drag drag-blocker" style={progressBarContainerStyle}>
                  <div
                    style={isProgressBarHovered ? progressBarHoverStyle : progressBarStyle}
                    onClick={handleProgressBarClick}
                    onMouseDown={preventDrag}
                    onMouseEnter={() => setIsProgressBarHovered(true)}
                    onMouseLeave={() => setIsProgressBarHovered(false)}
                    className="w-full"
                  >
                    <div style={progressIndicatorStyle(progressPercentage)}></div>
                    <div style={dotIndicatorStyle(progressPercentage, isProgressBarHovered)}></div>
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={playLastTrack}
                  className="cursor-pointer no-drag drag-blocker transition-all duration-200 hover:brightness-125"
                  onMouseDown={preventDrag}
                >
                  <HiBackward size={24} className="text-primary cursor-pointer" />
                </button>

                <button
                  onClick={togglePlay}
                  onMouseDown={preventDrag}
                  onMouseEnter={() => setIsPlayButtonHovered(true)}
                  onMouseLeave={() => setIsPlayButtonHovered(false)}
                  className="no-drag drag-blocker z-10 relative transition-all duration-200 ease-in-out hover:brightness-125"
                  style={{
                    transform: isPlayButtonHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {/* <Suspense
                    fallback={
                      <div className="w-10 h-10 flex items-center justify-center text-primary">
                        ▶
                      </div>
                    }
                  > */}
                    <LottiePlayPauseWithNoSSR
                      ref={lottieRef}
                      togglePlay={togglePlay}
                      isPlaying={isPlaying}
                      isDark={isDark}
                    />
                  {/* </Suspense> */}
                </button>

                <button
                  onClick={skipToNextTrack}
                  className="cursor-picker no-drag drag-blocker transition-all duration-200 hover:brightness-125"
                  onMouseDown={preventDrag}
                >
                  <HiForward size={24} className="text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SoundCloud Logo in top right for all layouts */}
        <div className="absolute right-1 top-0 z-[1] pr-3 pt-2 bento-xl:block bento-lg:block bento-sm:block bento-md:hidden">
          <FaSoundcloud
            size={56}
            className="text-primary transition-colors hover:text-[#ff7700] mb-10 bento-xl:hidden"
            style={iconStyle}
          />
                    <FaSoundcloud
            size={60}
            className="text-primary transition-colors hover:text-[#ff7700] mb-10 hidden bento-xl:block pt-4"
            style={iconStyle}
          />
        </div>

        <div className="absolute right-2 top-14 z-[1] p-8 bento-md:right-0 bento-md:top-2 bento-lg:top-14 bento-lg:right-3 bento-sm:top-14 bento-sm:right-2 bento-xl:right-2 bento-xl:top-16">
  {currentSong.audioLink && (
    <ExternalLink 
      href={currentSong.audioLink} 
      iconSize={16}
      ariaLabel="Listen on Soundcloud"
      title="Listen on Soundcloud"
    />
  )}
</div>

        {/* External Link in bottom right */}
        {currentSong.audioLink && (
          <div className="absolute bottom-0.5 right-0" style={{ transform: 'scale(.95)' }}>
            <></>
          </div>
        )}
      </div>
    </>
  );
};

export default AudioBox;