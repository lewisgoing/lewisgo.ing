// components/boxes/SoundcloudBox.tsx

import React, { useState } from 'react';
import ExternalLink from '../assets/ExternalLink';
import { FaSoundcloud } from 'react-icons/fa';
import { MoveUpRight } from 'lucide-react';

const SoundcloudBox = () => {
  const [isHovered, setIsHovered] = useState(false);
  const iconStyle = {
    transition: 'color 0.3s ease',
    color: isHovered ? '#ff7700' : '#e5d3b8',
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FaSoundcloud
        className="absolute z-[1] text-primary w-16 h-16 bento-md:w-24 bento-md:h-24"
        style={iconStyle}
      />
      {/* <ExternalLink href="https://soundcloud.com/lewisgoing" /> */}
      <a
        href={'https://soundcloud.com/lewisgoing'}
        aria-label="Listen on Soundcloud"
        title="Listen to my music"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary"
      >
        <MoveUpRight size={16} />
      </a>
    </div>
  );
};

export default SoundcloudBox;
