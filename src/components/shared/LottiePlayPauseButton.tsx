// components/LottiePlayPauseButton.tsx

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieDarkSrc from 'public/lottie-dark.json';
import lottieLightSrc from 'public/lottie-light.json';

interface LottiePlayPauseButtonProps {
  isDark: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
}

const LottiePlayPauseButton = forwardRef<
  { setPlaying: (isPlaying: boolean) => void },
  LottiePlayPauseButtonProps
>(({ isDark, isPlaying, togglePlay }, ref) => {
  const playerRef = useRef<Player>(null);

  // Choose the correct Lottie animation based on theme
  const lottieSrc = isDark ? lottieDarkSrc : lottieLightSrc;

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    setPlaying: (playing: boolean) => {
      const player = playerRef.current;
      if (!player) return;

      if (playing) {
        player.setPlayerDirection(1);
        player.play();
      } else {
        player.setPlayerDirection(-1);
        player.play();
      }
    },
  }));

  // Handle animation direction based on playing state
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // Directly play or pause the animation based on isPlaying
    if (isPlaying) {
      // Ensure the animation plays from the beginning when played
      player.setPlayerDirection(1);
      player.play();
    } else {
      player.setPlayerDirection(-1);
      player.play();
    }
  }, [isPlaying]);

  // Prevent default and stop propagation to ensure click works
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{
        cursor: 'pointer',
        width: 36,
        height: 36,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      className="transition-all duration-200 hover:brightness-125"
    >
      <Player
        ref={playerRef}
        autoplay={false}
        loop={false}
        src={lottieSrc}
        style={{ width: '100%', height: '100%' }}
        keepLastFrame={true}
      />
    </div>
  );
});

LottiePlayPauseButton.displayName = 'LottiePlayPauseButton';

export default LottiePlayPauseButton;
