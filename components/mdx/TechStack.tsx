import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

interface Technology {
  name: string;
  icon: string;
  url?: string;
}

interface TechStackProps {
  title?: string;
  technologies: Technology[];
}

const TechStack: React.FC<TechStackProps> = ({
  title = 'Technologies Used',
  technologies
}) => {
  const getIcon = (iconName: string) => {
    // Try to get icon from Font Awesome
    const faIcon = (FaIcons as any)[iconName];
    if (faIcon) return faIcon;
    
    // Try to get icon from Simple Icons
    const siIcon = (SiIcons as any)[iconName];
    if (siIcon) return siIcon;
    
    // Fallback to a default icon if not found
    return FaIcons.FaQuestion;
  };

  return (
    <div className="my-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      )}
      
      <div className="flex flex-wrap gap-4">
        {technologies.map((tech) => {
          const Icon = getIcon(tech.icon);
          return (
            <div key={tech.name} className="flex flex-col items-center">
              {tech.url ? (
                <a 
                  href={tech.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 group-hover:shadow-md transition-shadow">
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  </div>
                  <span className="mt-2 text-xs text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tech.name}</span>
                </a>
              ) : (
                <>
                  <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">{tech.name}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStack;