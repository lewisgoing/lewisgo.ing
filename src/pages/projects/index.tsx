import { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ProjectCard } from 'src/components/features/projects/ProjectCard';
import Breadcrumbs from 'src/components/common/Breadcrumbs';
import Container from 'src/components/common/Container';
import Pagination from 'src/components/ui/pagination';
import { Archive, FolderOpen } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define a type for projects with string dates for serialization
interface ProjectWithStringDate {
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
}

interface ProjectsPageProps {
  projects: ProjectWithStringDate[];
  currentPage: number;
  totalPages: number;
}

export default function ProjectsPage({ 
  projects, 
  currentPage, 
  totalPages 
}: ProjectsPageProps) {
  
  // Group projects by year
  const projectsByYear = projects.reduce<Record<string, ProjectWithStringDate[]>>((acc, project) => {
    const year = new Date(project.date).getFullYear().toString();
    (acc[year] ??= []).push(project);
    return acc;
  }, {});

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
<Head>
  <title>{`Projects${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}</title>
</Head>
      <Container className="flex grow flex-col gap-y-6">
        <Breadcrumbs
          items={[
            { label: 'Projects', href: '/projects', icon: Archive },
            ...(currentPage > 1 ? [{ label: `Page ${currentPage}`, icon: FolderOpen }] : []),
          ]}
        />

        <div className="flex min-h-[calc(100vh-18rem)] flex-col gap-y-8">
          {years.map((year) => (
            <section key={year} className="flex flex-col gap-y-4">
              <div className="font-semibold">{year}</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectsByYear[year].map((project) => {
                  // console.log('Project data:', JSON.stringify(project, null, 2));
                  return (
                    <li key={project.id}>
                      <ProjectCard project={project} />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/projects" 
        />
      </Container>
    </>
  );
}

// Helper function to get all projects
async function getAllProjects(): Promise<ProjectWithStringDate[]> {
  const projectsDirectory = path.join(process.cwd(), 'content/projects');
  
  // Check if directory exists
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(projectsDirectory);
  
  const projects = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      // Get file ID (filename without extension)
      const slug = fileName.replace(/\.mdx$/, '');
      
      // Read file content
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContents);
      
      // Get first image as thumbnail if not explicitly defined
      const image = data.thumbnailUrl || 
        (data.images && data.images.length > 0 ? data.images[0] : '/projects/project-1.png');
      
      // Convert date to ISO string for serialization
      const dateString = new Date(data.date).toISOString();
      
      // Map MDX frontmatter to Project type
      return {
        id: slug,
        slug,
        name: data.title,
        description: data.description || '',
        date: dateString,
        tags: data.tags || [],
        image,
        link: data.githubUrl || data.liveUrl || '',
        content,
        draft: data.status === 'draft',
        hidden: data.featured === false
      } as ProjectWithStringDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return projects;
}

// Use getServerSideProps to handle dynamic query parameters
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pageQuery = query.page;
  const page = pageQuery ? parseInt(pageQuery as string) : 1;
  
  const projects = await getAllProjects();
  
  // Calculate pagination
  const projectsPerPage = 4;
  const totalProjects = projects.length;
  const totalPages = Math.ceil(totalProjects / projectsPerPage);
  
  // Validate page number
  if (page < 1 || page > totalPages) {
    return {
      redirect: {
        destination: '/projects',
        permanent: false,
      },
    };
  }
  
  // Get projects for current page
  const pageProjects = projects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage
  );
  
  return {
    props: {
      projects: pageProjects,
      currentPage: page,
      totalPages,
    },
  };
};