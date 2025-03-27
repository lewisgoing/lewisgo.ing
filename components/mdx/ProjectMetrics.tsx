import React from 'react';
import { FaStar, FaCodeBranch, FaEye, FaRegCalendarAlt } from 'react-icons/fa';

interface ProjectMetricsProps {
  stars?: number;
  forks?: number;
  views?: number;
  lastUpdated?: string;
}

const ProjectMetrics: React.FC<ProjectMetricsProps> = ({
  stars,
  forks,
  views,
  lastUpdated,
}) => {
  return (
    <div className="flex flex-wrap gap-4 my-4">
      {stars !== undefined && (
        <div className="flex items-center text-amber-600 dark:text-amber-500">
          <FaStar className="mr-1.5" />
          <span className="text-sm">{stars} stars</span>
        </div>
      )}
      
      {forks !== undefined && (
        <div className="flex items-center text-violet-600 dark:text-violet-500">
          <FaCodeBranch className="mr-1.5" />
          <span className="text-sm">{forks} forks</span>
        </div>
      )}
      
      {views !== undefined && (
        <div className="flex items-center text-emerald-600 dark:text-emerald-500">
          <FaEye className="mr-1.5" />
          <span className="text-sm">{views} views</span>
        </div>
      )}
      
      {lastUpdated && (
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaRegCalendarAlt className="mr-1.5" />
          <span className="text-sm">Updated {lastUpdated}</span>
        </div>
      )}
    </div>
  );
};


export default ProjectMetrics;