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
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState("/whatever.mp3"); // Ensure the path is correct. Consider using an absolute path if necessary.

  useEffect(() => {
    // Only create a new Audio instance if audioPlayer hasn't been initialized
    if (!audioPlayer) {
      const audio = new Audio(audioSrc);
      setAudioPlayer(audio);
    } else {
      // If audioPlayer already exists but src has changed, update src and load
      audioPlayer.src = audioSrc;
      audioPlayer.load();
    }
  }, [audioSrc, audioPlayer]);

  const togglePlay = () => {
    if (audioPlayer) {
        if (isPlaying) {
          audioPlayer.pause();
        } else {
          audioPlayer.play().catch(console.error);
        }
        setIsPlaying(!isPlaying); // This should be sufficient to toggle both audio and animation
      }
    }


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
            
            className="flex flex-row w-full h-fit  rounded-lg bg-tertiary/50 leading-snug gap-2 items-center justify-between"
          >
            <div>
              <button className="text-black text-2xl py-2 px-4">
                <NextImage
                  src="/svg/player/back.svg"
                  alt="Bento Box 2"
                  width={40}
                  height={40}
                  className="rounded-3xl object-cover"
                  unoptimized
                  priority
                />
              </button>
            </div>

            <div s>
              {/* <button className="text-black text-2xl py-2 px-4" > */}
                <LottiePlayPauseWithNoSSR togglePlay={togglePlay} isPlaying={isPlaying}
                />
              {/* </button> */}
            </div>

            <div >
              <button className="text-black text-2xl py-2 px-4">
                <NextImage
                  src="/svg/player/next.svg"
                  alt="Bento Box 2"
                  width={40}
                  height={40}
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
            <button className="text-black text-2xl mx-2" onClick={togglePlay}>
              <LottiePlayPauseWithNoSSR
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
