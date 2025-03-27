// components/projects/ProjectCard.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MoveUpRightIcon, StarIcon, GithubIcon, Github } from 'lucide-react';
import { formatDate } from 'src/utils/utils';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string; // Make optional with ?
    tags: string[];
    date: string; // Changed from Date to string
    status: 'completed' | 'in-progress' | 'planned';
    featured?: boolean;
    githubUrl?: string;
    liveUrl?: string;
  };
  variant?: 'default' | 'compact';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  variant = 'default' 
}) => {

  const thumbnailUrl = project.thumbnailUrl || '/apple-touch-icon.png';
  
  // Avoid using client-side only features during initial render
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-600';
      case 'planned':
        return 'bg-amber-500/20 text-amber-600';
      default:
        return 'bg-neutral-500/20';
    }
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-secondary/10 transition-all hover:bg-secondary/20 hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Only render potentially dynamic content when mounted */}
        {isMounted && project.featured && (
          <div className="absolute left-2 top-2 rounded-full bg-amber-500/80 px-2 py-1 text-xs font-medium text-amber-950">
            <StarIcon className="mr-1 inline-block h-3 w-3" />
            Featured
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-medium">{project.title}</h3>
          <Badge className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        
        {variant === 'default' && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(project.date)}</span>
        
        <div className="flex gap-2">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              className="rounded-full p-1 hover:bg-secondary" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              className="rounded-full p-1 hover:bg-secondary" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoveUpRightIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
};

export default ProjectCard;