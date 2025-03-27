// components/boxes/ProjectsBox.tsx
// Since we're using the Pages Router, we can't use 'use cache' directive

import React, { useState, useCallback, useEffect } from 'react';
import { MoveUpRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import ImageBox from '../assets/ImageBox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../src/utils/tailwind-helpers';
import { getSvgUrl } from '../../src/utils/blob-utils';
import { Project, getAllProjects } from '../../src/types/old-projects';
import { useRouter } from 'next/router';
import ExternalLink from '../assets/ExternalLink';

const ProjectsBox = () => {
  const router = useRouter();
  
  // Get all projects from our types
  const allProjects = getAllProjects();
  
  // Prioritize featured projects first
  const projects = [...allProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the Discord SVG for all project thumbnails
  const discordImageUrl = getSvgUrl('discord.svg');
  
  // Get current project
  const currentProject = projects[currentIndex];
  
  // Navigation functions with useCallback for optimization
  const nextProject = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  }, [projects.length]);
  
  const prevProject = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  }, [projects.length]);
  
  // Handle view project click
  const viewProject = useCallback(() => {
    router.push(`/projects/${currentProject.id}`);
  }, [router, currentProject]);
  
  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation if the component is focused
      if (document.activeElement?.closest('[data-projects-box="true"]')) {
        if (e.key === 'ArrowRight') {
          nextProject();
        } else if (e.key === 'ArrowLeft') {
          prevProject();
        } else if (e.key === 'Enter') {
          viewProject();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextProject, prevProject, viewProject]);
  
  return (
    <div 
      className="relative h-full w-full overflow-hidden rounded-3xl bg-secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-projects-box="true"
      tabIndex={0} // Make it focusable for keyboard navigation
    >
      {/* Desktop Layout (bento-lg and up) */}
      <div className="hidden h-full w-full bento-lg:flex flex-col p-4">
          <motion.div
            key={currentProject.id}
            className="flex h-full flex-col"
          >
            {/* Project Image */}
            <div className="relative mb-3 h-2/5 w-full overflow-hidden rounded-lg">
              <ImageBox 
                src={currentProject.images?.[0] || discordImageUrl}
                alt={currentProject.title}
                fill
                noRelative
                unoptimized
                className="object-contain rounded-lg"
                skeletonClassName="rounded-lg"
              />
              
              {/* Featured badge */}
              {currentProject.featured && (
                <div className="absolute top-2 right-2 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600">
                  Featured
                </div>
              )}
            </div>
            
            {/* Project Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">{currentProject.title}</h3>
                
                {/* Category Badge */}
                {currentProject.category && (
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    getCategoryColor(currentProject.category)
                  )}>
                    {currentProject.category}
                  </span>
                )}
              </div>
              
              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{currentProject.description}</p>
              
              {/* Technology Tags */}
              <div className="mb-3 flex flex-wrap gap-2">
                {currentProject.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="rounded-full bg-tertiary/50 px-2 py-1 text-xs text-primary"
                  >
                    {tech}
                  </span>
                ))}
                {currentProject.technologies.length > 3 && (
                  <span className="rounded-full bg-tertiary/50 px-2 py-1 text-xs text-primary">
                    +{currentProject.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
            
            {/* Navigation Controls */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={prevProject}
                        className="h-8 w-8 rounded-full p-0 text-primary hover:bg-tertiary/50 hover:text-primary"
                        aria-label="Previous project"
                      >
                        <ChevronLeft size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous project</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {projects.length}
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={nextProject}
                        className="h-8 w-8 rounded-full p-0 text-primary hover:bg-tertiary/50 hover:text-primary"
                        aria-label="Next project"
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next project</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
      </div>
      
      {/* Tablet Layout (bento-md) */}
      <div className="hidden h-full w-full bento-md:flex bento-lg:hidden flex-col p-3">
          <motion.div
            key={currentProject.id}
            className="flex h-full flex-col"
          >
            {/* Project Image */}
            <div className="relative mb-2 h-1/3 w-full overflow-hidden rounded-lg hidden">
              <ImageBox 
                src={currentProject.images?.[0] || discordImageUrl}
                alt={currentProject.title}
                fill
                noRelative
                unoptimized
                className="object-contain rounded-lg"
                skeletonClassName="rounded-lg"
              />
              
              {/* Featured badge */}
              {currentProject.featured && (
                <div className="absolute top-1 right-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                  Featured
                </div>
              )}
            </div>
            
            {/* Project Info - Slightly more compact */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 flex-wrap mb-1">
                <h3 className="text-md font-semibold text-foreground line-clamp-1">{currentProject.title}</h3>
                
                {/* Category Badge */}
                {currentProject.category && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0 text-[9px] font-medium",
                    getCategoryColor(currentProject.category)
                  )}>
                    {currentProject.category}
                  </span>
                )}
              </div>
              
              <p className="mb-1 text-xs text-muted-foreground line-clamp-2">{currentProject.description}</p>
              
              {/* Technology Tags - Slightly smaller */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {currentProject.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="rounded-full bg-tertiary/50 px-1.5 py-0.5 text-xs text-primary"
                  >
                    {tech}
                  </span>
                ))}
                {currentProject.technologies.length > 3 && (
                  <span className="rounded-full bg-tertiary/50 px-1.5 py-0.5 text-xs text-primary">
                    +{currentProject.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
            
            {/* Navigation Controls */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={prevProject}
                  className="h-7 w-7 rounded-full p-0 text-primary hover:bg-tertiary/50 hover:text-primary"
                  aria-label="Previous project"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {projects.length}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={nextProject}
                  className="h-7 w-7 rounded-full p-0 text-primary hover:bg-tertiary/50 hover:text-primary"
                  aria-label="Next project"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
      </div>
      
      {/* Mobile Layout (bento-sm) */}
      <div className="flex h-full w-full flex-col p-3 bento-md:hidden">
          <motion.div
            key={currentProject.id}
            className="flex h-full flex-col"
          >
            {/* Project Image - Smaller on mobile */}
            <div className="relative mb-2 h-2/5 w-full overflow-hidden rounded-lg">
              <ImageBox 
                src={currentProject.images?.[0] || discordImageUrl}
                alt={currentProject.title}
                fill
                noRelative
                unoptimized
                className="object-contain rounded-lg"
                skeletonClassName="rounded-lg"
              />
              
              {/* Featured badge - smaller on mobile */}
              {currentProject.featured && (
                <div className="absolute top-1 right-1 rounded-full bg-amber-500/20 px-1 py-0 text-[8px] font-medium text-amber-600">
                  Featured
                </div>
              )}
            </div>
            
            {/* Project Info - More compact on mobile */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 flex-wrap mb-1">
                <h3 className="text-sm font-semibold text-foreground line-clamp-1">{currentProject.title}</h3>
                
                {/* Category Badge - smaller on mobile */}
                {currentProject.category && (
                  <span className={cn(
                    "rounded-full px-1 py-0 text-[8px] font-medium",
                    getCategoryColor(currentProject.category)
                  )}>
                    {currentProject.category}
                  </span>
                )}
              </div>
              
              <p className="mb-1 text-xs text-muted-foreground line-clamp-2">{currentProject.description}</p>
              
              {/* Technology Tags - Smaller on mobile, limit display */}
              <div className="mb-1 flex flex-wrap gap-1">
                {currentProject.technologies.slice(0, 2).map((tech) => (
                  <span 
                    key={tech} 
                    className="rounded-full bg-tertiary/50 px-1.5 py-0.5 text-[10px] text-primary"
                  >
                    {tech}
                  </span>
                ))}
                {currentProject.technologies.length > 2 && (
                  <span className="rounded-full bg-tertiary/50 px-1.5 py-0.5 text-[10px] text-primary">
                    +{currentProject.technologies.length - 2}
                  </span>
                )}
              </div>
            </div>
            
            {/* Navigation Controls - More compact on mobile */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={prevProject}
                  className="h-6 w-6 rounded-full p-0 text-primary hover:bg-tertiary/50 hover:text-primary"
                  aria-label="Previous project"
                >
                  <ChevronLeft size={14} />
                </Button>
                <div className="text-[10px] text-muted-foreground">
                  {currentIndex + 1} / {projects.length}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={nextProject}
                  className="h-6 w-6 rounded-full p-0 text-primary hover:bg-tertiary/50 hover:text-primary"
                  aria-label="Next project"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
      </div>
      
      {/* External Link Icon - Consistent with other boxes */}
      <ExternalLink 
        href={`/projects/${currentProject.id}`}
        iconSize={16}
        ariaLabel={`View ${currentProject.title} details`}
        title={`View ${currentProject.title}`}
        newTab={false} // We want this to stay within the app
        className="cursor-pointer"
      >
        <div onClick={(e) => {
          e.preventDefault();
          router.push(`/projects/${currentProject.id}`);
        }} className="w-full h-full absolute inset-0 z-0" />
      </ExternalLink>
    </div>
  );
};

// Helper function for category colors
function getCategoryColor(category?: string) {
  switch (category) {
    case 'web':
      return 'bg-indigo-500/20 text-indigo-600';
    case 'mobile':
      return 'bg-purple-500/20 text-purple-600';
    case 'design':
      return 'bg-rose-500/20 text-rose-600';
    default:
      return 'bg-gray-500/20 text-gray-600';
  }
}

export default ProjectsBox;