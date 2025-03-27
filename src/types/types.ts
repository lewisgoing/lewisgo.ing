// lib/types.ts

// Project type definition
export interface Project {
    id: string;
    slug: string;
    name: string;
    description: string;
    tags: string[];
    image: string;
    link: string;
    date: Date;
    authors?: Author[];
    content?: string;
    draft?: boolean;
    hidden?: boolean;
  }
  
  // Author type definition
  export interface Author {
    id: string;
    name: string;
    pronouns?: string;
    avatar: string;
    bio?: string;
    mail?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
  }
  
  // Pagination type for projects list
  export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
  }
  
  // Breadcrumb item type
  export interface BreadcrumbItem {
    href?: string;
    label: string;
    icon?: string;
  }
  
  // Navigation between projects
  export interface ProjectNavigation {
    prevProject?: {
      id: string;
      slug: string;
      name: string;
    };
    nextProject?: {
      id: string;
      slug: string;
      name: string;
    };
  }