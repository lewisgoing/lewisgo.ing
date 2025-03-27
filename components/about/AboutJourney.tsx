// components/about/AboutJourney.tsx
'use cache';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import ShaderGradientBox from '../boxes/ShaderGradientBox';
import SectionHeading from './SectionHeading';

// Timeline event type definition
interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  skills?: string[];
}

const journeyEvents: TimelineEvent[] = [
  {
    year: '2023-Present',
    title: 'University of Washington',
    subtitle: 'Computer Science Student',
    description: 'Pursuing advanced studies in Computer Science with focus on Human-Computer Interaction and Machine Learning.',
    skills: ['Algorithms', 'Systems Programming', 'Machine Learning', 'HCI']
  },
  {
    year: '2022-2023',
    title: 'Freelance Developer',
    subtitle: 'Web & Mobile Development',
    description: 'Designed and built custom applications for small businesses and startups, specializing in responsive web design and cross-platform mobile experiences.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Node.js']
  },
  {
    year: '2020-2022',
    title: 'Music Producer',
    subtitle: 'Independent Artist',
    description: 'Created and released original music, collaborated with other artists, and built an online presence through various streaming platforms.',
    skills: ['Ableton Live', 'Sound Design', 'Music Theory', 'Digital Marketing']
  },
  {
    year: '2018-2020',
    title: 'Community College',
    subtitle: 'Associate Degree',
    description: 'Completed foundational studies in Computer Science and General Education with honors.',
    skills: ['Java', 'Python', 'Data Structures', 'Calculus']
  }
];

const AboutJourney = () => {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  return (
    <section className="relative mb-16">
      {/* Section heading */}
      <SectionHeading 
        title="Professional Journey"
        subtitle="My path through education, work, and creative pursuits"
      />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-border z-0"></div>

        {/* Timeline events */}
        {journeyEvents.map((event, index) => (
          <motion.div 
            key={index}
            className={`relative mb-12 md:mb-16 ${
              index % 2 === 0 ? 'md:pr-10 md:ml-auto md:mr-0 md:text-right' : 'md:pl-10'
            } md:w-1/2`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredEvent(index)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            {/* Year bubble */}
            <div className="absolute top-1 left-0 md:left-auto md:right-0 md:translate-x-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`h-10 w-10 flex items-center justify-center rounded-full border-2 border-primary bg-background cursor-pointer transition-all duration-300 ${
                        hoveredEvent === index ? 'scale-110 shadow-glow' : ''
                      }`}
                    >
                      <span className="text-xs font-bold text-primary">{event.year.split('-')[0]}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side={index % 2 === 0 ? 'left' : 'right'}>
                    <p>{event.year}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Event card */}
            <div 
              className={`relative ml-12 md:ml-0 p-5 bg-secondary rounded-2xl border border-border transition-all duration-300 ${
                hoveredEvent === index ? 'shadow-md bg-secondary/80' : ''
              }`}
            >
              <h3 className="text-xl font-bold">{event.title}</h3>
              <h4 className="text-primary text-sm mb-2">{event.subtitle}</h4>
              <p className="text-muted-foreground text-sm mb-3">{event.description}</p>

              {/* Skills tags */}
              {event.skills && (
                <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                  {event.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="inline-block px-2 py-1 text-xs rounded-full bg-tertiary/50 text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Connector line to the main timeline */}
              <div 
                className={`absolute top-4 w-10 h-0.5 bg-border ${
                  index % 2 === 0 
                    ? 'right-full md:left-full mr-2 md:mr-0 md:ml-2' 
                    : 'left-full ml-2'
                }`}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative shader gradient */}
      <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 w-40 h-40 opacity-20 rounded-full overflow-hidden">
        <ShaderGradientBox
          className="w-full h-full"
          animate="on"
          control="props"
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          color1="#FF0006"
          color2="#003FFF" 
          color3="#E9D3B6"
          wireframe={false}
          shader="defaults"
          type="sphere"
          uAmplitude={1.0}
          uDensity={1.0}
          uFrequency={1.0}
          uSpeed={0.01}
          uStrength={1.5}
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
        />
      </div>
    </section>
  );
};

export default AboutJourney;