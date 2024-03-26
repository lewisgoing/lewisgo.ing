import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottiePlayPauseButton: React.FC = () => {
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for reverse
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Player>(null);
  const [darkMode, setDarkMode] = useState(false); // Simulate dark mode detection
  const audioRef = useRef<HTMLAudioElement>(null);


  // URLs for light and dark mode Lottie animations
  // const lightModeSrc = "https://lottie.host/398957f9-0589-4a70-a8c4-4267b07c7449/x82XthhdfI.json";

  
  const lightModeSrc = "https://lottie.host/0c031d29-23f9-46ec-8987-64bb837f1ced/G5VwoOdh07.json";
  const darkModeSrc = "https://lottie.host/398957f9-0589-4a70-a8c4-4267b07c7449/x82XthhdfI.json"; // Replace with your dark mode animation URL

  const audio = '../public/test.mp3'



  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setPlayerDirection(direction);
      if (isPlaying && playerRef.current) {
        playerRef.current.play();
      }
    }

    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }  else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [direction, isPlaying]); 

  const toggleAnimationDirection = () => {
    setIsPlaying(true); // Ensure animation is set to play
    setDirection(prevDirection => prevDirection === 1 ? -1 : 1);
  };

  const handleComplete = () => {
    if (direction === -1) {
      setIsPlaying(false); 
    }
    if (audioRef.current) {
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
    }
  };

  // Example toggle for dark mode (for demonstration purposes)
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div onClick={toggleAnimationDirection} style={{cursor: 'pointer' }}>
      <audio ref={audioRef} src={audio} />
      <Player
        ref={playerRef}
        autoplay={false}
        loop={false}
        src={darkMode ? darkModeSrc : lightModeSrc}
        style={{width: 40, height: 40}}
        // style={{ width: '100%', height: '100%' }}
        keepLastFrame={true}
        onEvent={event => {
          if (event === 'complete') {
            handleComplete();
          }
        }}
      />
    </div>
  );
};

export default LottiePlayPauseButton;
