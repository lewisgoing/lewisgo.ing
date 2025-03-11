//components/boxes/GithubBox.tsx
import React, { useState } from 'react';
import ExternalLink from '../assets/ExternalLink';
import { FaGithub } from 'react-icons/fa';
import { MoveUpRight } from 'lucide-react';

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
        className="absolute z-[1] text-primary w-20 h-20 bento-md:w-24 bento-md:h-24"
        style={iconStyle}
      />
      {/* <SilhouetteHover
      silhouetteSrc="/static/images/bento/bento-github-silhouette.svg"
      silhouetteAlt="Bento Github Silhouette"
      mainSrc="../public/images/github.svg"
      mainAlt="Bento Github"
      className="rounded-3xl object-cover"
    /> */}
      {/* <ExternalLink href="https://github.com/lewisgoing" /> */}
      <a
        href={'https://github.com/lewisgoing'}
        aria-label="View on Github"
        title="View my Github"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary"
      >
        <MoveUpRight size={16} />
      </a>
    </div>
  );
};

export default GithubBox;
