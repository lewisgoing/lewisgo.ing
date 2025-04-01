import Link from 'next/link';
import Image from 'next/image';
import { Badge } from 'src/components/ui/badge';
import { cn } from 'src/utils/tailwind-helpers';

type Props = {
  project: {
    id: string;
    slug: string;
    name: string;
    description: string;
    date: string;
    tags: string[];
    image: string;
    link: string;
    content?: string;
    draft?: boolean;
    hidden?: boolean;
  };
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
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{project.name}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{project.description}</p>
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