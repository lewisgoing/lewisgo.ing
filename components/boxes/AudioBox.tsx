import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import NextImage from "next/image";
import { HiForward, HiBackward, HiQueueList, HiInformationCircle } from "react-icons/hi2";
import { FaCompactDisc } from "react-icons/fa";

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
  backgroundColor: "#e6d2b8",
});

const dotIndicatorStyle = (percentage: number): CSSProperties => ({
  position: "absolute",
  top: "0px", // Adjust this value based on the size of the dot to center it vertically
  left: `${percentage}%`,
  transform: "translateX(-50%)", // This ensures the center of the dot aligns with the current progress
  width: "4px", // Size of the dot
  height: "4px", // Size of the dot
  borderRadius: "50%",
  backgroundColor: "#e6d2b8", // Color of the dot
});

const AudioBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const audioSources = useMemo(
    () => [
      "./audio/closer.mp3",
      "./audio/nirvana.mp3",
      "./audio/whatever.mp3",
      "/audio/call.mp3",
      "./audio/trying.mp3",
      "./audio/doss.mp3",
      "./audio/cantstop.mp3",
    ],
    []
  );

  const playNextTrackAutomatically = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioSources.length);
  }, [audioSources.length]);

  const handleProgressBarClick = (e) => {
    const clickX = e.nativeEvent.offsetX;
    const totalWidth = e.currentTarget.offsetWidth;
    const clickPercentage = (clickX / totalWidth) * 100;
    const newTime = (clickPercentage / 100) * duration;
    if (audioPlayer) {
      audioPlayer.currentTime = newTime;
    }

    };

  useEffect(() => {
    const audio = new Audio(audioSources[currentTrackIndex]);
    setAudioPlayer(audio);
    audio.addEventListener("ended", playNextTrackAutomatically);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    return () => {
      audio.removeEventListener("ended", playNextTrackAutomatically);
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("timeupdate", () => {});
    };
  }, [audioSources, currentTrackIndex, playNextTrackAutomatically]);

  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.src = audioSources[currentTrackIndex];
      audioPlayer.load();
      setDuration(audioPlayer.duration);
      if (isPlaying) {
        audioPlayer.play().catch(console.error);
      }
    }
  }, [currentTrackIndex, audioPlayer, audioSources, isPlaying]);

  const togglePlay = () => {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipToNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioSources.length);
  };

  const playLastTrack = () => {
    if (audioPlayer) {
      if (audioPlayer.currentTime < 5) {
        setCurrentTrackIndex((prevIndex) =>
          prevIndex - 1 < 0 ? audioSources.length - 1 : prevIndex - 1
        );
      } else {
        audioPlayer.currentTime = 0;
        if (!isPlaying) {
          audioPlayer.play().catch(console.error);
          setIsPlaying(true);
        }
      }
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
  console.log("pre-render theme:" + theme + isDark);
  const backSrc = isDark ? backDark : backLight;
  const nextSrc = isDark ? nextDark : nextLight;

  return (
    <>
      {/* Desktop Styles */}
      {/* <div className="hidden bento-lg:absolute w-full h-full bento-lg:flex flex-col">
              <NextImage
                src="/albumart/feb22.jpeg"
                alt="Bento Box 2"
                width={300}
                height={300}
                className="rounded-2xl object-cover "
              />
            </div> */}
      <div
        className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col"
        // style={{ border: "1px red solid" }}
      >
        {/* Top Bar */}
        <div className="absolute left-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full"></div>
        <div className="absolute right-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full bg-primary">
          {/* // bg-primary */}
          <FaCompactDisc
            size={50}
            className={"text-secondary p-1"}
            style={{
              animation: "spin 2s linear infinite",
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          />{" "}
        </div>

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
            className="flex flex-col h-full gap-2  items-center justify-center mt-[-66px]"
            // style={{ border: "1px solid red" }}
          >
            <div>
              <NextImage
                src="/albumart/feb22.jpeg"
                alt="Bento Box 2"
                width={104}
                height={104}
                className="rounded-2xl object-cover "
              />
            </div>
            <div
              className="text-sm h-fit w-full px-2 rounded-lg leading-snug text-center"
              // style={{ border: "1px solid red" }}
            >
              <div>Closer</div>
              <div className="text-[10px] text-muted-foreground">
                lewisgoing
              </div>
            </div>

            {/* Song duration and progress bar */}
            <div
              className="text-sm h-full w-full px-2 rounded-lg leading-snug mt-2"
              // style={{ border: "1px solid red" }}
            >
              <div style={progressBarStyle} onClick={handleProgressBarClick} >
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
          </div>
          {/* Buttons */}
          <div
            className="flex flex-row w-full h-fit rounded-lg items-center justify-between"
            // style={{ border: "1px red solid" }}
          >
            <div className="flex grow justify-center  rounded-lg">
              <button                className="cursor-pointer"
>
                <HiInformationCircle size={28} className={"text-primary"} />
              </button>
            </div>
            {/* Back */}
            <div
              className="flex grow justify-center  rounded-lg"
              onClick={playLastTrack}
            >
              <button
                              className="cursor-pointer"

              >
                <HiBackward
                  size={36}
                  className="text-primary"
                />

                {/* <NextImage
                  src={backSrc}
                  alt="Bento Box 2"
                  width={40}
                  height={40}
                  className="rounded-3xl object-cover"
                /> */}
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
              <button
                onClick={skipToNextTrack}
                className="cursor-pointer"

              >
                <HiForward
                  size={36}
                  className="rounded-3xl object-cover text-primary"
                />

                {/* <NextImage
                  src={nextSrc}
                  alt="Next"
                  width={40}
                  height={40}
                  className="rounded-3xl object-cover"
                  unoptimized
                /> */}
              </button>
            </div>

            <div className="flex grow justify-center rounded-lg">
              <button                className="cursor-pointer"
>
              <HiQueueList size={28} className={"text-primary"} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Styles */}
      <div className="relative w-full h-full flex flex-col bento-lg:hidden">
        <div className="flex flex-col h-full gap-2 m-2 justify-between">
          <div className="flex gap-2 items-center">
            <div className="text-black uppercase font-bold">Song</div>
            <div className="text-[10px] text-muted-foreground">Artist</div>
          </div>

          {/* Full-width Divider */}

          <div className="flex h-full py-1 px-2 bento-md:p-2 bg-tertiary/50 leading-snug gap-2 items-center rounded-2xl">
            <button className="text-black text-2xl py-2 px-2">
              <HiBackward
                size={40}
                className="rounded-3xl object-cover text-primary"
              />

              {/* <NextImage
                src={isDark ? nextLight : nextDark}
                alt="Next"
                width={40}
                height={40}
                className="rounded-3xl object-cover"
                unoptimized
              /> */}
            </button>
            <button className="text-black text-2xl py-2 px-2 text-primary">
              <LottiePlayPauseWithNoSSR
                togglePlay={togglePlay}
                isPlaying={isPlaying}
                isDark={isDark}
              />
            </button>
            <button
              className="text-black text-2xl py-2 px-2"
              onClick={skipToNextTrack}
            >
              <HiForward
                size={40}
                className="rounded-3xl object-cover text-primary"
              />

              {/* <NextImage
                src={
                  isDark ? "/svg/player/next-dark.svg" : "/svg/player/next.svg"
                }
                alt="Bento Box 2"
                width={36}
                height={36}
                className="rounded-3xl object-cover"
                unoptimized
                priority
              /> */}
            </button>{" "}
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <>
  //     {/* Desktop Styles */}
  //     <div className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col">
  //       {/* Top Bar */}
  //       <div className="absolute top-5 left-4"></div>
  //       <div className="absolute right-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full bg-primary">
  //         <FaCompactDisc
  //           size={50}
  //           className={"text-secondary p-1"}
  //           style={{
  //             animation: "spin 2s linear infinite",
  //             animationPlayState: isPlaying ? "running" : "paused",
  //           }}
  //           // className={`text-secondary p-1 ${isPlaying ? "spin" : ""}`}
  //         />{" "}
  //       </div>

  //       <div className="bg-tertiary/50 w-full h-[80px] rounded-t-3xl flex-shrink-0" />
  //       <div className="m-3 flex flex-col h-full gap-3">
  //         {/* Middle Elements */}
  //         <div className="flex flex-row h-full gap-3">
  //           <div className="text-sm h-full w-1/2 px-2 py-2 rounded-lg bg-tertiary/50 leading-snug">
  //             <div>Song</div>
  //             <div className="text-[10px] text-muted-foreground">Artist(s)</div>
  //           </div>

  //           <div className="text-sm h-full w-1/2 px-2 py-2 rounded-lg bg-tertiary/50 leading-snug">
  //           </div>
  //         </div>

  //         {/* <div className="text-sm h-fit px-2 py-2 rounded-lg bg-tertiary/50 leading-snug">
  //           <div>Song</div>
  //           <div className="text-[10px] text-muted-foreground">Artist(s)</div>
  //         </div> */}
  //         {/* <div className="border-b border-black w-full"></div> */}
  //         {/* Buttons */}
  //         <div className="flex flex-row w-full h-fit rounded-lg gap-2 items-center justify-between bg-tertiary/50">
  //           <div
  //             className="flex grow justify-center  rounded-lg"
  //             onClick={playLastTrack}
  //           >
  //             <button className="text-black text-2xl py-2 px-2">
  //               <NextImage
  //                 src={backSrc}
  //                 alt="Bento Box 2"
  //                 width={40}
  //                 height={40}
  //                 className="rounded-3xl object-cover"
  //               />
  //             </button>
  //           </div>

  //           <div className="flex grow justify-center rounded-lg">
  //             <button className="text-black text-2xl py-2 px-2">
  //               <LottiePlayPauseWithNoSSR
  //                 togglePlay={togglePlay}
  //                 isPlaying={isPlaying}
  //                 isDark={isDark}
  //               />
  //             </button>
  //           </div>

  //           <div className="flex grow justify-center rounded-lg">
  //             <button
  //               className="text-black text-2xl py-2 px-2"
  //               onClick={skipToNextTrack}
  //             >
  //               <NextImage
  //                 src={nextSrc}
  //                 alt="Next"
  //                 width={40}
  //                 height={40}
  //                 className="rounded-3xl object-cover"
  //                 unoptimized
  //               />
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     {/* Mobile Styles */}
  //     <div className="relative w-full h-full flex flex-col bento-lg:hidden">
  //       <div className="flex flex-col h-full gap-2 m-2 justify-between">
  //         <div className="flex gap-2 items-center">
  //           <div className="text-black uppercase font-bold">Song</div>
  //           <div className="text-[10px] text-muted-foreground">Artist</div>
  //         </div>

  //         {/* Full-width Divider */}

  //         <div className="flex h-full py-1 px-2 bento-md:p-2 bg-tertiary/50 leading-snug gap-2 items-center rounded-2xl">
  //           <button className="text-black text-2xl py-2 px-2">
  //             <NextImage
  //               src={isDark ? nextLight : nextDark}
  //               alt="Next"
  //               width={40}
  //               height={40}
  //               className="rounded-3xl object-cover"
  //               unoptimized
  //             />
  //           </button>
  //           <button className="text-black text-2xl py-2 px-2">
  //             <LottiePlayPauseWithNoSSR
  //               togglePlay={togglePlay}
  //               isPlaying={isPlaying}
  //               isDark={isDark}
  //             />
  //           </button>
  //           <button
  //             className="text-black text-2xl py-2 px-2"
  //             onClick={skipToNextTrack}
  //           >
  //             <NextImage
  //               src={
  //                 isDark ? "/svg/player/next-dark.svg" : "/svg/player/next.svg"
  //               }
  //               alt="Bento Box 2"
  //               width={36}
  //               height={36}
  //               className="rounded-3xl object-cover"
  //               unoptimized
  //               priority
  //             />
  //           </button>{" "}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default AudioBox;
