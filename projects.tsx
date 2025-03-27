// pages/projects/index.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import ProjectCard from '@/components/projects/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FilterIcon, XIcon } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// For the page props, we use string dates
export interface ProjectWithStringDate {
  id: string;
  title: string;
  description: string;
  date: string; // Date as ISO string
  tags: string[];
  status: 'completed' | 'in-progress' | 'planned';
  completedDate?: string | null;
  technologies: string[];
  category: string;
  featured?: boolean;
  githubUrl?: string | null;
  liveUrl?: string | null;
  thumbnailUrl: string; // No longer optional
  images?: string[]
}

interface ProjectsPageProps {
  projects: ProjectWithStringDate[];
  allTags: string[];
  allCategories: string[];
}

// Get all projects from content/projects directory
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
      const id = fileName.replace(/\.mdx$/, '');
      
      // Read file content
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Parse frontmatter
      const { data } = matter(fileContents);
      
      // Get first image as thumbnail if not explicitly defined
      const thumbnailUrl = data.thumbnailUrl || 
        (data.images && data.images.length > 0 ? data.images[0] : '/projects/project-1.png');
      
      // Convert date to ISO string for serialization
      const dateString = new Date(data.date).toISOString();
      
      // Ensure all required fields exist and undefined values become null
      return {
        id,
        title: data.title || '',
        description: data.description || '',
        date: dateString,
        tags: data.tags || [],
        status: data.status || 'completed',
        completedDate: data.completedDate || null,
        technologies: data.technologies || [],
        category: data.category || 'other',
        featured: data.featured || false,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        thumbnailUrl: thumbnailUrl || '/apple-touch-icon.png', // Always provide a fallback
        images: data.images || [],
      } as ProjectWithStringDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return projects;
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const projects = await getAllProjects();
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();
  
  // Extract all unique categories
  const allCategories = Array.from(
    new Set(projects.map(project => project.category))
  ).sort();

  return {
    props: {
      projects,
      allTags,
      allCategories,
    },
  };
};

export default function ProjectsPage({ 
  projects, 
  allTags, 
  allCategories 
}: ProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Group projects by year
  const projectsByYear = projects.reduce(
    (acc: Record<string, ProjectWithStringDate[]>, project) => {
      const year = new Date(project.date).getFullYear().toString();
      (acc[year] ??= []).push(project);
      return acc;
    },
    {},
  );

  // Sort years in descending order
  const years = Object.keys(projectsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  // Filter projects based on search query, tags, categories, and status
  const filteredProjects = projects.filter((project) => {
    // Search query filter
    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => project.tags.includes(tag));

    // Categories filter
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(project.category);

    // Status filter
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(project.status);

    return matchesSearch && matchesTags && matchesCategories && matchesStatus;
  });

  // Group filtered projects by year
  const filteredProjectsByYear = filteredProjects.reduce(
    (acc: Record<string, ProjectWithStringDate[]>, project) => {
      const year = new Date(project.date).getFullYear().toString();
      (acc[year] ??= []).push(project);
      return acc;
    },
    {},
  );

  // Sort years in descending order for filtered projects
  const filteredYears = Object.keys(filteredProjectsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle status selection
  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  // Check if any filters are applied
  const hasFilters =
    searchQuery !== '' ||
    selectedTags.length > 0 ||
    selectedCategories.length > 0 ||
    selectedStatus.length > 0;

  return (
    <>
      <Head>
        <title>Projects</title>
        <meta
          name="description"
          content="Explore my projects and portfolio work"
        />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Projects</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A collection of my work, experiments, and creative projects. 
            Browse through to see what I&apos;ve been working on!
          </p>
        </header>

        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
              <FilterIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Filters:</span>
              
              {/* Categories filter */}
              <div className="flex flex-wrap gap-1 p-1">
                {allCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              {/* Status filter */}
              <div className="flex flex-wrap gap-1 p-1">
                {['completed', 'in-progress', 'planned'].map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatus.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Clear filters button */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <XIcon className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured projects */}
        {!hasFilters && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.featured)
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </section>
        )}

        {/* Projects by year */}
        <div className="space-y-12">
          {(hasFilters ? filteredYears : years).map((year) => (
            <section key={year}>
              <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                {year}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(hasFilters ? filteredProjectsByYear : projectsByYear)[year].map(
                  (project) => (
                    <ProjectCard key={project.id} project={project} />
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        {/* No results message */}
        {hasFilters && filteredYears.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">
              No projects match your filters.
            </p>
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </>
  );
}