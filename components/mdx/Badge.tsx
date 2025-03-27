import React from 'react';

interface BadgeProps {
  label: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ label, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {label}
    </span>
  );
};

export default Badge;