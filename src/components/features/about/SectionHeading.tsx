// components/about/SectionHeading.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  useUnderline?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  alignment = 'left',
  useUnderline = false,
  className = '',
}) => {
  // Text alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <motion.div 
      className={`mb-10 ${alignmentClasses[alignment]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-2 relative inline-block">
        {title}
        
        {useUnderline && (
          <motion.span 
            className="absolute -bottom-1 left-0 h-1 bg-primary rounded"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              ease: [0.6, 0.05, 0.01, 0.9]
            }}
          />
        )}
      </h2>
      
      {subtitle && (
        <p className="text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default SectionHeading;