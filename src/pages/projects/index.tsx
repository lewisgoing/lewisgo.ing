// src/pages/projects/index.tsx

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ProjectCard } from 'src/components/features/projects/ProjectCard';
import Breadcrumbs from 'src/components/common/Breadcrumbs';
import Container from 'src/components/common/Container';
import Pagination from 'src/components/ui/pagination';
import { Archive, FolderOpen, Filter, X } from 'lucide-react';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { cn } from '@/utils/tailwind-helpers';
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
  category: string;
  image: string;
  link: string;
  content?: string;
  draft?: boolean;
  hidden?: boolean;
}

interface ProjectsPageProps {
  projects: ProjectWithStringDate[];
  categories: string[];
  currentPage: number;
  totalPages: number;
}

export default function ProjectsPage({ 
  projects: initialProjects, 
  categories,
  currentPage: initialPage,
  totalPages: initialTotalPages 
}: ProjectsPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  // Constants
  const projectsPerPage = 6;

  // Filter projects by category
  useEffect(() => {
    // Read the category from URL query parameter
    const categoryParam = router.query.category as string | undefined;
    setSelectedCategory(categoryParam || null);
    
    // Get all projects and filter them
    const allProjects = initialProjects;
    const filtered = categoryParam 
      ? allProjects.filter(p => p.category === categoryParam)
      : allProjects;
    
    // Calculate pagination
    const newTotalPages = Math.ceil(filtered.length / projectsPerPage);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page is greater than new total pages
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
    
    // Get projects for current page
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    setFilteredProjects(filtered.slice(start, end));
    
  }, [router.query.category, initialProjects, currentPage]);

  // Handle category filter click
  const handleCategoryChange = (category: string | null) => {
    const query = { ...router.query };
    
    if (category) {
      query.category = category;
    } else {
      delete query.category;
    }
    
    // Reset to page 1 when changing category
    delete query.page;
    
    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    const query = { ...router.query, page: page.toString() };
    router.push({
      pathname: router.pathname,
      query: page === 1 ? { ...query, page: undefined } : query
    }, undefined, { shallow: true });
  };

  // Group projects by year
  const projectsByYear = filteredProjects.reduce<Record<string, ProjectWithStringDate[]>>((acc, project) => {
    const year = new Date(project.date).getFullYear().toString();
    (acc[year] ??= []).push(project);
    return acc;
  }, {});

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      <Head>
        <title>{`Projects${selectedCategory ? ` - ${selectedCategory}` : ''}${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}</title>
      </Head>
      <Container className="flex grow flex-col gap-y-6">
        <Breadcrumbs
          items={[
            { label: 'Projects', href: '/projects', icon: Archive },
            ...(selectedCategory ? [{ label: selectedCategory, icon: Filter }] : []),
            ...(currentPage > 1 ? [{ label: `Page ${currentPage}`, icon: FolderOpen }] : []),
          ]}
        />

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm font-medium">Categories:</span>
          </div>
          
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-8"
            onClick={() => handleCategoryChange(null)}
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs h-8"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
          
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs h-8 ml-auto"
              onClick={() => handleCategoryChange(null)}
            >
              <X className="h-3 w-3 mr-1" /> Clear filter
            </Button>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="flex min-h-[calc(100vh-18rem)] items-center justify-center flex-col gap-4 text-center">
            <div className="text-lg font-medium">No projects found</div>
            <p className="text-muted-foreground">
              {selectedCategory 
                ? `No projects found in the "${selectedCategory}" category.` 
                : 'No projects found with the current filters.'}
            </p>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => handleCategoryChange(null)}
              >
                Show all projects
              </Button>
            )}
          </div>
        ) : (
          <div className="flex min-h-[calc(100vh-18rem)] flex-col gap-y-8">
            {years.map((year) => (
              <section key={year} className="flex flex-col gap-y-4">
                <div className="font-semibold text-lg">{year}</div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {projectsByYear[year].map((project) => (
                    <li key={project.id} className="col-span-1 lg:col-span-1 xl:col-span-1">
                      <ProjectCard 
                        project={project} 
                        className="h-full transition-all duration-300 hover:scale-[1.02]"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="my-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/projects${selectedCategory ? `?category=${selectedCategory}` : ''}`}
            />
          </div>
        )}
      </Container>
    </>
  );
}

// Helper function to get all projects
function getAllProjects(): ProjectWithStringDate[] {
  try {
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
        const dateString = new Date(data.date || new Date()).toISOString();
        
        // Map MDX frontmatter to Project type
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
          hidden: data.featured === false
        } as ProjectWithStringDate;
      })
      .filter(project => !project.draft && !project.hidden)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
}

// Function to extract categories from projects
function getCategories(projects: ProjectWithStringDate[]): string[] {
  const categorySet = new Set(projects.map(project => project.category));
  return Array.from(categorySet).sort();
}

// Keep using getStaticProps with fallback for better performance
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    // Load all projects
    const allProjects = getAllProjects();
    const categories = getCategories(allProjects);
    
    // For static first page
    const page = 1;
    
    // Calculate pagination
    const projectsPerPage = 6; // Show 6 projects per page
    const totalProjects = allProjects.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    
    // Get projects for first page
    const pageProjects = allProjects.slice(0, projectsPerPage);
    
    return {
      props: {
        projects: pageProjects,
        categories,
        currentPage: page,
        totalPages,
        allProjects, // Pass all projects for client-side filtering
      },
      // Revalidate every hour
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        projects: [],
        categories: [],
        currentPage: 1,
        totalPages: 1,
      },
      revalidate: 60
    };
  }
};