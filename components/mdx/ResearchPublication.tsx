import React from 'react';
import { FaFileAlt, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

interface ResearchPublicationProps {
  title: string;
  authors: string[];
  publication: string;
  date: string;
  abstract?: string;
  pdfUrl?: string;
  doiUrl?: string;
  showAbstract?: boolean;
}

const ResearchPublication: React.FC<ResearchPublicationProps> = ({
  title,
  authors,
  publication,
  date,
  abstract,
  pdfUrl,
  doiUrl,
  showAbstract = false,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        {authors.join(', ')}
      </div>
      
      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {publication} • {date}
      </div>
      
      {showAbstract && abstract && (
        <div className="my-4 text-gray-700 dark:text-gray-300 text-sm border-l-4 border-indigo-500 pl-4 py-1">
          {abstract}
        </div>
      )}
      
      <div className="mt-4 flex gap-3">
        {pdfUrl && (
          <Link 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            <FaFileAlt className="mr-1.5" /> PDF
          </Link>
        )}
        
        {doiUrl && (
          <Link 
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <FaExternalLinkAlt className="mr-1.5" size={12} /> DOI
          </Link>
        )}
      </div>
    </div>
  );
};


export default ResearchPublication;