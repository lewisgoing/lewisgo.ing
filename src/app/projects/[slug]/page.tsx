// @ts-nocheck
import { MDXRemote } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Container from '@/components/common/Container';
import ProjectNavigation from '@/components/features/projects/ProjectNavigation';
import { Badge } from '@/ui/badge';
import { Archive, FileText } from 'lucide-react';
import { formatDate, readingTime } from '@/utils/utils';
import type { Metadata } from 'next';

interface ProjectWithStringDate {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  image: string | null;
  link: string;
  date: string;
  content?: string;
}

async function getProject(slug: string) {
  const projectsDirectory = path.join(process.cwd(), 'content/projects');
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const mdx = await serialize(content || '', {}, true);
  const project: ProjectWithStringDate = {
    id: slug,
    slug,
    name: data.title,
    description: data.description || '',
    tags: data.tags || [],
    image: data.thumbnailUrl || (data.images && data.images.length > 0 ? data.images[0] : null),
    link: data.githubUrl || data.liveUrl || '',
    date: new Date(data.date).toISOString(),
    content,
  };
  return { project, mdx };
}

function getAllProjectsMeta() {
  const dir = path.join(process.cwd(), 'content/projects');
  if (!fs.existsSync(dir)) return [] as { slug: string; title: string; date: string }[];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const matterResult = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      return { slug, title: matterResult.data.title, date: new Date(matterResult.data.date).toISOString() };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/projects');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => ({ slug: file.replace(/\.mdx$/, '') }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getProject(params.slug);
  if (!data) return {};
  return {
    title: data.project.name,
    description: data.project.description,
  };
}

export default async function ProjectPage({ params }: any) {
  const data = await getProject(params.slug);
  if (!data) return <div>Not found</div>;
  const { project, mdx } = data;

  const all = getAllProjectsMeta();
  const index = all.findIndex((p) => p.slug === params.slug);
  const prevProject = index > 0 ? { id: all[index - 1].slug, data: { title: all[index - 1].title } } : null;
  const nextProject = index < all.length - 1 ? { id: all[index + 1].slug, data: { title: all[index + 1].title } } : null;

  return (
    <Container className="flex grow flex-col gap-y-6">
      <Breadcrumbs items={[{ label: 'Projects', href: '/projects', icon: Archive }, { label: project.name, icon: FileText }]} />
      <article className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
            <span>•</span>
            <span>{readingTime(project.content || '')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {project.image && (
          <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
            <Image src={project.image} alt={project.name} fill className="object-cover" />
          </div>
        )}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote source={mdx} />
        </div>
        <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />
      </article>
    </Container>
  );
}
