// components/about/AboutProjects.tsx
'use cache';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';
import Image from '../assets/ImageBox';
import Link from '../assets/Link';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import SectionHeading from './SectionHeading';

// Project type definition
interface Project {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  challenges: string;
  solutions: string;
}

// Sample projects
const projects: Project[] = [
  {
    title: "Personal Portfolio",
    description: "Interactive portfolio website with bento-style layout and real-time integrations",
    longDescription: "A modern personal website built with Next.js, featuring real-time Discord status integration, interactive music player, and GitHub contribution visualization. The site uses a responsive bento grid layout that works across all devices.",
    image: "/images/portfolio-project.webp",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    liveUrl: "https://lewisgo.ing",
    githubUrl: "https://github.com/lewisgoing/portfolio",
    challenges: "Creating a performant and visually engaging site with multiple real-time integrations while maintaining a clean, responsive design across devices.",
    solutions: "Implemented efficient data fetching with SWR, optimized animations for performance, and designed a flexible layout system that adapts to different screen sizes."
  },
  {
    title: "Audio Visualizer",
    description: "Real-time audio visualization using WebGL and the Web Audio API",
    longDescription: "A creative audio visualization tool that analyzes music in real-time and generates dynamic visual effects that respond to frequency data. Users can upload their own audio files or connect to streaming services.",
    image: "/images/audio-visualizer.webp",
    technologies: ["React", "WebGL", "Web Audio API", "Three.js", "GLSL"],
    liveUrl: "https://audio-viz.vercel.app",
    githubUrl: "https://github.com/lewisgoing/audio-visualizer",
    challenges: "Handling real-time audio processing while maintaining smooth visual performance, especially with complex 3D scenes.",
    solutions: "Implemented efficient audio analysis algorithms, optimized shader code, and used worker threads for processing to maintain 60fps even during complex visualizations."
  },
  {
    title: "AI Music Generator",
    description: "Browser-based tool for generating music loops using machine learning",
    longDescription: "An experimental web application that uses TensorFlow.js to run music generation models directly in the browser. The tool allows users to define parameters like tempo, key, and style to create custom audio loops.",
    image: "/images/ai-music.webp",
    technologies: ["React", "TensorFlow.js", "Web Audio API", "Node.js", "Express"],
    githubUrl: "https://github.com/lewisgoing/ai-music-generator",
    challenges: "Running complex machine learning models in the browser while keeping the application responsive and the interface intuitive for non-technical users.",
    solutions: "Optimized model size through quantization, implemented progressive loading, and designed an intuitive UI that abstracts the technical complexity while giving users creative control."
  }
];

const AboutProjects = () => {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const toggleProjectExpansion = (index: number) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  return (
    <section className="mb-16">
      {/* Section heading */}
      <SectionHeading 
        title="Projects"
        subtitle="Selected work and personal projects"
      />

      {/* Projects showcase */}
      <div className="space-y-16">
        {projects.map((project, index) => (
          <motion.div 
            key={index}
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Project image with hover effect */}
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                
                <Image
                  src={project.image || "/projects/project-1.png"}
                  alt={project.title}
                  fill
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                  skeletonClassName="rounded-2xl"
                />
                
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                  <p className="text-white/80 text-sm">{project.description}</p>
                </div>
                
                {/* Project links */}
                <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-full"
                      >
                        <FaGithub className="mr-1" /> GitHub
                      </Button>
                    </Link>
                  )}
                  
                  {project.liveUrl && (
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="rounded-full"
                      >
                        <MoveUpRight size={16} className="mr-1" /> Live Demo
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Project details */}
              <div>
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {expandedProject === index ? project.longDescription : project.description}
                </p>
                
                {/* Technology tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="px-3 py-1 text-xs rounded-full bg-tertiary/50 text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Expandable details */}
                <div 
                  className={`space-y-4 overflow-hidden transition-all duration-500 ${
                    expandedProject === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-primary">Challenges</h4>
                    <p className="text-sm text-muted-foreground">{project.challenges}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary">Solutions</h4>
                    <p className="text-sm text-muted-foreground">{project.solutions}</p>
                  </div>
                </div>
                
                {/* Read more/less button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 text-primary"
                  onClick={() => toggleProjectExpansion(index)}
                >
                  {expandedProject === index ? 'Read Less' : 'Read More'}
                </Button>
              </div>
            </div>
            
            {/* Decorative line between projects */}
            {index < projects.length - 1 && (
              <div className="w-full h-px bg-border my-8"></div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutProjects;