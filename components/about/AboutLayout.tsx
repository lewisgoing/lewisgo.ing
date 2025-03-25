// components/about/AboutLayout.tsx


import React, { ReactNode } from 'react';
// import { unstable_cacheLife as cacheLife } from 'next/cache';
import SectionContainer from '../SectionContainer';
import Footer from '../Footer';
import NavBar from '../NavBar';

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