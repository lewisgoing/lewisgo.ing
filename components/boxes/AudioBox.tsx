import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaCompactDisc } from "react-icons/fa";
import NextImage from "next/image";

const LottiePlayPauseWithNoSSR = dynamic(
  () => import("../../components/LottiePlayPauseButton"),
  {
    ssr: false,
  }
);

const AudioBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState("/whatever.mp3"); // Ensure the path is correct. Consider using an absolute path if necessary.

    const audioSources = ["./whatever.mp3", "/call.mp3", "./trying.mp3", "./doss.mp3", "./cantstop.mp3"];

    useEffect(() => {
        if (!audioPlayer) {
          const audio = new Audio(audioSources[currentTrackIndex]);
          setAudioPlayer(audio);
          audio.addEventListener('ended', playNextTrackAutomatically);
          
          return () => audio.removeEventListener('ended', playNextTrackAutomatically);
        }
      }, [audioPlayer]);


  useEffect(() => {
    // Update source and play immediately when index changes
    if (audioPlayer) {
      audioPlayer.src = audioSources[currentTrackIndex];
      audioPlayer.load();
      if (isPlaying) {
        audioPlayer.play().catch(console.error);
      }
    }
  }, [currentTrackIndex]);

  // Play next track automatically when the current track ends
  const playNextTrackAutomatically = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioSources.length);
  };

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
        setCurrentTrackIndex((prevIndex) => prevIndex - 1 < 0 ? audioSources.length - 1 : prevIndex - 1);
      } else {
        audioPlayer.currentTime = 0;
        if (!isPlaying) {
          audioPlayer.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    }
  };
            

    const isDarkMode = true; // useDarkMode();

  return (
    <>
      <div className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col">
        <div className="absolute top-5 left-4"></div>
        <div className="absolute right-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full bg-primary">
          <FaCompactDisc size={50} className="text-secondary p-1" />
        </div>
        <div className="bg-tertiary/50 w-full h-[80px] rounded-t-3xl flex-shrink-0" />
        <div className="m-3 flex flex-col h-full gap-3">
          <div className="text-sm h-full px-2 py-2 rounded-lg bg-tertiary/50 leading-snug">
            <div>Song</div>
            <div className="text-[10px] text-muted-foreground">Artist(s)</div>
          </div>
          {/* <div className="text-sm h-fit px-2 py-2 rounded-lg bg-tertiary/50 leading-snug">
            <div>Song</div>
            <div className="text-[10px] text-muted-foreground">Artist(s)</div>
          </div> */}
          {/* <div className="border-b border-black w-full"></div> */}
          <div
            
            className="flex flex-row w-full h-fit rounded-lg bg-tertiary/50 gap-2 items-center justify-between"
          >
            <div className="flex grow justify-center" onClick={playLastTrack}>
              <button className="text-black text-2xl py-2 px-2">
                <NextImage
                  src={isDarkMode ? "/svg/player/back-dark.svg" : "/svg/player/back.svg"}
                  alt="Bento Box 2"
                  width={36}
                  height={36}
                  className="rounded-3xl object-cover"
                  unoptimized
                  priority
                />
              </button>
            </div>

            <div className="flex grow justify-center">
              <button className="text-black text-2xl py-2 px-2" >
                <LottiePlayPauseWithNoSSR togglePlay={togglePlay} isPlaying={isPlaying}
                />
              </button>
            </div>

            <div className="flex grow justify-center">
              <button className="text-black text-2xl py-2 px-2" onClick={skipToNextTrack}>
                <NextImage
                  src={isDarkMode ? "/svg/player/next-dark.svg" : "/svg/player/next.svg"}
                  alt="Bento Box 2"
                  width={36}
                  height={36}
                  className="rounded-3xl object-cover"
                  unoptimized
                  priority
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col bento-lg:hidden">
        <div className="flex flex-col h-full gap-2 m-2 justify-between">
          <div className="flex gap-2 items-center">
            <div className="text-black uppercase font-bold">Music</div>
            <div className="text-black text-lg font-semibold">Songname</div>
          </div>

          {/* Full-width Divider */}
          <div className="border-b border-black w-full"></div>

          <div className="flex h-full py-1 px-2 bento-md:p-2 bg-tertiary/50 leading-snug gap-2 items-center rounded-2xl">
            <button className="text-black text-2xl mx-2">⭘</button>
            <button className="text-black text-2xl mx-2">
            <LottiePlayPauseWithNoSSR togglePlay={togglePlay} isPlaying={isPlaying}
                />
            </button>
            <button className="text-black text-2xl mx-2">❚❚</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioBox;
