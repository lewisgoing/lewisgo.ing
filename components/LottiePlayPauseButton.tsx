import React, { useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import lottieDarkSrc from "../public/lottie-light.json";
import lottieLightSrc from "../public/lottie-light-old.json";

const LottiePlayPauseButton: React.FC<{
  isDark: boolean,
  isPlaying: boolean,
  togglePlay: () => void
}> = ({ isDark, isPlaying, togglePlay }) => {
  const playerRef = useRef<Player>(null);

  // Choose the correct Lottie animation based on theme
  const lottieSrc = isDark ? lottieDarkSrc : lottieLightSrc;

  // Control play and pause based on isPlaying prop
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
      // When pausing, ensure the animation stops at the last frame for pause icon
      // player.stop(); // Stopping the animation may be more appropriate here to ensure it resets correctly
      // Optionally, you could seek to a specific frame if needed for visual consistency
    }
  }, [isPlaying]);

  return (
    <div onClick={togglePlay} style={{ cursor: "pointer", width: 36, height: 36 }}>
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
