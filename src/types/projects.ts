// data/projects.ts
import { Project } from 'src/types/types';

// Sample projects data
export const projects: Project[] = [
  {
    id: '1',
    slug: 'nextjs-portfolio',
    name: 'Next.js Portfolio',
    description: 'A modern portfolio website built with Next.js and Tailwind CSS',
    tags: ['next.js', 'typescript', 'tailwind'],
    image: '/images/projects/nextjs-portfolio.png',
    link: 'https://github.com/username/nextjs-portfolio',
    date: new Date('2023-10-15'),
    authors: [
      {
        id: 'john-doe',
        name: 'John Doe',
        avatar: '/images/authors/john-doe.png',
      }
    ]
  },
  {
    id: '2',
    slug: 'react-dashboard',
    name: 'React Admin Dashboard',
    description: 'A feature-rich admin dashboard with dark mode and real-time data',
    tags: ['react', 'typescript', 'chart.js'],
    image: '/images/projects/react-dashboard.png',
    link: 'https://github.com/username/react-dashboard',
    date: new Date('2023-08-22')
  },
  {
    id: '3',
    slug: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'An application that generates images from text prompts using AI',
    tags: ['ai', 'next.js', 'tailwind'],
    image: '/images/projects/ai-image-generator.png',
    link: 'https://github.com/username/ai-image-generator',
    date: new Date('2023-05-10')
  },
  {
    id: '4',
    slug: 'mobile-fitness-app',
    name: 'Mobile Fitness App',
    description: 'A cross-platform fitness application with workout tracking',
    tags: ['react-native', 'expo', 'firebase'],
    image: '/images/projects/mobile-fitness-app.png',
    link: 'https://github.com/username/mobile-fitness-app',
    date: new Date('2022-12-05')
  },
  {
    id: '5',
    slug: 'ecommerce-platform',
    name: 'E-commerce Platform',
    description: 'A full-featured e-commerce solution with payment processing',
    tags: ['next.js', 'typescript', 'stripe'],
    image: '/images/projects/ecommerce-platform.png',
    link: 'https://github.com/username/ecommerce-platform',
    date: new Date('2022-09-18')
  }
];

// Get all projects sorted by date (newest first)
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

// Get projects by year
export function getProjectsByYear(): Record<string, Project[]> {
  return getAllProjects().reduce(
    (acc: Record<string, Project[]>, project) => {
      const year = project.date.getFullYear().toString();
      (acc[year] ??= []).push(project);
      return acc;
    },
    {}
  );
}

// Get navigation links for a specific project
export function getProjectNavigation(slug: string): { prevProject?: Project; nextProject?: Project } {
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex(p => p.slug === slug);
  
  if (currentIndex === -1) return {};
  
  return {
    prevProject: currentIndex > 0 ? allProjects[currentIndex - 1] : undefined,
    nextProject: currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : undefined
  };
}