"use client";

import NextImage from 'next/image'

import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { FaCompactDisc } from 'react-icons/fa'

const audio = './test.mp3'

import LottiePlayPauseButton from "../../components/LottiePlayPauseButton";

const LottiePlayPauseWithNoSSR = dynamic(
  () => import("../../components/LottiePlayPauseButton"),
  {
    ssr: false,
  }
);

const AudioBox = () => {

    const [isPlaying, setIsPlaying] = useState(false)
    const [audioPlayer, setAudioPlayer] = useState(null)
    
    useEffect(() => {
        setAudioPlayer(new Audio(audio))
    }, [])
    
    const togglePlay = () => {
        if (isPlaying) {
            audioPlayer.pause()
        } else {
            audioPlayer.play()
        }
        setIsPlaying(!isPlaying)
    }
    
    return (
        <><div className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col">
            <div className="absolute top-5 left-4"></div>
            <div className="absolute right-0 top-0 z-[1] w-14 h-14 flex items-center justify-center m-3 rounded-full bg-primary">
                <FaCompactDisc size={50} className="text-secondary p-1" />
            </div>
            <div className="bg-tertiary/50 w-full h-[80px] rounded-t-3xl flex-shrink-0" />
            <div className="m-3 flex flex-col h-full gap-3">
                <div className="text-sm h-fit px-2 py-2 rounded-lg bg-tertiary/50 leading-snug">
                    <div>Song</div>
                    <div className="text-[10px] text-muted-foreground">
                        Artist(s)
                    </div>
                </div>
                {/* <div className="border-b border-black w-full"></div> */}
                <div className=" flex h-full px-8 py-4 rounded-lg bg-tertiary/50 leading-snug gap-2 items-center justify-between">
                    <div className="flex flex-row items-center justify-center w-full h-full rounded-lg">
                        <button className="text-black text-2xl m-2">
                            <NextImage
                                src="/svg/player/back.svg"
                                alt="Bento Box 2"
                                width={40}
                                height={40}
                                className="rounded-3xl object-cover"
                                unoptimized
                                priority />
                        </button>

                        <button className="text-black text-2xl m-2 items-center">
                            <LottiePlayPauseWithNoSSR />
                        </button>

                        <button className="text-black text-2xl m-2">
                            <NextImage
                                src="/svg/player/next.svg"
                                alt="Bento Box 2"
                                width={40}
                                height={40}
                                className="rounded-3xl object-cover"
                                unoptimized
                                priority />
                        </button>
                    </div>
                </div>
            </div>
        </div><div className="relative w-full h-full flex flex-col bento-lg:hidden">
                <div className="flex flex-col h-full gap-2 m-2 justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="text-black uppercase font-bold">Music</div>
                        <div className="text-black text-lg font-semibold">
                            Cold Sesame Noodles
                        </div>
                    </div>

                    {/* Full-width Divider */}
                    <div className="border-b border-black w-full"></div>

                    <div className="flex h-full py-1 px-2 bento-md:p-2 bg-tertiary/50 leading-snug gap-2 items-center rounded-2xl">
                        <button className="text-black text-2xl mx-2">⭘</button>
                        <button className="text-black text-2xl mx-2">▶</button>
                        <button className="text-black text-2xl mx-2">❚❚</button>
                    </div>
                </div>
            </div></>
    )
    }

export default AudioBox