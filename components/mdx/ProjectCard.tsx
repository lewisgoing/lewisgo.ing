import React from 'react';
import Image from 'next/image';
import Badge from './Badge';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  children?: React.ReactNode;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  technologies,
  githubUrl,
  liveUrl,
  featured = false,
  children,
}) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 transition-all hover:shadow-lg ${featured ? 'border-2 border-indigo-500 dark:border-indigo-400' : ''}`}>
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={`${title} thumbnail`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <Badge key={tech} label={tech} />
          ))}
        </div>
        
        {children && <div className="mb-4">{children}</div>}
        
        <div className="flex gap-3 mt-auto">
          {githubUrl && (
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <FaGithub size={20} />
            </Link>
          )}
          {liveUrl && (
            <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <FaExternalLinkAlt size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;