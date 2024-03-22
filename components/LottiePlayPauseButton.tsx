import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottiePlayReverse: React.FC = () => {
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for reverse
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setPlayerDirection(direction);
      if (isPlaying) {
        playerRef.current.play();
      }
    }
  }, [direction, isPlaying]);

  const toggleAnimationDirection = () => {
    setIsPlaying(true); // Ensure animation is set to play
    setDirection((prevDirection) => (prevDirection === 1 ? -1 : 1));
  };

  // Listen for complete event to stop the animation at the last or first frame
  const handleComplete = () => {
    if (direction === -1) {
      // If the animation has played in reverse, set it to not play (pause at the first frame)
      setIsPlaying(false);
    }
  };

  return (
    <div onClick={toggleAnimationDirection} style={{ cursor: 'pointer', width: '40%', height: '40%' }}>
      <Player
        ref={playerRef}
        autoplay={false}
        loop={false}
        src="https://lottie.host/0c031d29-23f9-46ec-8987-64bb837f1ced/G5VwoOdh07.json"
        style={{ width: '100%', height: '100%' }}
        keepLastFrame={true}
        onEvent={(event) => {
          if (event === 'complete') {
            handleComplete();
          }
        }}
      />
    </div>
  );
};

export default LottiePlayReverse;
