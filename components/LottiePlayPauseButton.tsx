import React, { useState, useEffect, useRef } from "react";
import { Player, PlayerDirection } from "@lottiefiles/react-lottie-player";
import { dir } from "console";
import lottieDarkSrc from "../public/lottie-dark.json";
import lottieLightSrc from "../public/lottie-light.json";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

const LottiePlayPauseButton: React.FC<{
  isDark: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
}> = ({ isDark, isPlaying, togglePlay }) => {
  const [direction, setDirection] = useState<PlayerDirection>(-1);
  const playerRef = useRef<Player>(null);

  // URLs for light and dark mode Lottie animations
  // const lightModeSrc = "https://lottie.host/0c031d29-23f9-46ec-8987-64bb837f1ced/G5VwoOdh07.json";
  const lightModeSrc = "../public/lottie-light.json";
  // const darkModeSrc = "https://lottie.host/398957f9-0589-4a70-a8c4-4267b07c7449/x82XthhdfI.json";
  const darkModeSrc = "../public/lottie-dark.json";

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setPlayerDirection(direction);
      playerRef.current.play();
    }
  }, [direction]);

  const toggleDirection = () => {
    setDirection((prevDirection) => (prevDirection === 1 ? -1 : 1));
  };

  // TODO: Implement dark mode detection

  const lottieSrc = isDark ?  lottieLightSrc : lottieDarkSrc;

  return (
    <div
      onClick={() => {
        toggleDirection();
        togglePlay();
      }}
      style={{ cursor: "pointer", width: 40, height: 40 }}
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
