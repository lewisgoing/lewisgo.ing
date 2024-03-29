import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  useRef,
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
import { audioContextManager } from "src/context/AudioContextManager";
import { current } from "tailwindcss/colors";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";

const LottiePlayPauseWithNoSSR = dynamic(
  () => import("../../components/LottiePlayPauseButton"),
  { ssr: false }
);

const progressBarStyle: CSSProperties = {
  position: "relative",
  height: "4px",
  width: "100%",
  backgroundColor: "#8d9092",
  cursor: "pointer",
  borderRadius: "2px",
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
  top: "0px", // Adjust this value based on the size of the dot to center it vertically
  left: `${percentage}%`,
  transform: "translateX(-50%)", // This ensures the center of the dot aligns with the current progress
  width: "4px", // Size of the dot
  height: "4px", // Size of the dot
  borderRadius: "50%",
  backgroundColor: "#FFFFFF", // Color of the dot
});

interface Song {
  title: string;
  artist: string;
  albumCoverUrl: string;
  audioSrc: string;
  audioLink?: string;
}

const AudioBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const songs: Song[] = useMemo(
    () => [
      {
        title: "Closer",
        artist: "lewisgoing & Avi8",
        albumCoverUrl: "/albumart/closer.jpg", // Adjust paths as necessary
        audioSrc: "./audio/closer.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/closer",
      },
      {
        title: "Winter '22 Samples",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/winter22.jpeg", // Adjust paths as necessary
        audioSrc: "./audio/winter22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/winter22?si=6464126a1a6d4fbdad72cda1978ba8b0&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      },
      {
        title: "2023 Samples",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/2023clips.jpeg", // Adjust paths as necessary
        audioSrc: "./audio/2023samples.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/whereimat?si=b18a4a36f49540789802800d35bc63c7&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      },

      {
        title: "New Paths",
        artist: "Pradaalife produced by lewisgoing",
        albumCoverUrl: "/albumart/newpaths.jpeg", // Adjust paths as necessary
        audioSrc: "./audio/newpaths.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/newpaths?si=cd069d336dcf4059840ede43a5d69a47&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      },

      // {
      //   title: "Harvey Specter",
      //   artist: "Pradaalife produced by lewisgoing",
      //   albumCoverUrl: "/albumart/harvey.jpeg", // Adjust paths as necessary
      //   audioSrc: "./audio/harvey.mp3",
      //   audioLink: "https://soundcloud.com/doss/extended-mix?si=21bcfd70b8094943b120d47fc4568b1b&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
      // },

      {
        title: "Midsummer '22 Clips",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/summer22.jpeg", // Adjust paths as necessary
        audioSrc: "./audio/midsummer22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/summer22?si=d4ea34a33f234e8b85472684a675be55&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
      },

      {
        title: "May '22 Clips",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/may22.jpeg", // Adjust paths as necessary
        audioSrc: "./audio/may22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/may?si=4880056ad4e94c3fa4b6285d08951427&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      },

      {
        title: "February '22 Clips",
        artist: "lewisgoing",
        albumCoverUrl: "/albumart/feb22.jpeg", // Adjust paths as necessary
        audioSrc: "./audio/feb22.mp3",
        audioLink: "https://soundcloud.com/lewisgoing/feb22?si=9a9c188a73a84cb78d6ac17fc76de175&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      },
    ],
    []
  );

  const handleProgressBarClick = (e) => {
    const clickX = e.nativeEvent.offsetX;
    const totalWidth = e.currentTarget.offsetWidth;
    const clickPercentage = (clickX / totalWidth) * 100;
    const newTime = (clickPercentage / 100) * duration;
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = newTime; // Use the ref here
    }
  };

  useEffect(() => {
    // Initialize the audio element on the client side
    if (typeof window !== "undefined" && !audioElementRef.current) {
      audioElementRef.current = new Audio(songs[currentTrackIndex].audioSrc);
    }
  }, []);

  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % songs.length;
      setCurrentTrackIndex(nextIndex);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    // Load new source if track changes
    if (audio.src !== songs[currentTrackIndex].audioSrc) {
      audio.src = songs[currentTrackIndex].audioSrc;
      audio.load();
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrackIndex, songs, isPlaying]);

  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      // Do not load the audio again; just pause
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const skipToNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % songs.length);
    if (!isPlaying) {
      setIsPlaying(true); // Ensure that playback starts if it was paused
    }
  };

  const playLastTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex - 1 < 0 ? songs.length - 1 : prevIndex - 1
    );
    if (!isPlaying) {
      setIsPlaying(true); // Ensure that playback starts if it was paused
    }
  };

  const currentSong = songs[currentTrackIndex];

const handleSongLinkClick = () => {
  const songLink = songs[currentTrackIndex].audioLink;
  if (songLink) {
    window.open(songLink, "_blank");
  }
}

const toggleMute = () => {
  const audio = audioElementRef.current;
  if (audio) {
    setIsMuted(!isMuted);
    audio.muted = !isMuted; // Mute or unmute the audio
  }
};


  // Format time to display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercentage = (currentTime / duration) * 100;
  // Define SVG paths
  const backLight = "/svg/player/back.svg";
  const backDark = "/svg/player/back-dark.svg";
  const nextLight = "/svg/player/next.svg";
  const nextDark = "/svg/player/next-dark.svg";
  // console.log("pre-render theme:" + theme + isDark);
  const backSrc = isDark ? backDark : backLight;
  const nextSrc = isDark ? nextDark : nextLight;

  const mobileAlbumCoverSize = 80; // Adjust the size of the album cover on mobile
  const mobileControlButtonSize = 24; // Adjust control button sizes on mobile

  return (
    <>
      {/* Desktop Styles */}

      <div
        className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col"
        // style={{ border: "1px red solid" }}
      >
        {/* Top Bar */}
        <div className="absolute left-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full"></div>
          {/* // bg-primary */}
          <button onClick={toggleMute} className="absolute right-0 top-0 z-[1] w-10 h-10 flex items-center justify-center m-3 rounded-full bg-tertiary/50">
        {isMuted ? (
          <VolumeX size={24} className="text-primary" />
        ) : (
          <Volume2 size={24} className="text-primary" />
        )}
      </button>
          {/* <FaCompactDisc
            size={40}
            className={"text-primary p-1"}
            style={{
              animation: "spin 2s linear infinite",
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          />{" "} */}

        <div
          className="w-full h-[80px] rounded-t-3xl flex-shrink-0" // bg-tertiary/50
        />
        <div
          className="m-3 flex flex-col h-full gap-2"
          // style={{ border: "1px solid blue" }}
        >
          {/* Middle Elements */}
          {/* Album Cover and Song Info */}
          <div
            className="flex flex-col h-full gap-1 items-center justify-center mt-[-48px]"
            // style={{ border: "1px solid red" }}
          >
            <div>
              <NextImage
                src={currentSong.albumCoverUrl}
                alt={currentSong.title}
                width={120}
                height={120}
                className="rounded-2xl object-cover "
              />
            </div>
            <div
              className="text-sm h-fit w-full px-2 py-1 rounded-lg leading-snug text-center"
              // style={{ border: "1px solid red" }}
            >
              <div className="text-center">{currentSong.title}</div>
              <div className="text-center text-[10px] pt-0.5 text-muted-foreground">
                {currentSong.artist}
              </div>
            </div>

            {/* Song duration and progress bar */}
            <div
              className="text-sm h-full w-full px-2 rounded-lg leading-snug mt-2 "
              // style={{ border: "1px solid red" }}
            >
              <div style={progressBarStyle} onClick={handleProgressBarClick}>
                <div
                  style={progressIndicatorStyle((currentTime / duration) * 100)}
                ></div>
                <div style={dotIndicatorStyle(progressPercentage)}></div>
              </div>
              <div className="flex flex-row pt-2">
                <div
                  className="text-[10px] text-primary text-left w-1/2"
                  // style={{ border: "1px solid red" }}
                >
                  {formatTime(currentTime)}
                </div>
                <div className="text-[10px] text-primary text-right w-1/2">
                  {formatTime(duration)}
                </div>
              </div>
            </div>
                      {/* Buttons */}
          <div
            className="flex flex-row w-full h-full rounded-lg items-center justify-between gap-1"
            // style={{ border: "1px red solid" }}
          >
            <div className="flex grow justify-center rounded-lg">
            <button className="info-icon cursor-pointer"
                >
                            <FaCompactDisc
            size={28}
            className={"text-primary"}
            style={{
              animation: "spin 2s linear infinite",
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          />{" "}
                {/* <HiQueueList size={28} className={"text-secondary"} /> */}
                              </button>
            </div>
            {/* Back */}
            <div
              className="flex grow justify-center  rounded-lg"
              onClick={playLastTrack}
            >
              <button className="cursor-pointer">
                <HiBackward size={36} className="text-primary" />


              </button>
            </div>

            {/* Play/Pause */}
            <div className="flex grow justify-center rounded-lg">
              <button>
                <LottiePlayPauseWithNoSSR
                  togglePlay={togglePlay}
                  isPlaying={isPlaying}
                  isDark={isDark}
                />
              </button>
            </div>

            {/* Next */}
            <div className="flex grow justify-center rounded-lg">
              <button onClick={skipToNextTrack} className="cursor-pointer">
                <HiForward
                  size={36}
                  className="rounded-3xl object-cover text-primary"
                />


              </button>
            </div>

            <div className="flex grow justify-center rounded-lg">
            <button className="info-icon cursor-pointer"
                onClick={handleSongLinkClick}>
              {
  songs[currentTrackIndex].audioLink 
    ? <div><ExternalLink href={songs[currentTrackIndex].audioLink}           className="text-primary z-[1] block" /></div>
    : <div><ExternalLink href={'/#'}           className="z-[1] block" /></div>
}
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
            <NextImage
              src={currentSong.albumCoverUrl}
              alt={currentSong.title}
              width={mobileAlbumCoverSize}
              height={mobileAlbumCoverSize}
              className="rounded-xl object-cover"
            />
                        <button onClick={togglePlay}     className="absolute top-[30px] left-1/2 transform -translate-x-1/2">
              <LottiePlayPauseWithNoSSR
                togglePlay={togglePlay}
                isPlaying={isPlaying}
                isDark={isDark}
              />
            </button>
            <div className="text-center">
              <div className="font-bold text-lg bento-sm:text-sm">{currentSong.title}</div>
              <div className="text-sm text-muted-foreground bento-sm:text-xs">{currentSong.artist}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mx-1">
          <div className="my-4 sm: my-3" style={progressBarStyle} onClick={handleProgressBarClick}>
            <div style={progressIndicatorStyle(progressPercentage)}></div>
            <div style={dotIndicatorStyle(progressPercentage)}></div>
          </div>
          </div>


          {/* Control Buttons
          <div className="flex justify-center gap-4">
            <button onClick={playLastTrack} className="text-primary">
              <HiBackward size={mobileControlButtonSize} />
            </button>
            <button onClick={togglePlay}>
              <LottiePlayPauseWithNoSSR
                togglePlay={togglePlay}
                isPlaying={isPlaying}
                isDark={isDark}
              />
            </button>
            <button onClick={skipToNextTrack} className="text-primary">
              <HiForward size={mobileControlButtonSize} />
            </button>
          </div> */}
        </div>
      </div>
          </>
  );
};

export default AudioBox;
