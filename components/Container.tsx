// components/Container.tsx
import React from 'react';
import { cn } from 'src/utils/tailwind-helpers';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl", 
      className
    )}>
      {children}
    </div>
  );
};

export default Container;