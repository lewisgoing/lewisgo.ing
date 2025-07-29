'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectCard } from './ProjectCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Container from '@/components/common/Container';
import Pagination from '@/components/ui/pagination';
import { Archive, FolderOpen, Filter, X } from 'lucide-react';
import { Button } from '@/ui/button';

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
}

interface ProjectsClientProps {
  projects: ProjectWithStringDate[];
  categories: string[];
  currentPage: number;
  totalPages: number;
}

export default function ProjectsPageClient({
  projects: initialProjects,
  categories,
  currentPage: initialPage,
  totalPages: initialTotalPages,
}: ProjectsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const projectsPerPage = 6;

  useEffect(() => {
    const categoryParam = searchParams.get('category') || null;
    setSelectedCategory(categoryParam);

    const allProjects = initialProjects;
    const filtered = categoryParam ? allProjects.filter(p => p.category === categoryParam) : allProjects;

    const newTotalPages = Math.ceil(filtered.length / projectsPerPage);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages) setCurrentPage(1);

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    setFilteredProjects(filtered.slice(start, end));
  }, [searchParams, initialProjects, currentPage]);

  const handleCategoryChange = (category: string | null) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (category) params.set('category', category); else params.delete('category');
    params.delete('page');
    router.push('/projects' + (params.toString() ? `?${params.toString()}` : ''));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (page === 1) params.delete('page'); else params.set('page', page.toString());
    router.push('/projects' + (params.toString() ? `?${params.toString()}` : ''));
  };

  const projectsByYear = filteredProjects.reduce<Record<string, ProjectWithStringDate[]>>((acc, project) => {
    const year = new Date(project.date).getFullYear().toString();
    (acc[year] ??= []).push(project);
    return acc;
  }, {});
  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <Container className="flex grow flex-col gap-y-6">
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '/projects', icon: Archive },
          ...(selectedCategory ? [{ label: selectedCategory, icon: Filter }] : []),
          ...(currentPage > 1 ? [{ label: `Page ${currentPage}`, icon: FolderOpen }] : []),
        ]}
      />
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm font-medium">Categories:</span>
        </div>
        <Button variant={selectedCategory === null ? 'default' : 'outline'} size="sm" className="rounded-full text-xs h-8" onClick={() => handleCategoryChange(null)}>
          All
        </Button>
        {categories.map(category => (
          <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" className="rounded-full text-xs h-8" onClick={() => handleCategoryChange(category)}>
            {category}
          </Button>
        ))}
        {selectedCategory && (
          <Button variant="ghost" size="sm" className="rounded-full text-xs h-8 ml-auto" onClick={() => handleCategoryChange(null)}>
            <X className="h-3 w-3 mr-1" /> Clear filter
          </Button>
        )}
      </div>
      {filteredProjects.length === 0 ? (
        <div className="flex min-h-[calc(100vh-18rem)] items-center justify-center flex-col gap-4 text-center">
          <div className="text-lg font-medium">No projects found</div>
          <p className="text-muted-foreground">
            {selectedCategory ? `No projects found in the "${selectedCategory}" category.` : 'No projects found with the current filters.'}
          </p>
          {selectedCategory && (
            <Button variant="outline" onClick={() => handleCategoryChange(null)}>
              Show all projects
            </Button>
          )}
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-18rem)] flex-col gap-y-8">
          {years.map(year => (
            <section key={year} className="flex flex-col gap-y-4">
              <div className="font-semibold text-lg">{year}</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {projectsByYear[year].map(project => (
                  <li key={project.id} className="col-span-1 lg:col-span-1 xl:col-span-1">
                    <ProjectCard project={project} className="h-full transition-all duration-300 hover:scale-[1.02]" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="my-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/projects${selectedCategory ? `?category=${selectedCategory}` : ''}`} />
        </div>
      )}
    </Container>
  );
}
