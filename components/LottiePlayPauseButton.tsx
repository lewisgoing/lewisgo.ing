import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { dir } from 'console';

const LottiePlayPauseButton: React.FC<{ isPlaying: boolean, togglePlay: () => void }> = ({ isPlaying, togglePlay }) => {
    const [direction, setDirection] = useState(-1); // 1 for forward, -1 for reverse

  const playerRef = useRef<Player>(null);


  // URLs for light and dark mode Lottie animations
  const lightModeSrc = "https://lottie.host/0c031d29-23f9-46ec-8987-64bb837f1ced/G5VwoOdh07.json";
  const darkModeSrc = "https://lottie.host/398957f9-0589-4a70-a8c4-4267b07c7449/x82XthhdfI.json"; 

  useEffect(() => {

    if (playerRef.current) {
      playerRef.current.setPlayerDirection(direction);
      playerRef.current.play();
    }
  }, [direction]); 

  const toggleAnimationDirection = () => {

    console.log('input direction:', direction, 'output direction:', direction * -1)
    setDirection(direction * -1);

  };

  return (
    <div onClick={() => {toggleAnimationDirection(); togglePlay();}} style={{cursor: 'pointer', width: 40, height: 40 }}>
      <Player
        ref={playerRef}
        autoplay={false}
        loop={false}
        src={lightModeSrc}
        // src={darkMode ? darkModeSrc : lightModeSrc}
        style={{width: '100%', height: '100%'}}
        keepLastFrame={true}
      />
    </div>
  );
};

export default LottiePlayPauseButton;
