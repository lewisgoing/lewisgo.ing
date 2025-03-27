// components/ProjectNavigation.tsx
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from 'src/utils/tailwind-helpers';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProjectNavigationProps {
  prevProject?: {
    id: string;
    data: {
      title: string;
    };
  } | null;
  nextProject?: {
    id: string;
    data: {
      title: string;
    };
  } | null;
}

export default function ProjectNavigation({ prevProject, nextProject }: ProjectNavigationProps) {
  return (
    <div className="col-start-2 flex flex-col gap-4 sm:flex-row">
      <Link
        href={nextProject ? `/projects/${nextProject.id}` : '#'}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'rounded-xl group flex items-center justify-start w-full sm:w-1/2 h-full',
          !nextProject && 'pointer-events-none opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!nextProject}
      >
        <div className="mr-2 flex-shrink-0">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </div>
        <div className="flex flex-col items-start text-wrap">
          <span className="text-left text-xs text-muted-foreground">Next Project</span>
          <span className="w-full text-ellipsis text-pretty text-left text-sm">
            {nextProject?.data.title || 'Latest project!'}
          </span>
        </div>
      </Link>
      <Link
        href={prevProject ? `/projects/${prevProject.id}` : '#'}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'rounded-xl group flex items-center justify-end w-full sm:w-1/2 h-full',
          !prevProject && 'pointer-events-none opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!prevProject}
      >
        <div className="flex flex-col items-end text-wrap">
          <span className="text-right text-xs text-muted-foreground">Previous Project</span>
          <span className="w-full text-ellipsis text-pretty text-right text-sm">
            {prevProject?.data.title || 'Last project!'}
          </span>
        </div>
        <div className="ml-2 flex-shrink-0">
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
}