// components/boxes/CurrentActivitiesBox.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShaderGradientBox from './ShaderGradientBox';
import { cn } from '../../src/utils/tailwind-helpers';
import Link from 'next/link';

interface ActivityLink {
  text: string;
  url: string;
}

interface Activity {
  emoji: string;
  label: string;
  content: string;
  links?: ActivityLink[];
}

interface CurrentActivitiesBoxProps {
  className?: string;
  animate?: boolean;
  title?: string;
  activities?: Activity[];
  gradientConfig?: {
    color1?: string;
    color2?: string;
    color3?: string;
  };
}

const CurrentActivitiesBox: React.FC<CurrentActivitiesBoxProps> = ({ 
  className,
  animate = true,
  title = "Currently",
  gradientConfig,
  activities: customActivities
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default activities with links
  const defaultActivities: Activity[] = [
    { 
      emoji: '📺', 
      label: 'Watching', 
      content: 'Severance'
    },
    { 
      emoji: '🎧', 
      label: 'Interested in', 
      content: 'Ambient & Brian Eno',
      links: [
        { text: 'Ambient', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY' },
        { text: 'Brian Eno', url: 'https://open.spotify.com/artist/7MSUfLeTdDEoZiJPDSBXgi' }
      ]
    },
    { 
      emoji: '🎵', 
      label: 'Song of the week', 
      content: 'Closer'
    },
    { 
      emoji: '🔥', 
      label: 'Excited about', 
      content: 'Serum 2!' 
    },
    { 
      emoji: '💪', 
      label: 'Training', 
      content: 'Cardio' 
    },
  ];
  
  // Use custom activities if provided, otherwise use defaults
  const activities = customActivities || defaultActivities;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] },
    },
    hover: {
      x: 8,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden rounded-3xl", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shader Gradient Background */}
      <ShaderGradientBox
        className="rounded-3xl object-cover transition-opacity duration-300 skeleton"
        animate="on"
        control="props"
        positionX={1.2}
        positionY={0}
        positionZ={0}
        rotationX={50}
        rotationY={20}
        rotationZ={-60}
        color1={gradientConfig?.color1 || "#606080"}
        color2={gradientConfig?.color2 || "#ffbe7b"}
        color3={gradientConfig?.color3 || "#212121"}
        wireframe={false}
        shader="a"
        type="waterPlane"
        uAmplitude={1.4}
        uDensity={1.5}
        uFrequency={1.0}
        uSpeed={0.1}
        uStrength={1.5}
        cDistance={2.8}
        cameraZoom={29}
        cAzimuthAngle={180}
        cPolarAngle={80}
        uTime={4}
        lightType="3d"
        reflection={0.4}
        brightness={0.27}
        grain="on"
        toggleAxis={false}
        hoverState="off"
        enableTransition={true}
      />

      {/* Content Panel */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 py-6 bento-md:p-5 bento-lg:p-6 z-10">
        <AnimatePresence>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="relative bg-secondary/40 border border-primary/10 rounded-2xl p-4 overflow-hidden"
          >
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <motion.h2 
                  className="text-lg bento-md:text-xl font-bold text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {title}
                </motion.h2>
                <motion.div 
                  className="ml-auto h-1 w-10 bg-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "2.5rem" }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </div>
              
              <motion.ul 
                className="space-y-2 bento-md:space-y-2.5 text-white"
                initial="hidden"
                animate={animate ? "visible" : "hidden"}
                variants={containerVariants}
              >
                {activities.map((activity, index) => (
                  <motion.li 
                    key={index} 
                    className={cn(
                      "flex items-start rounded-xl transition-all duration-300 p-2 overflow-hidden",
                      activeItem === index 
                        ? "bg-tertiary/40 border border-primary/20" 
                        : "border border-transparent hover:bg-tertiary/20"
                    )}
                    variants={itemVariants}
                    whileHover="hover"
                    onMouseEnter={() => setActiveItem(index)}
                    onMouseLeave={() => setActiveItem(null)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 mr-3 flex-shrink-0">
                      <span className="text-base bento-md:text-lg">{activity.emoji}</span>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <span className="text-primary/80 text-xs bento-md:text-sm font-medium uppercase tracking-wider">
                        {activity.label}
                      </span>
                      
                      <div className="font-medium text-sm bento-md:text-base text-white">
                        {activity.links ? (
                          <span className="flex flex-wrap items-center gap-1">
                            {activity.content.split(/(&|and|\+)/).map((part, i) => {
                              // Check if this part matches any link text
                              const link = activity.links?.find(l => 
                                part.trim() === l.text || 
                                part.includes(l.text)
                              );
                              
                              if (link) {
                                return (
                                  <Link 
                                    key={i} 
                                    href={link.url} 
                                    target="_blank"
                                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                                  >
                                    {link.text}
                                  </Link>
                                );
                              }
                              
                              // Handle connectors
                              if (part.trim() === '&' || part.trim() === 'and') {
                                return <span key={i} className="mx-0.5">&</span>;
                              }
                              
                              // Plain text (if not matching any link)
                              return part.trim() ? <span key={i}>{part}</span> : null;
                            })}
                          </span>
                        ) : (
                          <span>{activity.content}</span>
                        )}
                      </div>
                    </div>
                    
                    {activeItem === index && (
                      <motion.div 
                        className="ml-1 opacity-70"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.7, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </motion.div>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrentActivitiesBox;