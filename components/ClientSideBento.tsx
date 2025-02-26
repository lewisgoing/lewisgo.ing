'use client';

import dynamic from 'next/dynamic';
import React, { Suspense, useEffect, useState } from 'react';
import { useLanyard } from 'react-use-lanyard';
import { Skeleton } from './shadcn/skeleton';

// Dynamic imports with no SSR for React Three Fiber components
const Bento = dynamic(() => import('./Bento'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  ),
});

const AnimatedCursorWrapper = dynamic(() => import('./AnimatedCursorWrapper'), {
  ssr: false,
});

// Import the SpotifyUpdateHandler from app directory
import SpotifyUpdateHandler from '@/app/components/spotify/SpotifyUpdateHandler';

export default function ClientSideBento() {
  // Get Lanyard data
  const lanyard = useLanyard({
    userId: "661068667781513236",
  });
  
  // Client-side mounting check to avoid hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      {/* Invisible handler to update Spotify data */}
      {lanyard.data && !lanyard.isValidating && (
        <SpotifyUpdateHandler lanyard={lanyard.data} />
      )}
      
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      }>
        <Bento />
      </Suspense>
      <AnimatedCursorWrapper />
    </>
  );
}