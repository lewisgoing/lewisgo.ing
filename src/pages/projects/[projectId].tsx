// src/pages/projects/[projectId].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import ImageBox from '../../../components/assets/ImageBox';
import { Skeleton } from '../../../components/shadcn/skeleton';
import { Button } from '../../../components/shadcn/button';
import { ChevronLeft, Github, Globe, MoveUpRight, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { getSvgUrl } from '../../../src/utils/blob-utils';
import { cn } from '../../utils/tailwind-helpers';
import { Project, getProjectById, getRelatedProjects } from '../../types/project';

const ProjectPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Get Discord SVG as fallback image
  const discordSvgUrl = getSvgUrl('discord.svg');

  useEffect(() => {
    if (projectId && typeof projectId === 'string') {
      // Get project data from our type utilities
      const foundProject = getProjectById(projectId);
      setProject(foundProject || null);
      
      if (foundProject) {
        // Get related projects
        setRelatedProjects(getRelatedProjects(foundProject.id));
      }
      
      setIsLoading(false);
    }
  }, [projectId]);

  // Handle status badge color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-600';
      case 'planned':
        return 'bg-amber-500/20 text-amber-600';
      default:
        return 'bg-tertiary/50 text-primary';
    }
  };

  // Handle category badge color
  const getCategoryColor = (category?: string) => {
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
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Project Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button 
          className="mt-8" 
          variant="outline" 
          onClick={() => router.push('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{project.title} | lewisgo.ing</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-muted-foreground hover:text-foreground"
            onClick={() => router.push('/')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back Home
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            
            {/* Featured Badge */}
            {project.featured && (
              <span className="rounded-full bg-amber-500/20 text-amber-600 px-2 py-1 text-xs font-medium">
                Featured
              </span>
            )}
            
            {/* Status Badge */}
            {project.status && (
              <span className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                getStatusColor(project.status)
              )}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            )}
          </div>
          
          <p className="mt-2 text-xl text-muted-foreground">{project.description}</p>
          
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {/* Date Added */}
            {project.completedDate && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{project.completedDate}</span>
              </div>
            )}
            
            {/* Category */}
            {project.category && (
              <div className={cn(
                "flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                getCategoryColor(project.category)
              )}>
                <Tag className="mr-1 h-3 w-3" />
                <span>{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Project Images */}
        <div className="mb-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-tertiary/10">
            <ImageBox
              src={project.images?.[activeImageIndex] || discordSvgUrl}
              alt={`${project.title} screenshot ${activeImageIndex + 1}`}
              fill
              className="object-contain transition-all duration-300"
              skeletonClassName="rounded-2xl"
              unoptimized
            />
          </div>
          
          {/* Image Thumbnails - Only show if there are multiple images */}
          {project.images && project.images.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative aspect-video h-16 overflow-hidden rounded-md border transition-all",
                    activeImageIndex === index 
                      ? "border-primary ring-1 ring-primary" 
                      : "border-border opacity-70 hover:opacity-100"
                  )}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <ImageBox
                    src={image || discordSvgUrl}
                    alt={`${project.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    skeletonClassName="rounded-md"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* About and Details Section */}
        <div className="grid gap-8 md:grid-cols-3 mb-10">
          {/* Left Column: About this project */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">About this project</h2>
            <div className="text-muted-foreground">
              <p>{project.longDescription || project.description}</p>
            </div>
          </div>

          {/* Right Column: Technologies and Links */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="rounded-xl border border-border bg-tertiary/10 p-4">
              <h3 className="text-lg font-medium mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-tertiary/50 px-3 py-1 text-sm text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links - Only show if there are links available */}
            {(project.githubUrl || project.liveUrl) && (
              <div className="rounded-xl border border-border bg-tertiary/10 p-4">
                <h3 className="text-lg font-medium mb-3">Links</h3>
                <div className="space-y-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-lg border border-border bg-tertiary/20 p-3 text-sm transition-colors hover:bg-tertiary/40"
                    >
                      <span className="flex items-center">
                        <Github className="mr-2 h-4 w-4" /> GitHub Repository
                      </span>
                      <MoveUpRight className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-lg border border-border bg-tertiary/20 p-3 text-sm transition-colors hover:bg-tertiary/40"
                    >
                      <span className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" /> Live Demo
                      </span>
                      <MoveUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Description Section - Only show if available */}
        {project.detailedContent && (
          <div className="mb-16">
            <div className="rounded-xl border border-border bg-tertiary/5 p-6 md:p-8">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: project.detailedContent }}
              />
            </div>
          </div>
        )}

        {/* Navigation to Other Projects - Only show if there are related projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16 border-t border-border pt-8">
            <h2 className="text-xl font-semibold mb-6">Related Projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map(otherProject => (
                <Link 
                  href={`/projects/${otherProject.id}`}
                  key={otherProject.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-tertiary/10 transition-all hover:bg-tertiary/20"
                >
                  <div className="aspect-video w-full bg-tertiary/20">
                    <div className="relative h-full w-full">
                      <ImageBox 
                        src={otherProject.images?.[0] || otherProject.thumbnailUrl || discordSvgUrl}
                        alt={otherProject.title}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{otherProject.title}</h3>
                      {otherProject.featured && (
                        <span className="rounded-full bg-amber-500/20 text-amber-600 px-1.5 py-0.5 text-[10px] font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {otherProject.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {otherProject.technologies.slice(0, 3).map((tech, index) => (
                        <span 
                          key={index}
                          className="rounded-full bg-tertiary/30 px-2 py-0.5 text-xs text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                      {otherProject.technologies.length > 3 && (
                        <span className="rounded-full bg-tertiary/30 px-2 py-0.5 text-xs text-primary">
                          +{otherProject.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ProjectPage;