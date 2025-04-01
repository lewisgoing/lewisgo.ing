// components/about/AboutHero.tsx
// 'use cache;

import React, { useState } from 'react';
import ShaderGradientBox from '@/components/features/bento/boxes/ShaderGradientBox';
import { motion } from 'framer-motion';
import Image from '@/components/shared/ImageBox';
import { getSvgUrl } from '@/utils/blob-utils';

const AboutHero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full mb-16">
      {/* Heading with animated underline */}
      <motion.h1 
        className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <span className="relative">
          About Me
          <motion.span 
            className="absolute -bottom-1 left-0 h-1 bg-primary rounded"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              ease: [0.6, 0.05, 0.01, 0.9]
            }}
          />
        </span>
      </motion.h1>

      {/* Hero content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Left side: Avatar and shader gradient */}
        <div
          className="relative h-80 sm:h-96 overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* <ShaderGradientBox
            className="rounded-3xl w-full h-full absolute inset-0 z-0"
            animate="on"
            control="props"
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={10}
            rotationY={20}
            rotationZ={-5}
            color1="#FF0006"
            color2="#003FFF"
            color3="#4AA6FF"
            wireframe={false}
            shader="defaults"
            type="sphere"
            uAmplitude={1.4}
            uDensity={1.2}
            uFrequency={isHovered ? 2.0 : 1.5}
            uSpeed={isHovered ? 0.08 : 0.04}
            uStrength={1.4}
            cDistance={10}
            cameraZoom={20}
            cAzimuthAngle={0}
            cPolarAngle={90}
            uTime={2}
            lightType="3d"
            envPreset="dawn"
            reflection={0.4}
            brightness={1.9}
            grain="off"
            toggleAxis={false}
            hoverState="off"
          /> */}

          {/* relative w-72 h-72 object-cover rounded-3xl shadow-lg transition-all duration-300 */}

          {/* SVG overlay */}
          <Image
            src="https://media.licdn.com/dms/image/v2/D5603AQHmYV0R4GiEYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1697673632672?e=1748476800&v=beta&t=Q_7OaeI3pU10HBF_7FasbQqFV5wwlccXnhUaG0--N8U"
            alt="Profile Silhouette"
            fill
            className="rounded-3xl object-contain transition-opacity duration-500 absolute top-0 left-0 z-10"
            skeletonClassName="rounded-3xl"
            noRelative
            unoptimized
            priority
          />
        </div>

        {/* Right side: Intro text */}
        <div className="flex flex-col justify-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-semibold mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I&apos;m <span className="text-primary">Lewis Going</span>
          </motion.h2>
          
          <motion.div
            className="space-y-4 text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-lg">
              Full-stack developer, creative, and student with a passion for building engaging digital experiences.
            </p>
            <p>
              I combine technical expertise with creativity to craft interfaces that are both functional and delightful. 
              My approach merges careful attention to detail with a focus on user experience and performance.
            </p>
            <p>
              When I am not coding, you can find me producing music, exploring new technologies, or contributing to open-source projects.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-40 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl z-0"></div>
    </div>
  );
};

export default AboutHero;