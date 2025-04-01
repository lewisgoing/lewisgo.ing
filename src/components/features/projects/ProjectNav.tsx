// components/projects/ProjectNav.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from 'src/components/ui/button';

interface ProjectNavProps {
  prevProject: {
    id: string;
    title: string;
  } | null;
  nextProject: {
    id: string;
    title: string;
  } | null;
}

const ProjectNav: React.FC<ProjectNavProps> = ({ prevProject, nextProject }) => {
  if (!prevProject && !nextProject) return null;

  return (
    <div className="my-8 flex items-center justify-between gap-4">
      {prevProject ? (
        <Link
          href={`/projects/${prevProject.id}`}
          className="group flex flex-1 items-center justify-start"
        >
          <Button
            variant="outline"
            className="flex h-auto items-center gap-2 py-2 group-hover:border-primary/50"
          >
            <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="text-sm font-medium line-clamp-1">{prevProject.title}</span>
            </div>
          </Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextProject ? (
        <Link
          href={`/projects/${nextProject.id}`}
          className="group flex flex-1 items-center justify-end"
        >
          <Button
            variant="outline"
            className="flex h-auto items-center gap-2 py-2 group-hover:border-primary/50"
          >
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="text-sm font-medium line-clamp-1">{nextProject.title}</span>
            </div>
            <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
};

export default ProjectNav;