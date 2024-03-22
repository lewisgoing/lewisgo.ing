import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const audio = './test.mp3'

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
        <div className="audio-box">
        <button onClick={togglePlay}>
        <Image src={'public/svg/player/pause.svg'} alt="play" width={20} height={20} />
        {/* <Image src={isPlaying ? 'public/svg/player/pause.svg' : 'public/svg/player/play.svg'} alt="play" width={20} height={20} /> */}
        </button>
        </div>
    )
    }