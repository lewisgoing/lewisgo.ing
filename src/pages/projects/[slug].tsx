import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Breadcrumbs from 'src/components/common/Breadcrumbs';
import Container from 'src/components/common/Container';
import ProjectNavigation from 'src/components/features/projects/ProjectNavigation';
import { Badge } from 'src/components/ui/badge';
import { formatDate, readingTime } from 'src/utils/utils';
import { Project } from 'src/types/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Archive, FileText } from 'lucide-react';

interface ProjectWithStringDate extends Omit<Project, 'date'> {
  date: string;
  title?: string;
}

interface ProjectPageProps {
  project: ProjectWithStringDate;
  content: any; // MDX content
  prevProject: {
    id: string;
    data: {
      title: string;
    };
  } | null;
  nextProject: {
    id: string;
    data: {
      title: string;
    };
  } | null;
}

export default function ProjectPage({ 
  project, 
  content, 
  prevProject, 
  nextProject 
}: ProjectPageProps) {
  return (
    <>
      <Head>
        <title>{project.name}</title>
        <meta name="description" content={project.description} />
      </Head>

      <Container className="flex grow flex-col gap-y-6">
        <Breadcrumbs
          items={[
            { label: 'Projects', href: '/projects', icon: Archive },
            { label: project.name, icon: FileText },
          ]}
        />

        <article className="flex flex-col gap-y-6">
          {/* Project header */}
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

          {/* Project featured image */}
          {project.image && (
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Project content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MDXRemote {...content} />
          </div>

          {/* Project navigation */}
          <ProjectNavigation
            prevProject={prevProject}
            nextProject={nextProject}
          />
        </article>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projectsDirectory = path.join(process.cwd(), 'content/projects');
  
  if (!fs.existsSync(projectsDirectory)) {
    return { paths: [], fallback: false };
  }
  
  const fileNames = fs.readdirSync(projectsDirectory);
  const paths = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => ({
      params: { slug: fileName.replace(/\.mdx$/, '') },
    }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const projectsDirectory = path.join(process.cwd(), 'content/projects');
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return { notFound: true };
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Get MDX content
  const mdxSource = await serialize(content || '');
  
  // Map frontmatter data to project structure
  const project: ProjectWithStringDate = {
    id: slug,
    slug,
    name: data.title,
    description: data.description || '',
    tags: data.tags || [],
    image: data.thumbnailUrl || (data.images && data.images.length > 0 ? data.images[0] : null),
    link: data.githubUrl || data.liveUrl || '',
    date: new Date(data.date).toISOString(),
    content: content
  };
  
  // Get all projects for navigation
  const files = fs.readdirSync(projectsDirectory);
  const allProjects = files
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const projectSlug = fileName.replace(/\.mdx$/, '');
      const projectPath = path.join(projectsDirectory, fileName);
      const projectContent = fs.readFileSync(projectPath, 'utf8');
      const { data } = matter(projectContent);
      
      return {
        slug: projectSlug,
        id: projectSlug,
        data: {
          title: data.title
        },
        date: new Date(data.date).toISOString(),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Find current project index
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 
    ? { 
        id: allProjects[currentIndex - 1].id,
        data: {
          title: allProjects[currentIndex - 1].data.title
        }
      } 
    : null;
    
  const nextProject = currentIndex < allProjects.length - 1 
    ? {
        id: allProjects[currentIndex + 1].id,
        data: {
          title: allProjects[currentIndex + 1].data.title
        }
      } 
    : null;
  
  return {
    props: {
      project,
      content: mdxSource,
      prevProject,
      nextProject,
    },
  };
};