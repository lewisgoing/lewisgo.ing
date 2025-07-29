import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ProjectsPageClient from '@/components/features/projects/ProjectsPageClient';

interface ProjectWithStringDate {
  id: string;
  slug: string;
  name: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  image: string;
  link: string;
  content?: string;
  draft?: boolean;
  hidden?: boolean;
}

function getAllProjects(): ProjectWithStringDate[] {
  try {
    const projectsDirectory = path.join(process.cwd(), 'content/projects');
    if (!fs.existsSync(projectsDirectory)) {
      return [];
    }
    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(projectsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const image = data.thumbnailUrl || (data.images && data.images.length > 0 ? data.images[0] : '/projects/project-1.png');
        const dateString = new Date(data.date || new Date()).toISOString();
        return {
          id: slug,
          slug,
          name: data.title || '',
          description: data.description || '',
          date: dateString,
          tags: data.tags || [],
          category: data.category || 'other',
          image,
          link: data.githubUrl || data.liveUrl || '',
          content,
          draft: data.status === 'draft',
          hidden: data.featured === false,
        } as ProjectWithStringDate;
      })
      .filter(project => !project.draft && !project.hidden)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return projects;
  } catch {
    return [];
  }
}

function getCategories(projects: ProjectWithStringDate[]): string[] {
  const categorySet = new Set(projects.map(p => p.category));
  return Array.from(categorySet).sort();
}

export default function ProjectsPage({ searchParams }: { searchParams: { category?: string; page?: string } }) {
  const allProjects = getAllProjects();
  const categories = getCategories(allProjects);
  const selectedCategory = searchParams.category || null;
  const page = parseInt(searchParams.page || '1');
  const projectsPerPage = 6;
  const filtered = selectedCategory ? allProjects.filter(p => p.category === selectedCategory) : allProjects;
  const totalPages = Math.ceil(filtered.length / projectsPerPage);
  return (
    <ProjectsPageClient projects={filtered} categories={categories} currentPage={page} totalPages={totalPages} />
  );
}
