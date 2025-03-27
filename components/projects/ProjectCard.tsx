import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from 'src/utils/tailwind-helpers';
import { Project } from 'src/types/types';

type ProjectWithStringDate = Omit<Project, 'date'> & {
  date: string;
};

type Props = {
  project: Project | ProjectWithStringDate;
  className?: string;
};

export function ProjectCard({ project, className }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border transition-colors duration-300 ease-in-out hover:bg-secondary/50",
        className
      )}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative h-[200px] w-full">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{project.name}</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}