// components/projects/ProjectLayout.tsx
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from 'src/components/ui/badge';
import { Separator } from 'src/components/ui/separator';
import { Button } from 'src/components/ui/button';
import { 
  CalendarIcon, 
  TagIcon, 
  GithubIcon, 
  ExternalLinkIcon, 
  ChevronLeftIcon,
  ArrowUpIcon
} from 'lucide-react';
import TOC, { TOCHeading } from './TOC';
import ProjectNav from './ProjectNav';
import { formatDate } from 'src/utils/utils';

interface ProjectLayoutProps {
  project: {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    status?: 'completed' | 'in-progress' | 'planned';
    completedDate?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    thumbnailUrl?: string;
    images?: string[];
    featured?: boolean;
    category: string;
  };
  headings: TOCHeading[];
  prevProject: { id: string; title: string } | null;
  nextProject: { id: string; title: string } | null;
  children: React.ReactNode;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  project,
  headings,
  prevProject,
  nextProject,
  children,
}) => {
  const [activeImage, setActiveImage] = React.useState(0);

  // Determine status badge color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-600';
      case 'planned':
        return 'bg-amber-500/20 text-amber-600';
      default:
        return 'bg-neutral-500/20 text-neutral-600';
    }
  };

  // Getting the category badge color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'web':
        return 'bg-indigo-500/20 text-indigo-600';
      case 'mobile':
        return 'bg-purple-500/20 text-purple-600';
      case 'design':
        return 'bg-rose-500/20 text-rose-600';
      case 'research':
        return 'bg-emerald-500/20 text-emerald-600';
      case 'audio':
        return 'bg-orange-500/20 text-orange-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>{project.title} | Projects</title>
        <meta name="description" content={project.description} />
        <meta property="og:image" content={project.thumbnailUrl || '/og-image.jpg'} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-foreground">
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </div>
        </div>

        {/* Back to projects */}
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeftIcon className="mr-1 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Project Image Gallery */}
            {(project.images?.length ?? 0) > 0 ? (
              <div className="mb-8">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src={project.images?.[activeImage] || project.thumbnailUrl || '/projects/project-1.png'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {project.images && project.images.length > 1 && (
                  <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        className={`relative aspect-video h-16 overflow-hidden rounded-md border transition-all ${
                          activeImage === index
                            ? 'border-primary ring-1 ring-primary'
                            : 'border-border opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : project.thumbnailUrl ? (
              <div className="mb-8">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            ) : null}

            {/* Project Header */}
            <header className="mb-8">
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
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                )}
              </div>
              
              <p className="mt-2 text-xl text-muted-foreground">{project.description}</p>
              
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {/* Completion Date */}
                {project.completedDate && (
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{project.completedDate}</span>
                  </div>
                )}
                
                {/* Category */}
                {project.category && (
                  <div className={`flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(project.category)}`}>
                    <TagIcon className="mr-1 h-3 w-3" />
                    <span>{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Project Navigation */}
            <ProjectNav prevProject={prevProject} nextProject={nextProject} />

            {/* Project Content */}
            <article className="prose prose-sm prose-neutral max-w-none dark:prose-invert">
              {children}
            </article>

            {/* Project Navigation (Bottom) */}
            <ProjectNav prevProject={prevProject} nextProject={nextProject} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents */}
            {headings.length > 0 && <TOC headings={headings} />}

            {/* Project Info */}
            <div className="rounded-lg border border-border bg-secondary/10 p-4">
              <h3 className="text-lg font-medium mb-3">Project Details</h3>

              {/* Technologies */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="rounded-full bg-secondary/50 text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.githubUrl || project.liveUrl) && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Links</h4>
                  <div className="space-y-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/20 p-3 text-sm transition-colors hover:bg-secondary/40"
                      >
                        <span className="flex items-center">
                          <GithubIcon className="mr-2 h-4 w-4" /> GitHub Repository
                        </span>
                        <ExternalLinkIcon className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/20 p-3 text-sm transition-colors hover:bg-secondary/40"
                      >
                        <span className="flex items-center">
                          <ExternalLinkIcon className="mr-2 h-4 w-4" /> Live Demo
                        </span>
                        <ExternalLinkIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-8 right-8 z-50 hidden h-10 w-10 rounded-full shadow-md group"
        onClick={scrollToTop}
        id="scroll-to-top"
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
      </Button>

      {/* Script to toggle scroll-to-top button visibility */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const scrollToTopButton = document.getElementById('scroll-to-top');
              const footer = document.querySelector('footer');
              
              if (!scrollToTopButton) return;
              
              const handleScroll = () => {
                if (window.scrollY > 300) {
                  scrollToTopButton.classList.remove('hidden');
                } else {
                  scrollToTopButton.classList.add('hidden');
                }
                
                if (footer) {
                  const footerRect = footer.getBoundingClientRect();
                  if (footerRect.top <= window.innerHeight) {
                    scrollToTopButton.classList.add('hidden');
                  }
                }
              };
              
              window.addEventListener('scroll', handleScroll);
            });
          `,
        }}
      />
    </>
  );
};

export default ProjectLayout;