// src/app/projects/page.tsx

import React from 'react';
import AboutProjects from '@/components/about/AboutProjects';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Projects | lewisgo.ing',
  description: 'Projects and personal work by Lewis Going',
};

export default function ProjectsPage() {
  return (
    // <LayoutWrapper>
    <>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <AboutProjects />
      </div>
    </>


  );
}