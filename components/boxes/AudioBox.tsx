import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  useRef,
  lazy,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import NextImage from "next/image";
import {
  HiForward,
  HiBackward,
  HiQueueList,
  HiInformationCircle,
} from "react-icons/hi2";
import { FaCompactDisc } from "react-icons/fa";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";

// Lazy load the Lottie component
const LottiePlayPauseWithNoSSR = dynamic(
  () => import("../../components/LottiePlayPauseButton"),
  { ssr: false }
);

const progressBarContainerStyle: CSSProperties = {
  position: "relative",
  height: "6px", // Fixed height container
  display: "flex",
  alignItems: "center"
};

const progressBarStyle: CSSProperties = {
  position: "absolute",
  height: "4px",
  width: "100%",
  backgroundColor: "#8d9092",
  cursor: "pointer",
  borderRadius: "2px",
  transition: "height 0.2s ease-in-out"
};

const progressBarHoverStyle: CSSProperties = {
  ...progressBarStyle,
  height: "6px"
};

const progressIndicatorStyle = (percentage: number): CSSProperties => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: `${percentage}%`,
  backgroundColor: "#FFFFFF",
});

const dotIndicatorStyle = (percentage: number): CSSProperties => ({
  position: "absolute",
  top: "0px",
  left: `${percentage}%`,
  transform: "translateX(-50%)",
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",
});

interface Song {
  title: string;
  artist: string;
  albumCoverUrl: string;
  audioSrc: string;
  audioLink?: string;
  preload?: "none" | "metadata" | "auto"; // Add preload option
}

const AudioBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [loadedSongs, setLoadedSongs] = useState<Set<number>>(new Set([0])); // Track which songs are loaded
  const [isLoading, setIsLoading] = useState(false);
  const [isProgressBarHovered, setIsProgressBarHovered] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Define songs with preload strategy
  const songs: Song[] = useMemo(
    () => [
      {
        title: "Closer",
        artist: "lewisgoing & Avi8",
        albumCoverUrl: "/albumart/closer.jpg",
        audioSrc: "./audio/closer.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/closer",
        preload: "auto", // First song loads immediately
      },
      {
        title: "Winter '22 Samples",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/winter22.jpeg",
        audioSrc: "./audio/winter22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/winter22?si=6464126a1a6d4fbdad72cda1978ba8b0&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        preload: "metadata", // Just load metadata for next track
      },
      {
        title: "2023 Samples",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/2023clips.jpeg",
        audioSrc: "./audio/2023samples.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/whereimat?si=b18a4a36f49540789802800d35bc63c7&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        preload: "none", // Don't preload until needed
      },
      {
        title: "New Paths",
        artist: "Pradaalife produced by lewisgoing",
        albumCoverUrl: "/albumart/newpaths.jpeg",
        audioSrc: "./audio/newpaths.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/newpaths?si=cd069d336dcf4059840ede43a5d69a47&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        preload: "none",
      },
      {
        title: "Midsummer '22 Clips",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/summer22.jpeg",
        audioSrc: "./audio/summer22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/summer22?si=d4ea34a33f234e8b85472684a675be55&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        preload: "none",
      },
      {
        title: "May '22 Clips",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/may22.jpeg",
        audioSrc: "./audio/may22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/may?si=4880056ad4e94c3fa4b6285d08951427&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        preload: "none",
      },
      {
        title: "February '22 Clips",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/feb22.jpeg",
        audioSrc: "./audio/feb22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/feb22?si=9a9c188a73a84cb78d6ac17fc76de175&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        preload: "none",
      },
    ],
    []
  );

  // Helper function to prevent dragging
  const preventDrag = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  }, []);

  // Progressive loading of audio files
  const preloadNextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % songs.length;
    if (!loadedSongs.has(nextIndex)) {
      const preloadAudio = new Audio();
      preloadAudio.src = songs[nextIndex].audioSrc;
      preloadAudio.preload = "metadata"; // Just load metadata
      preloadAudio.load();
      
      // Mark as loaded
      setLoadedSongs(prev => new Set([...prev, nextIndex]));
      
      // Remove the audio element reference once loaded
      preloadAudio.onloadedmetadata = () => {
        preloadAudio.onloadedmetadata = null;
      };
    }
  }, [currentTrackIndex, songs, loadedSongs]);

  // FIXED: Handle progress bar interaction
  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
      
      // Debug logging to see what's happening
      console.log("Seeking to:", newTime, "seconds");
    }
  }, [duration]);

  // Initialize audio on mount
  useEffect(() => {
    if (typeof window === 'undefined' || audioElementRef.current) return;

    const audio = new Audio();
    audio.preload = songs[0].preload || "metadata";
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

  // Handle track changes and audio events
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % songs.length;
      setCurrentTrackIndex(nextIndex);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    // Load new source if track changes
    if (audio.src !== new URL(songs[currentTrackIndex].audioSrc, window.location.href).href) {
      setIsLoading(true);
      audio.src = songs[currentTrackIndex].audioSrc;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsLoading(false);
        });
      }
      
      // Preload the next track
      if (typeof window !== 'undefined') {
        // Use requestIdleCallback if available
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => preloadNextTrack());
        } else {
          setTimeout(preloadNextTrack, 1000);
        }
      }
    }
    
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [currentTrackIndex, songs, isPlaying, preloadNextTrack]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Skip to next track
  const skipToNextTrack = useCallback(() => {
    setCurrentTrackIndex(prevIndex => (prevIndex + 1) % songs.length);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [songs.length, isPlaying]);

  // Play previous track
  const playLastTrack = useCallback(() => {
    setCurrentTrackIndex(prevIndex => 
      prevIndex - 1 < 0 ? songs.length - 1 : prevIndex - 1
    );
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [songs.length, isPlaying]);

  // Handle opening song link
  const handleSongLinkClick = useCallback(() => {
    const songLink = songs[currentTrackIndex].audioLink;
    if (songLink) {
      window.open(songLink, "_blank");
    }
  }, [songs, currentTrackIndex]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioElementRef.current;
    if (audio) {
      setIsMuted(prev => {
        const newMutedState = !prev;
        audio.muted = newMutedState;
        return newMutedState;
      });
    }
  }, []);

  // Format time to display
  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const progressPercentage = (currentTime / duration) * 100;
  const currentSong = songs[currentTrackIndex];

  /* Add this CSS to the global styles or component */
  const noGrabStyles = `
    .no-drag {
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
  `;

  return (
    <>
      <style jsx global>{`
        ${noGrabStyles}
        
        /* Only disable dragging on interactive elements */
        .react-grid-item button,
        .react-grid-item .drag-blocker {
          pointer-events: auto !important;
        }
      `}</style>
      {/* Desktop Styles */}
      <div className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col">
        {/* Top Bar */}
        <div className="absolute left-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full"></div>
        <button 
          onClick={toggleMute} 
          onMouseDown={preventDrag}
          className="absolute right-0 top-0 z-[1] w-10 h-10 flex items-center justify-center m-3 bg-tertiary/50 cursor-pointer no-drag drag-blocker rounded-full"
        >
          {isMuted ? (
            <VolumeX size={24} className="text-primary hover:text-blue-400 transition-colors" />
          ) : (
            <Volume2 size={24} className="text-primary hover:text-blue-400 transition-colors" />
          )}
        </button>

        <div className="w-full h-[80px] rounded-t-3xl flex-shrink-0" />
        <div className="m-3 flex flex-col h-full gap-2">
          {/* Middle Elements */}
          {/* Album Cover and Song Info */}
          <div className="flex flex-col h-full gap-1 items-center justify-center mt-[-48px]">
            <div className="relative">
              <NextImage
                src={currentSong.albumCoverUrl}
                alt={currentSong.title}
                width={120}
                height={120}
                className={`rounded-2xl object-cover ${isLoading ? 'opacity-70' : 'opacity-100'} transition-opacity`}
                priority={currentTrackIndex === 0} // Prioritize first album art
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-2xl">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="text-sm h-fit w-full px-2 py-1 rounded-lg leading-snug text-center">
              <div className="text-center">{currentSong.title}</div>
              <div className="text-center text-[10px] pt-0.5 text-muted-foreground">
                {currentSong.artist}
              </div>
            </div>

            {/* Song duration and progress bar */}
            <div className="text-sm h-full w-full px-2 rounded-lg leading-snug mt-2">
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
                  <div style={dotIndicatorStyle(progressPercentage)}></div>
                </div>
              </div>
              <div className="flex flex-row pt-2">
                <div className="text-[10px] text-primary text-left w-1/2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-[10px] text-primary text-right w-1/2">
                  {formatTime(duration)}
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-row w-full h-full rounded-lg items-center justify-between gap-1">
              <div className="flex grow justify-center rounded-lg">
                <button className="info-icon cursor-pointer no-drag drag-blocker p-1" onMouseDown={preventDrag}>
                  <FaCompactDisc
                    size={28}
                    className="text-primary"
                    style={{
                      animation: "spin 2s linear infinite",
                      animationPlayState: isPlaying ? "running" : "paused",
                    }}
                  />
                </button>
              </div>
              {/* Back */}
              <div className="flex grow justify-center" onClick={playLastTrack} onMouseDown={preventDrag}>
                <button className="cursor-pointer no-drag p-1 drag-blocker">
                  <HiBackward size={36} className="text-primary" />
                </button>
              </div>

              {/* Play/Pause */}
              <div className="flex grow justify-center" onMouseDown={preventDrag}>
                <button className="no-drag p-1 drag-blocker">
                  <Suspense fallback={<div className="w-12 h-12 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin"></div>
                  </div>}>
                    <LottiePlayPauseWithNoSSR
                      togglePlay={togglePlay}
                      isPlaying={isPlaying}
                      isDark={isDark}
                    />
                  </Suspense>
                </button>
              </div>

              {/* Next */}
              <div className="flex grow justify-center" onMouseDown={preventDrag}>
                <button onClick={skipToNextTrack} className="cursor-pointer no-drag p-1 drag-blocker">
                  <HiForward
                    size={36}
                    className="text-primary"
                  />
                </button>
              </div>

              <div className="flex grow justify-center" onMouseDown={preventDrag}>
                <button className="info-icon cursor-pointer no-drag p-1 drag-blocker" onClick={handleSongLinkClick}>
                  {songs[currentTrackIndex].audioLink ? (
                    <div className="cursor-pointer">
                      <ExternalLink size={24} className="text-primary hover:text-blue-400 transition-colors" />
                    </div>
                  ) : (
                    <div>
                      <ExternalLink size={24} className="text-gray-400" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Styles */}
      <div className="bento-lg:hidden relative w-full h-full flex flex-col">
        <div className="m-2">
          {/* Album Cover and Song Info centered at the top */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <NextImage
                src={currentSong.albumCoverUrl}
                alt={currentSong.title}
                width={80}
                height={80}
                className={`rounded-xl object-cover ${isLoading ? 'opacity-70' : 'opacity-100'} transition-opacity`}
                priority={currentTrackIndex === 0}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button onClick={togglePlay} onMouseDown={preventDrag} className="absolute top-[30px] left-1/2 transform -translate-x-1/2 no-drag drag-blocker z-10">
              <Suspense fallback={<div className="w-10 h-10"></div>}>
                <LottiePlayPauseWithNoSSR
                  togglePlay={togglePlay}
                  isPlaying={isPlaying}
                  isDark={isDark}
                />
              </Suspense>
            </button>
            <div className="text-center">
              <div className="font-bold text-lg bento-sm:text-sm">{currentSong.title}</div>
              <div className="text-sm text-muted-foreground bento-sm:text-xs">{currentSong.artist}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mx-1">
            <div className="my-4 sm:my-3 no-drag drag-blocker" style={progressBarContainerStyle}>
              <div 
                style={isProgressBarHovered ? progressBarHoverStyle : progressBarStyle} 
                onClick={handleProgressBarClick}
                onMouseDown={preventDrag}
                onMouseEnter={() => setIsProgressBarHovered(true)}
                onMouseLeave={() => setIsProgressBarHovered(false)}
                className="w-full"
              >
                <div style={progressIndicatorStyle(progressPercentage)}></div>
                <div style={dotIndicatorStyle(progressPercentage)}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioBox;