// components/LottiePlayPauseButton.tsx

import React, { useRef, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import lottieDarkSrc from "../public/lottie-light.json";
import lottieLightSrc from "../public/lottie-light-old.json";

const LottiePlayPauseButton: React.FC<{
  isDark: boolean,
  isPlaying: boolean,
  togglePlay: () => void
}> = ({ isDark, isPlaying, togglePlay }) => {
  const playerRef = useRef<Player>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Choose the correct Lottie animation based on theme
  const lottieSrc = isDark ? lottieDarkSrc : lottieLightSrc;

  // Control play and pause based on isPlaying prop
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
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
      ref={containerRef}
      onClick={handleClick} 
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{ 
        cursor: "pointer", 
        width: 36, 
        height: 36, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <Player
        ref={playerRef}
        autoplay={false}
        loop={false}
        src={lottieSrc}
        style={{ width: "100%", height: "100%" }}
        keepLastFrame={true}
      />
    </div>
  );
};

export default LottiePlayPauseButton;