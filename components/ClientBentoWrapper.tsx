'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import with no SSR for Bento component
const Bento = dynamic(() => import('@/components/Bento'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading portfolio...</div>
    </div>
  )
});

export default function ClientBentoWrapper() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading portfolio...</div>
    </div>}>
      <Bento />
    </Suspense>
  );
}