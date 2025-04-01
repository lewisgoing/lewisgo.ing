//components/boxes/GithubBox.tsx
import React, { useState } from 'react';
import ExternalLink from '@/components/assets/ExternalLink';
import { FaGithub } from 'react-icons/fa';

const GithubBox = () => {
  const [isHovered, setIsHovered] = useState(false);
  const iconStyle = {
    transition: 'color 0.3s ease',
    color: isHovered ? '#2dba4e' : '#e5d3b8',
    // color: isHovered ? '#24292E' : '#e5d3b8'
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FaGithub
        className="absolute z-[1] text-primary w-20 h-20 bento-md:w-24 bento-md:h-24 bento-xl:w-32 bento-xl:h-32"
        style={iconStyle}
      />
      <ExternalLink 
        href="https://github.com/lewisgoing" 
        iconSize={16}
        ariaLabel="View on Github"
        title="View my Github"
      />
    </div>
  );
};

export default GithubBox;