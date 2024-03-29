import React, { useState } from "react";
import ExternalLink from "../assets/ExternalLink";
import { FaSoundcloud } from "react-icons/fa";

const SoundcloudBox = () => {
    const [isHovered, setIsHovered] = useState(false);
    const iconStyle = {
        transition: 'color 0.3s ease',
        color: isHovered ? '#ff7700' : '#e5d3b8'
    };

  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-lg"         onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
      <FaSoundcloud className="absolute z-[1] text-primary w-16 h-16 bento-md:w-24 bento-md:h-24" style={iconStyle} />
      <ExternalLink href="https://soundcloud.com/lewisgoing" />
    </div>
  );
};

export default SoundcloudBox;
