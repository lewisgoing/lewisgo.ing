// components/about/AboutLayout.tsx


import React, { ReactNode } from 'react';
// import { unstable_cacheLife as cacheLife } from 'next/cache';
import SectionContainer from '@/components/layout/SectionContainer';
import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/NavBar';

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  // Use the staticContent cache profile for this layout
  // cacheLife('staticContent');
  
  return (
    <div className="flex h-full flex-col justify-between font-sans">
      <NavBar />
      <main className="mb-auto">
        <SectionContainer>
          {children}
        </SectionContainer>
      </main>
      <Footer />
    </div>
  );
}