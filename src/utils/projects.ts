// lib/projects.ts
import { Project } from '../types/old-projects';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the projects directory path
const projectsDirectory = path.join(process.cwd(), 'public/projects');

/**
 * Get data for all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  // Get all project files
  const fileNames = fs.readdirSync(projectsDirectory);
  
  const allProjectsData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get the project ID
    const id = fileName.replace(/\.mdx$/, '');
    
    // Read markdown file as string
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the project metadata section
    const { data, content } = matter(fileContents);
    
    // Convert date strings to Date objects
    const date = new Date(data.date);
    
    // Return project data with ID
    return {
      id,
      content,
      date,
      ...data,
    } as Project;
  });
  
  // Sort projects by date in descending order
  return allProjectsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get data for a specific project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the project metadata section
    const { data, content } = matter(fileContents);
    
    // Convert date strings to Date objects
    const date = new Date(data.date);
    
    // Return project data with ID and content
    return {
      id: slug,
      title: data.title || '',
      description: data.description || '',
      longDescription: data.longDescription,
      status: data.status,
      completedDate: data.completedDate,
      technologies: data.technologies || [],
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      thumbnailUrl: data.thumbnailUrl,
      projectUrl: data.projectUrl || '',
      featured: data.featured,
      category: data.category || 'other',
      images: data.images,
      detailedContent: data.detailedContent,
      content,
      date,
      tags: data.tags,
    } as Project;
  } catch (error) {
    console.error(`Error reading project file for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get related projects based on category or tags
 */
export async function getRelatedProjects(currentId: string, limit = 3) {
  const currentProject = await getProjectBySlug(currentId);
  if (!currentProject) return [];
  
  const allProjects = await getAllProjects();
  
  // Filter out current project and find related ones
  const relatedProjects = allProjects
    .filter((project) => 
      project.id !== currentId && (
        project.category === currentProject.category ||
        project.tags?.some((tag: string) => 
          currentProject.tags?.includes(tag)
        )
      )
    )
    .slice(0, limit);
    
  return relatedProjects;
}